'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const lang = require('../../languages/es-ES');

mongoose.Promise = Promise;

const OrderDishSchema = new mongoose.Schema({
	dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
	quantity: { type: Number, default: 0 },
	orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', index: true }
}, { timestamps: { createdAt: 'created_at' } });


OrderDishSchema.statics.getOrderList = function (orderList) {
	return this.find({ orderId: { $in: orderList } }).select('dish quantity orderId').populate({
		path: 'dish',
		select: 'title description price category intolerances'
	}).exec().catch(e => {
		if (e) {
			throw new Error(e.message);
		}
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

OrderDishSchema.statics.deleteOrder = function (orderId) {
	return this.find({ orderId: orderId }).remove().exec().then(response => {
		if (response.result.n === 0) {
			throw new Error(lang.order.NOT_DELETED);
		}
	}).catch(e => {
		if (e) {
			throw new Error(e.message);
		}
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

OrderDishSchema.statics.postOrder = function (order, id) {
	let promises = [];

	for (let element in order) {
		if (element) {
			promises.push(
				this.create({
					dish: element,
					quantity: order[element].quantity,
					orderId: id
				})
			);
		}
	}

	return Promise.all(promises).catch(() => {
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

OrderDishSchema.statics.deleteOrderDishes = function (orderId) {
	return this.find({ orderId: orderId }).remove().exec().catch(() => {
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

module.exports = mongoose.model('OrderDish', OrderDishSchema);
