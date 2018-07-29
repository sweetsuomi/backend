const moment = require('moment');
const Store = require('./store');
const Validate = require('./validations');
const Schedule = require('../schedule');
const e = require('../../helpers/errors');
 
exports.list = list;
exports.upsert = upsert;
exports.remove = remove;
exports.updateDishQuantity = updateDishQuantity;
exports.hasEnoughQuantity = hasEnoughQuantity;

function list(query) {
	let date = query.date ? query.date : moment().format('YYYY-MM-DD');
	date = date.replace(/-/g, '');

	const time = query.scheduleId || query.time || moment().format('HH:mm');
	const offset = query.offset ? parseInt(query.offset) : 0;
	const limit = query.limit ? parseInt(query.limit) : 1000;

	if (query.scheduleId) {
		return Store.list(date, [time], offset, limit).then(menu => {
			return { data: menu };
		});
	}
	
	return Schedule.get(time).then(time => {
		return Store.list(date, getArrayOfScheduleId(time), offset, limit);
	}).then(menu => {
		return { data: menu };
	});
}

function upsert(data) {
	return Validate.upsert(data.menu, data.date, data.time).then(() => {
		return Store.upsert(data.menu, data.date, data.time);
	}).then(menu => {
		if (!menu) {
			throw e.error('MENU_DISH_NOT_EXIST');
		}
		return { data: menu };
	});
}

function remove(menuId) {
	return Validate.remove(menuId).then(() => {
		return Store.remove(menuId);
	}).then(() => {
		return { data: true };
	});
}

function updateDishQuantity(dish, date, time, quantity) {
	return Store.updateDishQuantity(dish, date, time, quantity);
}

function hasEnoughQuantity(order, date, schedule) {
	let queries = [];
	for (let i = 0; i < order.length; i += 1) {
		queries.push(
			Store.hasEnoughQuantity(
				order[i].dish,
				date,
				schedule,
				parseInt(order[i].quantity, 10)
			)
		);
	}
	return Promise.all(queries)
}

function getArrayOfScheduleId(time) {
	return time.map(function (time) {
    	return time._id; 
	});
}