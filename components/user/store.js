const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'User';

exports.exist = exist;
exports.list = list;
exports.count = count;
exports.get = get;
exports.post = post;
exports.getByAccount = getByAccount;

function exist(condition) {
	return Store.query(schema, condition, {}, false).then(response => {
		return response ? true : false;
	});
}

function count() {
	return Store.count(schema, {});
}

function list() {
	const condition = { isEmailSubscribed: true };
	
	const statements = {
		populate: [{
			path: 'account',
			select: 'email'
		}]
	};
	
	return Store.query(schema, condition, statements, true);
}

function get(id) {
	return exist({ id: id }).then(response => {
		if (!response) {
			throw e.error('USER_NOT_EXIST');
		}
		
		const statements = {
			populate: [{
				path: 'account',
				select: 'email'
			}]
		};
		
		return Store.query(schema, { id: id }, statements, false);
	}).then(response => {
		delete response._id;
		delete response.updatedAt;
		delete response.created_at;
		delete response.__v;
		delete response.account._id;
		return response;
	});
}

function post(nickname, phone, company, address, account_id) {
	return exist({ nickname: nickname }).then(response => {
		if (response) {
			throw e.error('NICKNAME_IN_USE', 409);
		}
		
		const query = {
			nickname: nickname,
			phone: phone,
			company: company,
			address: address,
			account: account_id
		};
		
		return Store.post(schema, query);
	});
}

function getByAccount(account) {
	return exist({ account: account }).then(response => {
		if (!response) {
			throw e.error('USER_NOT_EXIST');
		}
		
		return Store.query(schema, { account: account }, {}, false);
	});
}

//UserSchema.statics.getUser = function (userId) {
//	return this.findById(userId)
//		.select('nickname phone company address credentials')
//		.populate({
//			path: 'Credentials',
//			select: 'email'
//		}).exec().catch(() => {
//			throw new Error('The user you\'re trying to get doesn\'t exist');
//		});
//};