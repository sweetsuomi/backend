const moment = require('moment');
const Store = require('./store');
const mail = require('../../mails');
const config = require('../../config');
const aws = require('../aws/index');
const Validate = require('./validations');
const orderDish = require('../orderdish');
const menu = require('../menu');
const user = require('../user');
const e = require('../../helpers/errors');

exports.list = list;
exports.get = get;
exports.count = count;
exports.post = post;
exports.deliver = deliver;
exports.remove = remove;

function list(user, query) {
	const offset = query.offset ? parseInt(query.offset) : 0;
	const limit = query.limit ? parseInt(query.limit) : 1000;

	if (query.date) {
		query.date = parseInt(query.date.replace(/-/g, ''), 10);
	}

	if (user.role !== 'Admin') {
		query.user = user.sub;
	}

	return Store.list(query.user, query.date, offset, limit).then(order => {
		return { data: order };
	});
}

function get(id) {
	let data = {};
	return Store.get(id).then(response => {
		data = response;
		return orderDish.getByOrder(id);
	}).then(response => {
		data.dishes = response;
		return { data: data }
	});
}

function count() {
	return Store.count();
}

function post(session, data) {
	return Validate.post(data.note, data.time).then(() => {
		const menuIdList = data.order.map(element => element.menuId);
		return menu.getMenuFromList(menuIdList);
	}).then(menuDishList => {
		data.order = data.order.map((element, index) => {
			return {
				menu: menuDishList[index],
				quantity: element.quantity,
			};
		});
		return isValidTime(data.order, data.time);
	}).then(() => {
		const date = parseInt(moment().format('YYYY-MM-DD').replace(/-/g, ''), 10);
		const price = data.order.map(element => element.menu.dish.price * element.quantity).reduce((acc, current) => acc + current);
		return Store.post(session.sub, date, data.note, data.time.replace(/:/g, ''), price);
	}).then(response => {
		return orderDish.post(response._id, data.order);
	}).then(() => {
		return menu.updateDishQuantity(data.order);
	}).then(() => {
		sendPostEmail(data, session);
	}).then(() => {
		return { data: true };
	});
}

function deliver(session, data) {
	if (session.role !== 'Admin') {
		throw e.error('ORDER_DELETE_FORBIDDEN');
	}
	return Validate.deliver(data.order, data.deliver).then(() => {
		return Store.deliver(data.order, data.deliver);
	}).then(() => {
		return { data: true };
	});
}

// Validate & remove the order in case you are admin or in case that the margin of time is less than 1 hour
function remove(session, order) {
	let data = {};
	return Validate.remove(order).then(() => {
		return Store.get(order);
	}).then(response => {
		data = response;
		return orderDish.getByOrder(order);
	}).then(response => {
		data.order = response;
		if (session.role !== 'Admin') {
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
		const menuList = data.order.map(element => {
			return { menu: element.menu, quantity: element.quantity };
		});
		return menu.restoreMenuDishes(menuList);
	}).then(() => {
		return user.get(data.user._id);
	}).then(usr => {
		sendCancelOrderEmail(data, data.user.nickname, usr.data.account.email);
		sendUserCancelOrderEmail(data);
		return { data: true };
	});
}
/**
 * Convert string hours & minutes format from hh:mm to integer hhmm.
 * 
 * @param {Object} menuDishList A list of dishes 
 * @param {String} time The order time 
 */
function isValidTime(menuDishList, orderTime) {
	const restrictedTime = menuDishList.map(element => element.menu.schedule.timeEnd).reduce((acc, current) => acc < current ? acc : current);
	const now = parseInt(moment().format('HH:mm').replace(/:/g, ''), 10);
	orderTime = parseInt(orderTime.replace(/:/g, ''), 10);

	if (restrictedTime < now || orderTime < now || orderTime > restrictedTime) {
		throw e.error('ORDER_DELETE_FORBIDDEN');
	}
}

function sendPostEmail(data, session, email) {
	data.dishes = '';
	data.nickname = session.name;
	data.aws_cloudfront = config.aws_cloudfront;
	for (let i = 0; i < data.order.length; i += 1) {
		data.dishes += '<tr><td><table style="margin: 0 auto;"><tr><td><img style="width:50px;" src="' + config.aws_cloudfront + 'dish/' + data.order[i].menu.dish._id + '.png" /></td><td><p style="text-align:left;">' + data.order[i].menu.dish.title + ' - Cantidad: ' + data.order[i].quantity + '</table></p></td></tr>';
	}
	sendOrderEmail('newOrder', 'Sweetsuomi - Nuevo pedido', data, config.admin_email);
}

function sendCancelOrderEmail(data, nickname, email) {
	data.nickname = nickname
	data.aws_cloudfront = config.aws_cloudfront;
	sendOrderEmail('cancelOrder', 'Sweetsuomi - Pedido cancelado', data, email);
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