const moment = require('moment');
const Store = require('./store');
const mail = require('../../mails');
const config = require('../../config');
const aws = require('../aws/index');
const Validate = require('./validations');
const orderDish = require('../orderDish');
const menu = require('../menu');
const schedule = require('../schedule');
const e = require('../../helpers/errors');

exports.list = list;
exports.count = count;
exports.post = post;
exports.deliver = deliver;
exports.remove = remove;

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

function count() {
	return Store.count();
}

function post(user, data) {
	const date = parseInt(moment().format('YYYY-MM-DD').replace(/-/g, ''), 10);
	const time = moment().format('HH:mm');

	return Validate.post(data.note, data.time, data.schedule, time).then(() => {
		return isValidTime(data.schedule, data.time, time);
	}).then(() => {
		return menu.hasEnoughQuantity(data.order, date, data.schedule);
	}).then(() => {
		return orderDish.getFinalPrice(data.order);
	}).then(price => {
		return Store.post(user.sub, date, data.note, data.time.replace(/:/g, ''), price);
	}).then(response => {
		return orderDish.post(response._id, data.order);
	}).then(() => {
		sendPostEmail(data, user);
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

// Validate & remove the order in case you are admin or in case that the margin of time is less than 1 hour
function remove(user, order) {
	let data = {};
	return Validate.remove(order).then(() => {
		return Store.get(order);
	}).then(response => {
		data = response;
		return orderDish.getByOrder(order);
	}).then(response => {
		data.order = response;
		if (user.role !== 'Admin') {
			const time = parseInt(moment().format('HH:mm').replace(/:/g, ''), 10);
			const date = parseInt(moment().format('YYYY-MM-DD').replace(/-/g, ''), 10);
			if (data.time - time < 60 && data.date <= date || data.date < date) {
				throw e.error('ORDER_DELETE_FORBIDDEN');
			}
		}
		return orderDish.removeByOrder(order);
	}).then(() => {
		return Store.remove(order);
	}).then(() => {
		sendCancelOrderEmail(data, user);
		sendUserCancelOrderEmail(data);
		return { data: true };
	});
}

function isValidTime(scheduleId, time, now) {
	const t = parseInt(time.replace(/:/g, ''), 10);

	now = parseInt(now.replace(/:/g, ''), 10);

	return schedule.get(scheduleId).then(data => {
		if (t >= data.timeEnd || now > data.timeEnd || now > t) {
			throw e.error('ORDER_DELETE_FORBIDDEN');
		}
	});
}

function sendPostEmail(data, user, date) {
	data.dishes = '';
	data.nickname = user.name;
	data.aws_cloudfront = config.aws_cloudfront;
	for (let i = 0; i < data.order.length; i += 1) {
		menu.updateDishQuantity(data.order[i].dish, date, data.schedule, data.order[i].quantity);
		data.dishes += '<tr><td><table style="margin: 0 auto;"><tr><td><img style="width:50px;" src="' + config.aws_cloudfront + 'dish/' + data.order[i].dish + '.png" /></td><td><p style="text-align:left;">' + data.order[i].name + ' - Cantidad: ' + data.order[i].quantity + '</table></p></td></tr>';
	}
	sendOrderEmail('newOrder', 'Sweetsuomi - Nuevo pedido', data, config.admin_email);
}

function sendCancelOrderEmail(data, user) {
	data.nickname = user.name;
	data.aws_cloudfront = config.aws_cloudfront;
	sendOrderEmail('cancelOrder', 'Sweetsuomi - Pedido cancelado', data, config.admin_email);
}

function sendUserCancelOrderEmail(data) {
	data.dishes = '';
	for (let i = 0; i < data.order.length; i += 1) {
		data.dishes += '<tr><td><table style="margin: 0 auto;"><tr><td><img style="width:50px;" src="' + config.aws_cloudfront + 'dish/' + data.order[i].dish._id + '.png" /></td><td><p style="text-align:left;">' + data.order[i].dish.title + ' - Cantidad: ' + data.order[i].quantity + '</table></p></td></tr>';
	}
	sendOrderEmail('userCancelOrder', 'Sweetsuomi - Pedido cancelado', data, config.admin_email);

}

function sendOrderEmail(type, title, data, email) {
	mail.build(type, data).then(response => {
		return aws.sendMail(email, title, response);
	});
}