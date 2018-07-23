const Store = require('./store');
const Validate = require('./validations');
const Dish = require('../dish');
const config = require('../../config');
 
exports.list = list;
exports.post = post;
exports.update = update;
exports.remove = remove;
exports.exist = exist;

function list() {
	return Store.list().then(categories => {
		return { data: categories };
	});
}

function post(data) {
	return Validate.post(data.name).then(() => {
		return Store.post(data.name);
	}).then(category => {
		return { data: category };
	});
}

function update(id, data) {
	return Validate.update(id, data.name).then(() => {
		return Store.update(id, data.name);
	}).then(response => {
		return { data: response };
	});
}

function remove(id) {
	return Validate.remove(id).then(() => {
		return Store.disable(id);
	}).then(isDeleted => {
		if (!isDeleted) {
			throw e.error('CATEGORY_NOT_DELETED');
		}
		return Dish.updateCategory(id, config.category_id);
	}).then(response => {
		return { data: true };
	});
}

function exist(id) {
	return Store.exist({ _id: id }).then(response => {
		if (!response) {
			throw e.error('CATEGORY_NOT_EXIST');
		}
	});
}