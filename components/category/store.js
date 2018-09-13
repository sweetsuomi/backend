const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'Category';

exports.exist = exist;
exports.list = list;
exports.post = post;
exports.update = update;
exports.disable = disable;

function list() {
	return Store.list(schema, {});
}

function exist(condition) {
	return Store.query(schema, condition, {}, false).then(response => {
		return response ? true : false;
	});
}

function post(name) {
	const query = { name: name };
	return exist(query).then(response => {
		if (response) {
			throw e.error('CATEGORY_ALREADY_EXIST');
		}
		return Store.post(schema, query);	
	});
}

function update(id, name) {
	return exist({ id: id }).then(response => {
		if (!response) {
			throw e.error('CATEGORY_NOT_EXIST');
		}
		return Store.upsert(schema, id, { name: name }, null);
	});
}

function disable(id) {
	const condition = { id: id };
	return exist(condition).then(response => {
		if (!response) {
			throw e.error('CATEGORY_NOT_EXIST');
		}
		return Store.remove(schema, condition, false);	
	});
}