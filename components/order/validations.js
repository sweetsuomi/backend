const Promise = require('bluebird');
const Validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.post = post;

function post(date, note, time) {
    return Promise.all([
        verifyTime(time),
        verifyDate(date),
        verifyNote(note)
    ]);
}

function verifyTime(time) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(time)) {
			return reject(e.error('ORDER_TIME_NOT_DEFINED'));
		} else if (!Validations.isMongoose(time)) {
			return reject(e.error('ORDER_TIME_NOT_DEFINED'));
		}
		resolve();
	});
};

function verifyDate(date) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(date)) {
			return reject(e.error('ORDER_DATE_NOT_DEFINED'));
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