const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'Order';

exports.list = list;
exports.post = post;

function list(user, date, offset, limit) {
    let query = {};
    if (user) { query.user = user };
	if (date) { query.date = date };

	const statements = {
		skip: offset,
		limit: limit
    };

	return Store.query(schema, query, statements, true);
}

function post(user, date, note, time) {
	let query = {
		user: user,
		date: date,
		note: note,
		time: time
	};
	
	if (note) {
		query.note = note;
	}
	
	return Store.post(schema, query);
}