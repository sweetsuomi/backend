'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const lang = require('../../languages/es-ES');

mongoose.Promise = Promise;

const OrderSchema = new mongoose.Schema({
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	note: { type: String },
	isDelivered: { type: Boolean, default: false },
	date: { type: Date }
}, { timestamps: { createdAt: 'created_at' } });

function addDaysToDate(date, days) {
	date.setDate(date.getDate() + days);
	return date;
}

OrderSchema.statics.getAllOrders = function (date) {
	return this.find({ date: {
		$gt: addDaysToDate(new Date(date), 0),
		$lt: addDaysToDate(new Date(date), 1)
	} }).select('user note isDelivered date')
		.populate({
			path: 'user',
			select: 'nickname phone credentials',
			populate: ({
				path: 'credentials',
				select: 'email'
			})
		}).exec().catch(e => {
			if (e) {
				throw new Error(e.message);
			}
			throw new Error(lang.validations.INTERNAL_ISSUE);
		});
};

OrderSchema.statics.getOrder = function (user, date) {
	return this.find({ user: user, date: {
		$gt: addDaysToDate(new Date(date), 0),
		$lt: addDaysToDate(new Date(date), 1)
	} }).select('user note isDelivered').exec().catch(e => {
		if (e) {
			throw new Error(e.message);
		}
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

OrderSchema.statics.deliverOrder = function (orderId) {
	return this.findByIdAndUpdate(orderId, { isDelivered: true }).exec().catch(() => {
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

OrderSchema.statics.deleteOrderForce = function (orderId) {
	return this.findById(orderId).remove().exec().then(response => {
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

OrderSchema.statics.getUserOrderList = function (user, date) {
	return this.find({ user: user, date: {
		$gt: addDaysToDate(new Date(date), 0),
		$lt: addDaysToDate(new Date(date), 1)
	} }).select('note isDelivered date')
		.exec().catch(e => {
			if (e) {
				throw new Error(e.message);
			}
			throw new Error(lang.validations.INTERNAL_ISSUE);
		});
};

OrderSchema.statics.deleteOrder = function (orderId) {
	return this.findById(orderId).remove().exec().then(response => {
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

OrderSchema.statics.postOrder = function (date, note, user) {
	return this.create({
		date: date,
		note: note,
		user: user
	}).then(response => {
		return response._id;
	}).catch(() => {
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

module.exports = mongoose.model('Order', OrderSchema);
