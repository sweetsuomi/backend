const Store = require('../../store/mongo');
const e = require('../../helpers/errors');

const schema = 'Orderdish';

exports.post = post;
exports.upsert = upsert;

function post(dish, quantity, order) {
	Store.post(schema, {
        dish: dish,
        quantity: quantity,
        order: order
	});
}

function upsert(dish, quantity, order) {
    Store.upsert(schema, {
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