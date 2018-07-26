const moment = require('moment');
const Store = require('./store');
const mail = require('../../mails');
const config = require('../../config');
const aws = require('../aws/index');
const Validate = require('./validations');
const orderDish = require('../orderDish');
const menu = require('../menu');
const e = require('../../helpers/errors');

exports.list = list;
exports.post = post;
exports.deliver = deliver;

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
	}).then(() => {
		return menu.hasEnoughQuantity(data.order, data.date, data.schedule);
	}).then(() => {
		return Store.post(user.sub, data.date, data.note, data.time.replace(/:/g, ''));
	}).then(response => {
		return orderDish.post(response._id, data.order);
	}).then(() => {
		data.email = config.admin_email;
		data.dishes = '';
		data.nickname = user.name;
		for (let i = 0; i < data.order.length; i += 1) {
			menu.updateDishQuantity(data.order[i].dish, data.date, data.schedule, data.order[i].quantity);
			data.dishes += '<tr><td><table style="margin: 0 auto;"><tr><td><img style="width:50px;" src="' + config.aws_cloudfront + 'dish/' + data.order[i].dish + '.png" /></td><td><p style="text-align:left;">' + data.order[i].name + ' - Cantidad: ' + data.order[i].quantity + '</table></p></td></tr>';
		}
		sendOrderEmail('newOrder', 'Sweetsuomi - Nuevo pedido', data);
	}).then(() => {
		return { data: true };
	});
}

function deliver(data) {
	return Validate.deliver(data.order, data.deliver).then(() => {
		return Store.deliver(data.order, data.deliver);
	}).then(() => {
		return { data: true };
	});
}
// (CancelOrder, { nickname: nickname, email: email })

// let dishes = '';
//	for (let i = 0; i < order.length; i += 1) {
//		dishes += '<tr><td>' + order[i].dish.title + ' - Cantidad: ' + order[i].quantity + '</tr></td>';
//	}
// (UserCancelOrder, { dishes: dishes })

function sendOrderEmail(type, title, data) {
	mail.build(type, data).then(response => {
		return aws.sendMail(data.email, title, response);
	});
}