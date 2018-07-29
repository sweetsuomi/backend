const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'Dish';

exports.updateCategory = updateCategory;
exports.removeIntolerance = removeIntolerance;
exports.list = list;
exports.post = post;
exports.update = upsert;
exports.disable = disable;

function updateCategory(oldCategoryId, newCategoryId) {
	return Store.upsert(schema,
		{ category: oldCategoryId },
		{ category: newCategoryId },
		{ safe: true, multi: true }
	);
}

function removeIntolerance(intoleranceId) {
	return Store.upsert(schema,	{},
		{ $pull: { intolerances: intoleranceId } },
		{ safe: true, multi: true }
	);
}

function exist(condition) {
	return Store.query(schema, condition, {}, false).then(response => {
		return response ? true : false;
	});
}

function list(offset, limit, category) {
	let condition = { enabled: true };

	if (category) {
		condition.category = category;
	}
	
	const statements = {
		populate: [{
			path: 'category',
			select: 'name' 
		}, {
			path: 'intolerance',
			select: 'name'
		}],
		skip: offset,
		limit: limit
	};
	
	return Store.query(schema, condition, statements, true);
}

function post(title, description, price, category, intolerances) {
	let query = {
		title: title,
		description: description,
		price: price,
		category: category
	};
	
	if (intolerances) {
		query.intolerances = intolerances;
	}
	
	return Store.post(schema, query);
}

function upsert(id, data) {
	return exist({ id: id }).then(response => {
		if (!response) {
			throw e.error('DISH_NOT_EXIST');
		}
		return Store.upsert(schema, id, data, null);
	});
}

function disable(id) {
	return exist({ id: id }).then(response => {
		if (!response) {
			throw e.error('DISH_NOT_EXIST');
		}
		return Store.upsert(schema, id, { enabled: false }, null);	
	});
}