const Promise = require('bluebird');
const Validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.post = post;
exports.deliver = deliver;
exports.remove = remove;

function post(note, time) {
    return Promise.all([
        verifyTime(time),
        verifyNote(note)
    ]);
}

function deliver(order, status) {
	return Promise.all([
		verifyOrder(order),
		verifyStatus(status)
	]);
}

function remove(order) {
	return verifyOrder(order);
}

function verifyOrder(order) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(order)) {
			return reject(e.error('ORDER_NOT_DEFINED'));
		} else if (!Validations.isMongoose(order)) {
			return reject(e.error('ORDER_NOT_VALID'));
		}
		resolve();
	});
}

function verifyStatus(status) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(status)) {
			return reject(e.error('ORDER_STATUS_NOT_DEFINED'));
		}
		resolve();
	});
}

function verifyTime(time) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(time)) {
			return reject(e.error('ORDER_TIME_NOT_DEFINED'));
		} else if (!Validations.isString(time)) {
			return reject(e.error('ORDER_TIME_NOT_VALID'));
		} else if (!Validations.maxLength(time, 5)) {
			return reject(e.error('ORDER_TIME_NOT_VALID'));
		} else if (!Validations.minLength(time, 5)) {
			return reject(e.error('ORDER_TIME_NOT_VALID'));
		}
		resolve();
	});
};

function verifyNote(note) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(note)) {
			return resolve();
		} else if (!Validations.isString(note)) {
			return reject(e.error('ORDER_NOTE_NOT_VALID'));
        } else if (!Validations.maxLength(note, 100)) {
			return reject(e.error('ORDER_NOTE_SHORTER'));
        }
        resolve();
    });
}