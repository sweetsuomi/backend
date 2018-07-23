const Store = require('./store');
const Validate = require('./validations');
const e = require('../../helpers/errors');

exports.post = post;

function post(dish, quantity, order) {
	return Validate.post(dish, quantity, order).then(() => {
		return Store.post(dish, quantity, order);
	}).then(() => {
		return { data: true };
	});
}