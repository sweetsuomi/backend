const Promise = require('bluebird');
const Validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.exist = exist;
exports.post = post;

function exist(email) {
	return verifyEmail(email);
}

function post(email, password) {
	return verifyEmail(email).then(function () {
		return verifyPassword(password);
	});
}

function verifyEmail(email) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(email)) {
			return reject(e.error('EMAIL_IS_REQUIRED'));
		} else if (!Validations.isEmail(email)) {
			return reject(e.error('EMAIL_NOT_VALID'));
		} else if (!Validations.minLength(email, 6)) {
			return reject(e.error('EMAIL_IS_SHORTER'));
		} else if (!Validations.maxLength(email, 100)) {
			return reject(e.error('EMAIL_IS_LONGER'));
		}
		resolve();
	});
}
	
function verifyPassword(password) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(password)) {
			return reject(e.error('PASSWORD_IS_REQUIRED'));
		} else if (!Validations.isString(password)) {
			return reject(e.error('PASSWORD_IS_NOT_VALID'));
		} else if (!Validations.minLength(password, 5)) {
			return reject(e.error('PASSWORD_IS_SHORTER'));
		} else if (!Validations.maxLength(password, 30)) {
			return reject(e.error('PASSWORD_IS_LONGER'));
		}
		resolve();
	});
}