const Promise = require('bluebird');
const Validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.post = post;
exports.update = update;
exports.remove = remove;

function post(name) {
	return verifyName(name);
}

function update(id, name) {
	return verifyId(id).then(() => {
		return verifyName(name);
	});
}

function remove(id) {
	return verifyId(id);
}

function verifyId(id) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(id)) {
			return reject(e.error('CATEGORY_ID_NOT_DEFINED'));
		} else if (!Validations.isMongoose(id)) {
			return reject(e.error('CATEGORY_ID_NOT_VALID'));
		}
		resolve();
	});
}

function verifyName(name) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(name)) {
			return reject(e.error('CATEGORY_NAME_NOT_DEFINED'));
		} else if (!Validations.isString(name)) {
			return reject(e.error('CATEGORY_NAME_NOT_VALID'));
		} else if (!Validations.minLength(name, 4)) {
			return reject(e.error('CATEGORY_NAME_SHORTER'));
		} else if (!Validations.maxLength(name, 20)) {
			return reject(e.error('CATEGORY_NAME_LONGER'));
		}
		resolve();
	});
}