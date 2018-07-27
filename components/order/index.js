const moment = require('moment');
const Store = require('./store');
const mail = require('../../mails');
const config = require('../../config');
const aws = require('../aws/index');
const Validate = require('./validations');
const orderDish = require('../orderDish');
const menu = require('../menu');
const e = require('../../helpers/errors');

exports.list = list;
exports.post = post;
exports.deliver = deliver;
exports.remove = remove;

function list(query) {
	const offset = query.offset ? parseInt(query.offset) : 0;
	const limit = query.limit ? parseInt(query.limit) : 1000;

	if (query.date) {
		query.date = parseInt(query.date.replace(/-/g, ''), 10);
	}

	return Store.list(query.user, query.date, offset, limit).then(order => {
		return { data: order };
	});
}

function post(user, data) {
	return Validate.post(data.date, data.note, data.time, data.schedule).then(() => {
		data.date = parseInt(data.date.replace(/-/g, ''), 10);
	}).then(() => {
		return menu.hasEnoughQuantity(data.order, data.date, data.schedule);
	}).then(() => {
		return Store.post(user.sub, data.date, data.note, data.time.replace(/:/g, ''));
	}).then(response => {
		return orderDish.post(response._id, data.order);
	}).then(() => {
		data.email = config.admin_email;
		data.dishes = '';
		data.nickname = user.name;
		for (let i = 0; i < data.order.length; i += 1) {
			menu.updateDishQuantity(data.order[i].dish, data.date, data.schedule, data.order[i].quantity);
			data.dishes += '<tr><td><table style="margin: 0 auto;"><tr><td><img style="width:50px;" src="' + config.aws_cloudfront + 'dish/' + data.order[i].dish + '.png" /></td><td><p style="text-align:left;">' + data.order[i].name + ' - Cantidad: ' + data.order[i].quantity + '</table></p></td></tr>';
		}
		sendOrderEmail('newOrder', 'Sweetsuomi - Nuevo pedido', data);
	}).then(() => {
		return { data: true };
	});
}

function deliver(data) {
	return Validate.deliver(data.order, data.deliver).then(() => {
		return Store.deliver(data.order, data.deliver);
	}).then(() => {
		return { data: true };
	});
}

// Validate & remove the order in case you are admin or in case that the margin of time is less than 1 hour
function remove(user, order) {
	return Validate.remove(order).then(() => {
		return Store.get(order);
	}).then(response => {
		const time = parseInt(moment().format('HH:mm').replace(/:/g, ''), 10);

		if (!user.isAdmin && response.time - time < 60) {
			throw e.error('ORDER_DELETE_FORBIDDEN');
		}

		return orderDish.remove(order);
	}).then(() => {
		return Store.remove(order);
	}).then(() => {
		sendOrderEmail('cancelOrder', 'Sweetsuomi - Pedido cancelado', {});
		sendOrderEmail('userCancelOrder', 'Sweetsuomi - Pedido cancelado', {});
		return { data: true };
	});
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

// (CancelOrder, { nickname: nickname, email: email })

// let dishes = '';
//	for (let i = 0; i < order.length; i += 1) {
//		dishes += '<tr><td>' + order[i].dish.title + ' - Cantidad: ' + order[i].quantity + '</tr></td>';
//	}
// (UserCancelOrder, { dishes: dishes })

function sendOrderEmail(type, title, data) {
	mail.build(type, data).then(response => {
		return aws.sendMail(data.email, title, response);
	});
}