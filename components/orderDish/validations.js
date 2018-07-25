const Promise = require('bluebird');
const Validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.post = post;

function post(id, order) {
    return Promise.all([
        verifyId(id),
        verifyOrder(order)
    ]);
}

function verifyId(id) {
    return new Promise((resolve, reject) => {
		if (Validations.isUndefined(id)) {
			return reject(e.error('ORDER_ID_NOT_DEFINED'));
		} else if (!Validations.isMongoose(id)) {
			return reject(e.error('ORDER_ID_NOT_DEFINED'));
		}
		resolve();
	});
}

function verifyOrder(order) {
    return new Promise((resolve, reject) => {
		if (Validations.isUndefined(order)) {
			return reject(e.error('ORDER_DISH_NOT_DEFINED'));
		} else if (!Validations.isArray(order)) {
			return reject(e.error('ORDER_DISH_NOT_VALID'));
		}
		resolve();
	});
}