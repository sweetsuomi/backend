const Store = require('./store');
const Validate = require('./validations');
const dish = require('../dish');
const e = require('../../helpers/errors');

exports.post = post;
exports.getFinalPrice = getFinalPrice;
exports.getByOrder = getByOrder;
exports.removeByOrder = removeByOrder;
exports.amountSold = amountSold;

function post(id, order) {
	return Validate.post(id, order).then(() => {
		for (let i = 0; i < order.length; i += 1) {
			Store.post(order[i].menu.dish._id, order[i].quantity, id, order[i].menu._id);
		}
	});
}

function getFinalPrice(order) {
	const promises = order.map(element => dish.getFinalPrice(element.dish));
	return Promise.all(promises).then(response => {
		return response.length === 1 ? response[0].price : response.reduce((previous, current) => previous.price + current.price);
	});
}

function getByOrder(order) {
	return Validate.getByOrder(order).then(() => {
		return Store.getByOrder(order);
	})
}

function removeByOrder(orderId) {
	return Validate.removeByOrder(orderId).then(() => {
		return Store.removeByOrder(orderId);
	});
}

function amountSold() {
	return Store.amountSold().then(response => {
		return response;
	});
}