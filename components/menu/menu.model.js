'use strict';

const mongoose = require('mongoose');
const Promise = require('bluebird');
const lang = require('../../languages/es-ES');

mongoose.Promise = Promise;

const MenuSchema = new mongoose.Schema({
	dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dish' },
	quantity: { type: Number, default: 0 },
	date: { type: Date }
}, { timestamps: { createdAt: 'created_at' } });

MenuSchema.statics.checkIfDishHasBeenChosenForToday = function (dishId) {
	return this.findOne({ dish: dishId, date: {
		$gt: addDaysToDate(new Date(), -1),
		$lt: new Date()
	} }).exec().then(response => {
		if (response) {
			throw new Error(lang.menu.DISH_NOT_DELETED);
		}
	}).catch(e => {
		if (e) {
			throw new Error(e.message);
		}
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

MenuSchema.statics.getMenu = function (requestedDate) {
	return this.find({ date: {
		$gt: addDaysToDate(new Date(requestedDate), -1),
		$lt: addDaysToDate(new Date(requestedDate), 1)
	} }).select('dish quantity')
		.populate({
			path: 'dish',
			select: 'title description price category intolerances',
			populate: {
				path: 'category',
				select: 'name'
			}
		}).lean().exec().then(data => {
			if (data.length === 0) {
				throw new Error(lang.menu.IS_EMPTY);
			}
			return data;
		}).catch(e => {
			if (e) {
				throw new Error(e.message);
			}
			throw new Error(lang.validations.INTERNAL_ISSUE);
		});
};

function addDaysToDate(date, days) {
	date.setDate(date.getDate() + days);
	return date;
}

MenuSchema.statics.postMenu = function (user, requestedDate, menu) {
	let promises = [];

	for (let i = 0; i < menu.length; i += 1) {
		promises.push(
			this.update({
				dish: menu[i].dish,
				date: {
					$gt: addDaysToDate(new Date(requestedDate), -1),
					$lt: addDaysToDate(new Date(requestedDate), 1)
				}
			}, {
				dish: menu[i].dish,
				quantity: menu[i].quantity,
				date: new Date(requestedDate)
			}, { upsert: true }).exec()
		);
	}

	return Promise.all(promises).catch(() => {
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

MenuSchema.statics.deleteMenu = function (requestedDate) {
	return this.find({ date: {
		$gt: addDaysToDate(new Date(requestedDate), -1),
		$lt: addDaysToDate(new Date(requestedDate), 1)
	} }).remove().exec().then(response => {
		if (response.result.n === 0) {
			throw new Error(lang.menu.NOT_DELETED);
		}
	}).catch(e => {
		if (e) {
			throw new Error(e.message);
		}
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

MenuSchema.statics.deleteDishFromMenu = function (date, dish) {
	return this.find({ dish: dish, date: {
		$gt: addDaysToDate(new Date(date), -1),
		$lt: addDaysToDate(new Date(date), 1)
	} }).remove().exec().catch(() => {
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

MenuSchema.statics.checkMenuHasEnoughQuantity = function (order, date) {
	let promises = [];

	for (let element in order) {
		if (element) {
			promises.push(
				this.findOne({
					dish: element,
					date: {
						$gt: addDaysToDate(new Date(date), -1),
						$lt: addDaysToDate(new Date(date), 1)
					},
					quantity: { $gte: order[element].quantity }
				}).exec()
			);
		}
	}

	return Promise.all(promises).then(response => {
		let counter = response.reduce((prevVal, element) => {
			if (element !== null) {
				return prevVal + 1;
			}
			return prevVal;
		}, 0);
		if (counter !== Object.keys(order).length) {
			throw new Error(lang.order.NOT_ENOUGH_QUANTITY);
		}
	}).catch(e => {
		if (e) {
			throw new Error(e.message);
		}
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

MenuSchema.statics.updateQuantityAfterOrderComplete = function (order, date) {
	let promises = [];

	for (let element in order) {
		if (element) {
			const quantity = order[element].quantity;
			promises.push(
				this.findOneAndUpdate({
					dish: element,
					date: {
						$gt: addDaysToDate(new Date(date), -1),
						$lt: addDaysToDate(new Date(date), 1)
					}
				}, { $inc: { quantity: -quantity } }).exec()
			);
		}
	}

	return Promise.all(promises).catch(() => {
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

MenuSchema.statics.replaceItems = function (order, date) {
	let promises = [];

	for (let i = 0; i < order.length; i += 1) {
		promises.push(
			this.findOneAndUpdate({
				dish: order[i].dish,
				date: {
					$gt: addDaysToDate(new Date(date), -1),
					$lt: addDaysToDate(new Date(date), 1)
				}
			}, { $inc: { quantity: order[i].quantity } })
		);
	}

	return Promise.all(promises).catch(() => {
		throw new Error(lang.validations.INTERNAL_ISSUE);
	});
};

module.exports = mongoose.model('Menu', MenuSchema);
