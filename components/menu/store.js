const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'Menu';

exports.list = list;
exports.upsert = upsert;
exports.remove = remove;
exports.updateDishQuantity = updateDishQuantity;
exports.getMenuFromList = getMenuFromList;

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
	const condition = { id: id };
	return exist(condition).then(response => {
		if (!response) {
			throw e.error('DISH_NOT_EXIST');
		}
		return Store.remove(schema, condition, false);
	});
}

function exist(condition) {
	return Store.query(schema, condition, {}, false).then(response => {
		return response ? true : false;
	});
}

function updateDishQuantity(id, quantity) {
	return Store.upsert(schema, id, { 
		$inc: { quantity: -quantity } 
	}, { upsert: true })
}

function getMenuFromList(menuList) {
	const query = {
		_id: {
			$in: menuList
		}
	};

	const statements = {
		populate: [{
			path: 'dish'
		}, {
			path: 'schedule',
			select: 'timeEnd -_id'
		}]
	};
	
	return Store.query(schema, query, statements, true)
}