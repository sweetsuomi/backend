const Store = require('./store');
const Validate = require('./validations');
const e = require('../../helpers/errors');

exports.post = post;
exports.remove = remove;
exports.getByOrder = getByOrder;
exports.removeByOrder = removeByOrder;

function post(id, order) {
	return Validate.post(id, order).then(() => {
		for (let i = 0; i < order.length; i += 1) {
			Store.post(order[i].dish, order[i].quantity, id);
		}
	});
}

function remove() {

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