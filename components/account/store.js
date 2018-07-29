const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'Account';

exports.exist = exist;
exports.get = get;
exports.post = post;

function exist(condition) {
	return Store.query(schema, condition, {}, false).then(response => {
		return response ? true : false;
	});
}

function get(email) {
	const condition = { email: email };
	return Store.query(schema, condition, {}, false);
}

function post(email, username, password, role) {
	return exist({ email: email }).then(response => {
		if (response) {
			throw e.error('EMAIL_IN_USE', 409);
		}
		
		return Store.post(schema, {
			email: email,
			username: username,
			password: password,
			role: role
		});	
	});
}







//schema.statics.accountExist = function(email) {
//	return this.findOne({ email: email }).lean().exec()
//		.then(response => {
//			return response ? response : false;
//		}).catch(error => {
//			throw error;
//		});
//};
//
//schema.statics.register = function (email, username, password, role) {	
//	return this.create({
//		email: email,
//		username: username,
//		password: password,
//		role: role
//	}).catch(error => {
//		throw error;
//	});
//};