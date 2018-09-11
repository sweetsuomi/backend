const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Store = require('./store');
const Validate = require('./validations');
const User = require('../user');
const config = require('../../config');
const mail = require('../../mails');
const aws = require('../aws');
const e = require('../../helpers/errors');
 
exports.exist = exist;
exports.register = register;
exports.login = login;

function exist(email) {
	return Validate.exist(email).then(() => {
		return accountExist(email);
	}).then(() => {		
		return { code: 200, data: {} };
	});
}

function register(data) {
	return Validate.post(data.email, data.password).then(() => {	
		return User.exist(data.nickname);
	}).then(() => {
		return User.validate(data.nickname, data.phone, data.company, data.address);
	}).then(() => {
		return registerAccount(data.password.trim(), data.email.trim(), data.nickname.trim(), data.role.trim());
	}).then(account_id => {
		return User.post(data.nickname.trim(), data.phone, data.company.trim(), data.address.trim(), account_id);
	}).then(() => {
		return sendRegisterEmail(data);
	}).then(() => {
		return { code: 204, data: {} };
	});
}

function login(data) {
	let account = {};

	return Validate.post(data.email, data.password).then(() => {
		return Store.get(data.email.trim());
	}).then(response => {
		if (!response) {
			throw e.error('EMAIL_NOT_VALID');
		}
		account = response;
		return User.getByAccount(account._id);
	}).then(response => {
		account.userId = response._id;
		return comparePasswordHash(data.password.trim(), account.password || null);
	}).then(areEqual => {
		if (areEqual === false) {
			throw e.error('PASSWORD_IS_NOT_VALID');
		}
		let token = createToken(account);
		return { code: 200, data: {
			jwt: token,
			userId: account.userId,
			nickname: account.username,
			role: account.role
		} };
	});
}

/*
* Internal functions
*/

function accountExist(email) {
	return Store.exist({ email: email }).then(exist => {
		if (exist) {
			throw e.error('EMAIL_IN_USE', 409);
		}
		return;
	});
}

function registerAccount(password, email, nickname, role) {
	return hashPassword(password).then(hash => {
		return Store.post(email, nickname, hash, role || 'user');
	}).then(response => {
		return response._id;
	});
}

function hashPassword(password) {
	return bcrypt.hash(password, parseInt(config.salt_rounds))
		.catch(error => {
			throw e.error('REGISTER_ERROR', 400);
		});
}

function comparePasswordHash(password, hash) {
	return bcrypt.compare(password, hash).catch(error => {
		return false;
	});
}

function sendRegisterEmail(data) {
	return mail.build('register', data).then(response => {
		return aws.sendMail(data.email, 'Sweetsuomi - Register Success', response);
	});
}

function createToken(account) {
	return jwt.sign({
		iss: config.jwt_issuer,
		sub: account.userId,
		name: account.username,
		role: account.role || 'user'
	}, config.jwt_secret, { 
		expiresIn: config.jwt_expires 
	});
}