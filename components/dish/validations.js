const Promise = require('bluebird');
const Validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.post = post;
exports.put = put;
exports.remove = remove;

function post(title, description, price, category, intolerances, file) {
	return verifyTitle(title).then(() => {
		return verifyDescription(description);
	}).then(() => {
		return verifyPrice(price);
	}).then(() => {
		return verifyCategory(category);
	}).then(() => {
		return verifyIntolerances(intolerances);
	}).then(() => {
		return verifyFile(file);
	});
}

function put(id, title, description, price, category, intolerances, file) {
	return verifyId(id).then(() => {
		return verifyTitle(title || undefined);
	}).then(() => {
		return verifyDescription(description || undefined);
	}).then(() => {
		return verifyPrice(price || undefined);
	}).then(() => {
		return verifyCategory(category || undefined);
	}).then(() => {
		return verifyIntolerances(intolerances || undefined);
	}).then(() => {
		if (file) {
			return verifyFile(file);
		}
		return;
	});
};

function remove(id) {
	return verifyId(id);
};

function verifyId(id) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(id)) {
			return reject(e.error('DISH_ID_NOT_DEFINED'));
		} else if (!Validations.isMongoose(id)) {
			return reject(e.error('DISH_ID_NOT_VALID'));
		}
		resolve();
	});
};

function verifyTitle(title) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(title)) {
			return reject(e.error('DISH_NAME_NOT_DEFINED'));
		} else if (!Validations.isString(title)) {
			return reject(e.error('DISH_NAME_NOT_VALID'));
		} else if (!Validations.minLength(title, 7)) {
			return reject(e.error('DISH_NAME_SHORTER'));
		} else if (!Validations.maxLength(title, 100)) {
			return reject(e.error('DISH_NAME_LONGER'));
		}
		resolve();
	});
};

function verifyDescription(description) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(description)) {
			return reject(e.error('DISH_DESCRIPTION_NOT_DEFINED'));
		} else if (!Validations.isString(description)) {
			return reject(e.error('DISH_DESCRIPTION_NOT_VALID'));
		} else if (!Validations.minLength(description, 8)) {
			return reject(e.error('DISH_DESCRIPTION_SHORTER'));
		} else if (!Validations.maxLength(description, 500)) {
			return reject(e.error('DISH_DESCRIPTION_LONGER'));
		}
		resolve();
	});
};

function verifyPrice(price) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(price)) {
			return reject(e.error('DISH_PRICE_NOT_DEFINED'));
		} else if (!Validations.isNumber(price) || !Validations.isPositiveNumber(price)) {
			return reject(e.error('DISH_PRICE_NOT_VALID'));
		}
		resolve();
	});
};

function verifyCategory(category) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(category)) {
			return reject(e.error('DISH_CATEGORY_NOT_DEFINED'));
		} else if (!Validations.isMongoose(category)) {
			return reject(e.error('DISH_CATEGORY_NOT_VALID'));
		}
		resolve();
	});
}

function verifyIntolerances(intolerances) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(intolerances)) {
			return resolve();
		} else if (!Validations.isArray(intolerances)) {
			return reject(e.error('DISH_INTOLERANCE_FORMAT_NOT_VALID'));
		}
		resolve();
	});
}

function verifyFile(file) {
	return new Promise((resolve, reject) => {
		if (file) {
			const fileDot = file.originalname.split('.');
			const fileExtension = fileDot[fileDot.length - 1].toLowerCase();
			if (fileExtension !== 'png') {
				return reject(e.error("FILE_FORMAT_NOT_VALID"));
			}
			return resolve();
		}
		reject(e.error("FILE_NOT_EXIST"));
	});
}