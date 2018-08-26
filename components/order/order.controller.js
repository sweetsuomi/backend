"use strict";

const Menu = require("../menu/menu.model");
const Order = require("./order.model");
const OrderDish = require("./order-dish.model");
const User = require("../user/user.model");
const mail = require("./cancelOrder.mail");
const userCancelOrderMail = require("./userCancelOrder.mail");
const AWS = require("../aws/aws.model");
const mongoose = require('mongoose');

function getAllOrders(req, res, next) {
	Order.getAllOrders(req.query.date).then(response => {
		req.orderList = response;
		let orderList = response.map(order => {
			return mongoose.Types.ObjectId(order._id);
		});
		return OrderDish.getOrderList(orderList);
	}).then(response => {
		res.status(200).json({
			orderList: req.orderList,
			dishes: response
		});
	}).catch(error => next(error));
}

function deliverOrder(req, res, next) {
	Order.deliverOrder(req.body.orderId)
		.then(() => res.status(200).send())
		.catch(error => next(error));
}

function deleteOrderForce(req, res, next) {
	Order.deleteOrderForce(req.query.orderId)
		.then(() => {
			return OrderDish.deleteOrderDishes(req.query.orderId);
		}).then(() => {
			return User.getUser(req.query.user_id);
		}).then(response => {
			req.userMail = response.credentials.email;
			return mail();
		}).then(response => {
			return AWS.ses.sendMail(req.userMail, 'Your order has been cancelled', response);
		}).then(data => res.status(200).send(data))
		.catch(error => next(error));
}

function getUserOrderList(req, res, next) {
	Order.getUserOrderList(req.userId, req.query.date)
		.then(response => {
			req.orderList = response;
			let orderList = response.map(order => {
				return mongoose.Types.ObjectId(order._id);
			});
			return OrderDish.getOrderList(orderList);
		}).then(response => {
			res.status(200).json({
				orderList: req.orderList,
				dishes: response
			});
		}).catch(error => next(error));
}

function getUserOrderByDay(req, res, next) {
	Order.getOrder(req.userId, req.query.date)
		.then(response => {
			req.order = response;
			return OrderDish.getOrderList([response._id]);
		}).then(response => {
			res.status(200).json({
				order: req.order,
				dishes: response
			});
		}).catch(error => next(error));
}

function postOrder(req, res, next) {
	Menu.checkMenuHasEnoughQuantity(req.body.order, req.body.date)
		.then(() => {
			return Order.postOrder(req.body.date, req.body.note, req.userId);
		}).then(response => {
			req.orderId = response;
			return OrderDish.postOrder(req.body.order, response);
		}).then(() => {
			return Menu.updateQuantityAfterOrderComplete(req.body.order, req.body.date);
		}).then(() => res.status(200).send())
		.catch(error => next(error));
}

function deleteOrder(req, res, next) {
	OrderDish.getOrderList([req.query.orderId])
		.then(response => {
			req.orderList = response;
			return Menu.replaceItems(response, req.query.date);
		}).then(() => {
			return Order.deleteOrder(req.query.orderId);
		}).then(() => {
			return userCancelOrderMail(req.orderList);
		}).then(response => {
			return AWS.ses.sendMail('jesushuertaarrabal@gmail.com', 'Un pedido ha sido eliminado', response);
		}).then(() => res.status(200).send())
		.catch((error) => next(error));
}

module.exports = {
	getAllOrders: getAllOrders,
	deliverOrder: deliverOrder,
	deleteOrderForce: deleteOrderForce,
	getUserOrderList: getUserOrderList,
	getUserOrderByDay: getUserOrderByDay,
	postOrder: postOrder,
	deleteOrder: deleteOrder
};
