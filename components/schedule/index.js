const Store = require('./store');
const Validate = require('./validations');
const moment = require('moment');
const e = require('../../helpers/errors');
 
exports.list = list;
exports.getNow = getNow;
exports.get = get;
exports.post = post;
exports.upsert = upsert;
exports.disable = disable;

function list(filter) {
	let query = {};

	if (filter.enabled !== undefined) {
		query.enabled = filter.enabled || true;
	}
	return Store.list(query).then(list => {
		return { data: list };
	});
}

/**
 * Find in the database a list of schedules that belongs to this time
 * 
 * @return {Object} A list of schedules
 */
function getNow() {
	return this.get(moment().format('HH:mm')).then(schedule => {
		return { data: schedule };
	});
}

function get(time) {
	return Store.get(time.replace(/:/g, ''));
}

function post(data) {
	return Validate.post(data.name, data.timeStart, data.timeEnd).then(() => {
		const timeStart = data.timeStart.replace(/:/g, '');
		const timeEnd = data.timeEnd.replace(/:/g, '');
		return Store.post(data.name, parseInt(timeStart), parseInt(timeEnd));
	}).then(schedule => {
		return { data: schedule };
	});
}

function upsert(id, data) {
	return Validate.upsert(id, data.name, data.timeStart, data.timeEnd).then(() => {
		const timeStart = data.timeStart.replace(/:/g, '');
		const timeEnd = data.timeEnd.replace(/:/g, '');
		return Store.upsert(id, data.name, data.enabled, parseInt(timeStart), parseInt(timeEnd));
	}).then(response => {
		return { data: response };
	});
}

function disable(id) {
	return Validate.disable(id).then(() => {
		return Store.disable(id);
	}).then(isDeleted => {
		if (!isDeleted) {
			throw e.error('SCHEDULE_TIME_NOT_VALID');
		}
		return { data: true };
	});
}

//function getSeconds(time) {
////	getSeconds(data.timeEnd);
//	logger.info(moment.duration(time).asSeconds());
//	return moment.duration(time).asSeconds();
//}
//
//function parseSecondsToTime(time) {
////	parseSecondsToTime(54100);
//	var hours = Math.floor(time / 3600);
//	time %= 3600;
//	var minutes = Math.floor(time / 60);
//	var seconds = time % 60;
//	logger.info(hours + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2));
//	return hours + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2);
//}