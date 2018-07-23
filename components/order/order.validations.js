'use strict';

const Promise = require('bluebird');
const validations = require('../../helpers/validations');

// Parameters

const dateListValidations = function (date) {
	return validations.isUndefined('date', date)
		.then(() => {
			return validations.isDate(date);
		});
};

const userIdListValidations = function (userId) {
	return validations.isUndefined('user', userId)
		.then(() => {
			return validations.isMongoose(userId);
		});
};

const dishIdListValidations = function (dishId) {
	return validations.isUndefined('dish', dishId)
		.then(() => {
			return validations.isMongoose(dishId);
		});
};

const quantityListValidations = function (quantity) {
	return validations.isUndefined('quantity', quantity)
		.then(() => {
			return validations.isNumber(quantity);
		})
		.then(() => {
			return validations.isPositiveNumber(quantity);
		});
};


// Functions

const getAllOrders = function (req, res, next) {
	dateListValidations(req.query.date).then(() => {
		return Promise.resolve(next());
	}).catch(e => next(e));
};

//const deliverOrder = function (req, res, next) {
//	dateListValidations(req.body.orderId).then(() => {
//		return Promise.resolve(next());
//	}).catch(e => next(e));
//};

//const deleteOrderForce = function (req, res, next) {
//	Promise.all([
//		dateListValidations(req.query.date),
//		userIdListValidations(req.query.user_id)
//	]).then(() => {
//		return validations.checkDateIsGreater(req.query.date);
//	}).then(() => {
//		return Promise.resolve(next());
//	}).catch(e => next(e));
//};

const postOrder = function (req, res, next) {
	let promises = [];

	for (let i = 0; i < req.body.order.length; i += 1) {
		promises.push(
			dishIdListValidations(req.body.order[i].dish),
			quantityListValidations(req.body.order[i].quantity)
		);
	}

	dateListValidations(req.body.date).then(() => {
		return Promise.all(promises);
	}).then(() => {
		return validations.checkDateIsGreater(req.query.date);
	}).then(() => {
		return Promise.resolve(next());
	}).catch(e => next(e));
};

const deleteOrder = function (req, res, next) {
	Promise.all([
		userIdListValidations(req.userId),
		dateListValidations(req.query.date)
	]).then(() => {
		return Promise.resolve(next());
	}).catch((e) => {
		next(e);
	});
};

module.exports = {
	getAllOrders: getAllOrders,
//	deliverOrder: deliverOrder,
//	deleteOrderForce: deleteOrderForce,
	postOrder: postOrder,
	deleteOrder: deleteOrder
};
