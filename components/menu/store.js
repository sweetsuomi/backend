const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'Menu';

exports.list = list;
exports.upsert = upsert;
exports.remove = remove;
exports.updateDishQuantity = updateDishQuantity;
exports.hasEnoughQuantity = hasEnoughQuantity;

function list(date, time, offset, limit) {
	const statements = {
		populate: [{
			path: 'dish',
			populate: [{
				path: 'category',
				select: 'name'
			}, {
				path: 'intolerance',
				select: 'name'
			}]
		}],
		skip: offset,
		limit: limit
	};
	return Store.query(schema, {
		date: date,
		time: { $in: time }
	}, statements, true);
}

function upsert(menu, date, time) {
	let query = [];
	
	menu.forEach(element => {
		query.push(
			Store.upsert(schema, {
				dish: element.dish,
				date: date,
				time: time
			}, {
				dish: element.dish,
				quantity: element.quantity,
				date: date,
				time: time
			}, {
				upsert: true
			})
		);
	});
	
	return Promise.all(query);
}

function remove(id) {
	return exist({ id: id }).then(response => {
		if (!response) {
			throw e.error('DISH_NOT_EXIST');
		}
		return Store.remove(schema, id, false);
	});
}

function exist(condition) {
	return Store.query(schema, condition, {}, false).then(response => {
		return response ? true : false;
	});
}

function updateDishQuantity(dish, date, time, quantity) {
	return Store.upsert(schema, {
		dish: dish,
		date: date,
		time: time
	}, { 
		$inc: { quantity: -quantity } 
	}, {
		upsert: true 
	})
}

function hasEnoughQuantity(dish, date, time, quantity) {
	return Store.query(schema, {
		dish: dish,
		date: date,
		time: time
	}, {}, false).then(response => {
		if (response && response.quantity >= quantity) {
			return true;
		}
		throw e.error('MENU_NOT_ENOUGH_QUANTITY');
	});
}