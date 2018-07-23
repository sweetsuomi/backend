const Promise = require('bluebird');
const Validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.upsert = upsert;
exports.remove = remove;

function upsert(menu, date, time) {
	return verifyMenu(menu).then(() => {
		return verifyDate(date);
	}).then(() => {
		return verifyId(time);
	});
}

function remove(id) {
	return verifyId(id);
};

function verifyId(id) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(id)) {
			return reject(e.error('MENU_DISH_NOT_EXIST'));
		} else if (!Validations.isMongoose(id)) {
			return reject(e.error('MENU_DISH_NOT_EXIST'));
		}
		resolve();
	});
};


function verifyMenu(menu) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(menu)) {
			return reject(e.error('MENU_DISH_NOT_DEFINED'));
		} else if (!Validations.isArray(menu)) {
			return reject(e.error('MENU_DISH_NOT_DEFINED'));
		}
		resolve();
	});
};

function verifyDate(date) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(date)) {
			return reject(e.error('MENU_DATE_NOT_DEFINED'));
		} else if (!Validations.isNumber(date)) {
			return reject(e.error('MENU_DATE_NOT_VALID'));
		}
		resolve();
	});
};