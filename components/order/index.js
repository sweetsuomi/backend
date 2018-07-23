const moment = require('moment');
const Store = require('./store');
const Validate = require('./validations');
const orderDish = require('../orderDish');
const e = require('../../helpers/errors');

exports.list = list;
exports.post = post;

function list(query) {
	const offset = query.offset ? parseInt(query.offset) : 0;
	const limit = query.limit ? parseInt(query.limit) : 1000;

	if (query.date) {
		query.date = parseInt(query.date.replace(/-/g, ''), 10);
	}

	return Store.list(query.user, query.date, offset, limit).then(order => {
		return { data: order };
	});
}

function post(user, data) {
	return Validate.post(data.date, data.note, data.time).then(() => {
		data.date = parseInt(data.date.replace(/-/g, ''), 10);
		return Store.post(user, data.date, data.note, data.time);
	}).then(response => {
		console.log(response);
		// return orderDish.post(response._id, body.dish, body.quantity);
	// }).then(() => {
		return { data: true };
	});
}

// (CancelOrder, { nickname: nickname, email: email })

// let dishes = '';
//	for (let i = 0; i < order.length; i += 1) {
//		dishes += '<tr><td>' + order[i].dish.title + ' - Cantidad: ' + order[i].quantity + '</tr></td>';
//	}
// (UserCancelOrder, { dishes: dishes })

function sendOrderEmail(type, data) {
	return mail.build(type, data).then(response => {
		return aws.sendMail(data.email, 'Sweetsuomi - Información', response);
	});
}