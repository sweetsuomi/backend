const Validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.exist = exist;
exports.get = get;
exports.post = post;

function exist(nickname) {
	return verifyNickname(nickname);
}

function get(id) {
	return verifyId(id);
}

function post(nickname, phone, company, address) {
	return verifyNickname(nickname).then(() => {
		return verifyPhone(phone || undefined);
	}).then(() => {
		return verifyAddress(address || undefined);
	}).then(() => {
		return verifyCompany(company || undefined);
	});
} 

function verifyId(id) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(id)) {
			return reject(e.error('CATEGORY_ID_NOT_DEFINED'));
		} else if (!Validations.isMongoose(id)) {
			return reject(e.error('CATEGORY_ID_NOT_DEFINED'));
		}
		resolve();
	});
}

function verifyNickname(nickname, error) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(nickname)) {
			return reject(e.error('NICKNAME_IS_REQUIRED'));
		} else if (!Validations.isString(nickname)) {
			return reject(e.error('NICKNAME_IS_NOT_VALID'));
		} else if (!Validations.minLength(nickname, 5)) {
			return reject(e.error('NICKNAME_IS_SHORTER'));
		} else if (!Validations.maxLength(nickname, 50)) {
			return reject(e.error('NICKNAME_IS_LONGER'));
		}
		resolve();
	});
}
	
function verifyPhone(phone) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(phone)) {
			return resolve();
		} else if (!Validations.isNumber(phone)) {
			return reject(e.error('PHONE_IS_NOT_VALID'));
		}
		resolve();
	});
}

function verifyAddress(address) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(address)) {
			return resolve();
		} else if (!Validations.isString(address)) {
			return reject(e.error('ADDRESS_IS_NOT_VALID'));
		} else if (!Validations.minLength(address, 5)) {
			return reject(e.error('ADDRESS_IS_LONGER'));
		} else if (!Validations.maxLength(address, 100)) {
			return reject(e.error('ADDRESS_IS_SHORTER'));
		}
		resolve();
	});
}

function verifyCompany(company) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(company)) {
			return resolve();
		} else if (!Validations.isString(company)) {
			return reject(e.error('COMPANY_NAME_IS_NOT_VALID'));
		} else if (!Validations.minLength(company, 3)) {
			return reject(e.error('COMPANY_NAME_IS_SHORTER'));
		} else if (!Validations.maxLength(company, 50)) {
			return reject(e.error('COMPANY_NAME_IS_LONGER'));
		}
		resolve();	
	});
}