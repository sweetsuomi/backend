const Store = require('./store');
const Validate = require('./validations');
const Dish = require('../dish');
const aws = require('../aws');
 
exports.list = list;
exports.post = post;
exports.update = update;
exports.remove = remove;

function list() {
	return Store.list().then(categories => {
		return { data: categories };
	});
}

function post(data, file) {
	let intolerance = {};
	return Validate.post(data.name, file).then(() => {
		return Store.post(data.name);
	}).then(response => {
		intolerance = response;
		file.maxSize = 50;
		return aws.upload('intolerances/', file, response._id);
	}).then(() => {
		return { data: intolerance };
	});
}

function update(id, data, file) {
	return Validate.update(id, data.name, file).then(() => {
		return Store.update(id, data.name);
	}).then(response => {
		if (file) {
			file.maxSize = 50;
			return aws.upload('intolerances/', file, id);
		}
		return { data: true };
	}).then(() => {
		return { data: true };
	});
}

function remove(id) {
	return Validate.remove(id).then(() => {
		return Store.remove(id);
	}).then(isDeleted => {
		if (!isDeleted) {
			throw e.error('INTOLERANCE_NOT_DELETED');
		}
		return Dish.removeIntolerance(id);
	}).then(() => {
		return aws.removeFromStore('intolerances/', id);
	}).then(() => {
		return { data: true };
	});
}