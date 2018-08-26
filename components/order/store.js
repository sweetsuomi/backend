const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'Order';

exports.list = list;
exports.count = count;
exports.get = get;
exports.post = post;
exports.deliver = deliver;
exports.remove = remove;

function exist(condition) {
	return Store.query(schema, condition, {}, false).then(response => {
		return response ? true : false;
	});
}

function count() {
	return Store.count(schema, {});
}

function get(id) {
	const condition = { id: id };
	return exist(condition).then(response => {
		if (!response) {
			throw e.error('ORDER_NOT_EXIST');
		}
		return Store.query(schema, condition, {}, false);
	});
}

function list(user, date, offset, limit) {
    let query = {};
    if (user) { query.user = user };
	if (date) { query.date = date };

	const statements = {
		populate: [{
			path: 'user',
			select: 'nickname'
		}],
		skip: offset,
		limit: limit
    };

	return Store.query(schema, query, statements, true);
}

function post(user, date, note, time, price) {
	let query = {
		user: user,
		date: date,
		note: note,
		time: time,
		price: price
	};
	
	if (note) {
		query.note = note;
	}
	
	return Store.post(schema, query);
}

function deliver(order, isDelivered) {
	return exist({ id: order }).then(response => {
		if (!response) {
			throw e.error('ORDER_NOT_EXIST');
		}
		return Store.upsert(schema, order, {
			isDelivered: isDelivered
		}, {});
	});
}

function remove(order) {
	const condition = { id: order };
	return exist(condition).then(response => {
		if (!response) {
			throw e.error('ORDER_NOT_EXIST');
		}
		return Store.remove(schema, condition, false);	
	});
}