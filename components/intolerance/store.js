const Store = require('../../store/mongo');

const schema = 'Intolerance';

exports.list = list;
exports.post = post;
exports.update = update;
exports.remove = remove;

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
			throw e.error('INTOLERANCE_ALREADY_EXIST');
		}
		return Store.post(schema, query);	
	});
}

function update(id, name) {
	return exist({ id: id }).then(response => {
		if (!response) {
			throw e.error('INTOLERANCE_NOT_EXIST');
		}
		return Store.upsert(schema, id, { name: name }, null);
	});
}

function remove(id) {
	return exist({ id: id }).then(response => {
		if (!response) {
			throw e.error('INTOLERANCE_NOT_EXIST');
		}
		return Store.remove(schema, id, false);	
	});
}