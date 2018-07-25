const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'Schedule';

exports.list = list;
exports.getSchedule = getSchedule;
exports.post = post;
exports.upsert = upsert;
exports.disable = disable;

function list(query) {
	return Store.list(schema, query);
}

function getSchedule(time) {
	return Store.query(schema, { $and: [
		{ timeStart: { $lte: time }},
		{ timeEnd: { $gt: time }},
		{ enabled: true }
	]}, {}, true);
}

function exist(condition) {
	return Store.query(schema, condition, {}, true).then(response => {
		if (response && response.length >= 0) {
			return response.length > 0 ? true : false;
		}
		return response ? true : false;
	});
}

function post(name, timeStart, timeEnd) {
	return exist({ name: name }).then(response => {
		if (response) {
			throw e.error('SCHEDULE_ALREADY_EXIST');
		}
		
		const query = {
			name: name,
			timeStart: timeStart,
			timeEnd: timeEnd
		};
		
		return Store.post(schema, query);	
	});
}

function upsert(id, query) {
	return exist({ id: id }).then(response => {
		if (!response) {
			throw e.error('SCHEDULE_NOT_EXIST');
		}
		
		return Store.upsert(schema, id, query, null);
	});
}

function disable(id) {
	return exist({ id: id }).then(response => {
		if (!response) {
			throw e.error('SCHEDULE_NOT_EXIST');
		}
		return Store.upsert(schema, id, { enabled: false }, null);	
	});
}