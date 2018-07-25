const Store = require('./store');
const Validate = require('./validations');
const e = require('../../helpers/errors');

exports.post = post;

function post(id, order) {
	return Validate.post(id, order).then(() => {
		for (let i = 0; i < order.length; i += 1) {
			Store.post(order[i].dish, order[i].quantity, id);
		}
	});
}