const validator = require('validator');
const moment = require('moment');

exports.isUndefined = isUndefined;
exports.isEmail = isEmail;
exports.isString = isString;
exports.isNumber = isNumber;
exports.isArray = isArray;
exports.isObject = isObject;
exports.isPositiveNumber = isPositiveNumber;
exports.isMongoose = isMongoose;
exports.isMobilePhone = isMobilePhone;
exports.minLength = minLength;
exports.maxLength = maxLength;
exports.isValidDateTime = isValidDateTime;
exports.isValidTimeDifference = isValidTimeDifference;

//exports.isDate = isDate;
//exports.checkDateIsGreater = checkDateIsGreater;

function isUndefined(value) {
	if (typeof value === "undefined") {
		return true;
	}
};

function isEmail(email) {
	if (validator.isEmail(email) === true) {
		return true;
	}
};

function isString(string) {
	if (typeof string === 'string') {
		return true;
	}
};

function isNumber(number) {
	if (!isNaN(number)) {
		return true
	}
};

function isArray(array) {
	if (Array.isArray(array) === true) {
		return true;
	}
};

function isObject(object) {
	if (typeof object === 'object') {
		return true;
	}
};

function isPositiveNumber(number) {
	if (number >= 0) {
		return true;
	}
};

function isMongoose(objectId) {
	if (typeof objectId !== 'String') {
		objectId = objectId.toString();
	}
	if (validator.isMongoId(objectId) === true) {
		return true;
	}
	return false;
};

function isMobilePhone(phone) {
	if (validator.isMobilePhone(phone, 'es-ES') === true) {
		return true;
	}
};

function minLength(string, minValue) {
	if (string.length >= minValue) {
		return true;
	}
};

function maxLength(string, maxValue) {
	if (string.length <= maxValue) {
		return true
	}
};

function isValidDateTime(dateTime) {
	const formats = [moment.ISO_8601, 'HH:mm'];

	dateTime = moment(dateTime, "HHmm").format("HH:mm");
	
	let isValidTime = moment(dateTime, formats, true).isValid();
	
	if (isValidTime) {
		return true;
	}
}

function isValidTimeDifference(timeStart, timeEnd) {
	const formats = [moment.ISO_8601, 'HH:mm'];
	
	let start = moment(timeStart, 'HH:mm');
	let end = moment(timeEnd, 'HH.mm');
	
	if (start.isBefore(end)){
		return true;
	}
}

//const isDate = function (date) {
//	if ((new Date(date) === "Invalid Date") && isNaN(new Date(date))) {
//		throw new TypeError(lang.validations.NOT_EXPECTED_TYPE);
//	}
//	return Promise.resolve();
//};
//
//const checkDateIsGreater = function (date) {
//	if (new Date(date).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
//		return Promise.resolve();
//	}
//	throw new Error(lang.validations.INVALID_DATE);
//};
