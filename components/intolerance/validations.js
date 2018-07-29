const Promise = require('bluebird');
const Validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.post = post;
exports.update = update;
exports.remove = remove;

function post(name, file) {
	return verifyName(name).then(() => {
		return verifyFile(file);
	});
}

function update(id, name, file) {
	return verifyId(id).then(() => {
		return verifyName(name || null);
	}).then(() => {
		if (file) {
			return verifyFile(file || null);
		}
		return;
	});
}

function remove(id) {
	return verifyId(id);
}

function verifyName (name) {
	return new Promise((resolve, reject) => {
		if (name === null) {
			resolve();
		} else if (Validations.isUndefined(name)) {
			return reject(e.error('INTOLERANCE_NAME_NOT_DEFINED'));
		} else if (!Validations.isString(name)) {
			return reject(e.error('INTOLERANCE_NAME_NOT_VALID'));
		} else if (!Validations.minLength(name, 4)) {
			return reject(e.error('INTOLERANCE_NAME_SHORTER'));
		} else if (!Validations.maxLength(name, 30)) {
			return reject(e.error('INTOLERANCE_NAME_LONGER'));
		} else {
			resolve();
		}
	});
}

function verifyId(id) {
	return new Promise((resolve, reject) => {
		if (Validations.isUndefined(id)) {
			return reject(e.error('INTOLERANCE_ID_NOT_DEFINED'));
		} else if (!Validations.isMongoose(id)) {
			return reject(e.error('INTOLERANCE_ID_NOT_VALID'));
		} else {
			resolve();
		}
	});
}

function verifyFile(file) {
	return new Promise((resolve, reject) => {
		if (file === null) {
			resolve();
		} else if (file) {
			const fileDot = file.originalname.split('.');
			const fileExtension = fileDot[fileDot.length - 1].toLowerCase();
			if (fileExtension !== 'png') {
				return reject(e.error('FILE_FORMAT_NOT_VALID'));
			}
			resolve();
		} else {
			reject(e.error('FILE_NOT_EXIST'));
		}
	});
}