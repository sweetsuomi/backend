const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'Orderdish';

exports.post = post;
exports.upsert = upsert;
exports.getByOrder = getByOrder;
exports.removeByOrder = removeByOrder;
exports.amountSold = amountSold;

function post(dish, quantity, order) {
	return Store.post(schema, {
        dish: dish,
        quantity: quantity,
        order: order
	});
}

function upsert(dish, quantity, order) {
    return Store.upsert(schema, {
        dish: dish,
        order: order
    }, {
        dish: dish,
        quantity: quantity,
        order: order
    }, {
        upsert: true
    });
}

function getByOrder(order) {
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
		}]
	};
	return Store.query(schema, { order: order }, statements, true);
}

function removeByOrder(orderId) {
    return Store.remove(schema, { order: orderId }, true)
}

function amountSold() {
    return Store.query(schema, {}, {
        populate: [{
            path: 'dish',
            select: 'price'
		}]
    }, true);
}