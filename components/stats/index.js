const OrderDish = require('../orderDish');
const User = require('../user');
const Order = require('../order');

exports.orderDishSold = orderDishSold;
exports.userCount = userCount;
exports.orderCount = orderCount;

function orderDishSold(user) {
    return OrderDish.amountSold().then(response => {
        const quantity = response.length;
		let money = 0;

		for (let i = 0; i < quantity; i += 1) {
			money += response[i].dish.price * response[i].quantity;
		}
        return { data: { quantity: quantity, money: money } };
    })

}

function userCount(user) {
    return User.count().then(count => {
        return { data: count.toString() };
    });
}

function orderCount(user) {
    return Order.count().then(count => {
        return { data: count.toString() };
    });
}