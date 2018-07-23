const Promise = require('bluebird');
const Validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.post = post;
exports.upsert = upsert;
exports.disable = disable;

function post(name, timeStart, timeEnd) {
	return verifyName(name).then(() => {
		return verifyTime(timeStart);
	}).then(() => {
		return verifyTime(timeEnd);
	}).then(() => {
		return isValidTimeDifference(timeStart, timeEnd)
	});
}

function upsert(id, name, timeStart, timeEnd) {
	return verifyId(id).then(() => {
		return verifyName(name || null)
	}).then(() => {
		return verifyTime(timeStart || null);
	}).then(() => {
		return verifyTime(timeEnd || null);
	}).then(() => {
		if (timeEnd && timeStart) {
			return isValidTimeDifference(timeStart, timeEnd);
		}
		return;
	});
}

function disable(id) {
	return verifyId(id);
}

function isValidTimeDifference(timeStart, timeEnd) {
	return new Promise((resolve, reject) => {
		if (!Validations.isValidTimeDifference(timeStart, timeEnd)) {
			return reject(e.error('SCHEDULE_TIME_NOT_VALID'));
		}
		resolve();
	});
}

function verifyId(id) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(id)) {
			return reject(e.error('SCHEDULE_NOT_EXIST'));
		} else if (!Validations.isMongoose(id)) {
			return reject(e.error('SCHEDULE_ID_NOT_VALID'));
		}
		resolve();
	});
}

function verifyName(name) {
	return new Promise((resolve, reject) => {
		if (name === null) {
			resolve();
		} else if (Validations.isUndefined(name)) {
			return reject(e.error('SCHEDULE_NAME_NOT_DEFINED'));
		} else if (!Validations.isString(name)) {
			return reject(e.error('SCHEDULE_NAME_NOT_VALID'));
		} else if (!Validations.minLength(name, 2)) {
			return reject(e.error('SCHEDULE_NAME_IS_SHORTER'));
		} else if (!Validations.maxLength(name, 25)) {
			return reject(e.error('SCHEDULE_NAME_IS_LONGER'));
		}
		resolve();
	});
}

function verifyTime(time) {
	return new Promise((resolve, reject) => {
		if (time === null) {
			resolve();
		} else if (Validations.isUndefined(time)) {
			return reject(e.error('SCHEDULE_TIME_NOT_DEFINED'));
		} else if (!Validations.isValidDateTime(time)) {
			return reject(e.error('SCHEDULE_TIME_NOT_VALID'));
		}
		resolve();
	});
}