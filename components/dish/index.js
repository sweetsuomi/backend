const Store = require('./store');
const Validate = require('./validations');
const Category = require('../category')
const config = require('../../config');
const aws = require('../aws');

exports.updateCategory = updateCategory;
exports.removeIntolerance = removeIntolerance;
exports.list = list;
exports.post = post;
exports.update = update;
exports.remove = remove;

function updateCategory(oldCategoryId, newCategoryId) {
	return Store.updateCategory(oldCategoryId, newCategoryId || config.category_id);
}

function removeIntolerance(intoleranceId) {
	return Store.removeIntolerance(intoleranceId);
}

function list(data) {
	let query = {};
	
	query.offset = Number(data.offset) || 0;
	query.limit = Number(data.limit) || 10;
	query.category = data.category || undefined;
	
	return Store.list(query.offset, query.limit, query.category).then(list => {
		return { data: list };
	});
}

function post(data, file) {
	let dish = {};
	return Validate.post(data.title, data.description, data.price, data.category, data.intolerances, file).then(() => {
		return Category.exist(data.category);
	}).then(() => {
		return Store.post(data.title, data.description, data.price, data.category, data.intolerances);
	}).then(response => {
		dish = response;
		file.maxSize = 200;
		return aws.upload('dish/', file, response._id);
	}).then(() => {
		return { data: dish };
	});
}

function update(id, data, file) {
	return Validate.put(id, data.title, data.description, data.price, data.category, data.intolerances, file).then(() => {
		return Category.exist(data.category);
	}).then(() => {
		return Store.update(id, data);
	}).then(dish => {
		if (file) {
			file.maxSize = 200;
			return aws.upload('dish/', file, dish._id);
		}
		return { data: true };
	}).then(() => {
		return { data: true };
	});
}

function remove(id) {
	return Validate.remove(id).then(() => {
		return Store.disable(id);
	});
}