const Store = require('./store');
const Validate = require('./validations');
const e = require('../../helpers/errors');

exports.exist = exist;
exports.list = list;
exports.count = count;
exports.get = get;
exports.post = post;
exports.validate = validate;
exports.getByAccount = getByAccount;

function validate(nickname, phone, company, address) {
	return Validate.post(nickname, phone, company, address);
}

function list() {
	return Store.list();
}

function count() {
	return Store.count();
}

function exist(nickname) {
	return Validate.exist(nickname).then(() => {
		return Store.exist({ nickname: nickname });
	}).then(exist => {
		if (exist) {
			throw e.error('NICKNAME_IN_USE', 409);
		}
		return { code: 200, data: {} };
	});
}

function get(id) {
	return Validate.get(id).then(() => {
		return Store.get(id);
	}).then(response => {
		return { code: 200, data: response };
	});
}

function post(nickname, phone, company, address, account_id) {
	return Store.post(nickname, phone, company, address, account_id);
}

function getByAccount(id) {
	return Validate.get(id).then(() => {
		return Store.getByAccount(id);
	})
}