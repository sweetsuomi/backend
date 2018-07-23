const Promise = require('bluebird');
const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});
const config = require('../../config');
const e = require('../../helpers/errors');

exports.get = get;

function get(file) {
	return needsResize(file).then(response => {
		if (response === true) {
			return resizeImage(file);
		} else {
			return getImage(file);
		}
	});
}

function getImage(file) {
	return new Promise((resolve, reject) => {
		fs.readFile(config.upload_folder + file.filename, function (error, data) {
			if (error) {
				return reject(e.error('FILE_ERROR_READ'));
			}
			resolve(new Buffer(data, 'binary'));
		});
	});
}

function needsResize(file) {
	return new Promise((resolve, reject) => {
		gm(config.upload_folder + file.filename)
			.size((error, size) => {
				if (error) {
					throw e.error('FILE_ERROR_RESIZE');
				} else if (size.width !== file.maxWidth) {
					resolve(true);
				} else {
					resolve(false);
				}
			});
	});
}

function resizeImage(file) {
	return new Promise((resolve, reject) => {
		gm(config.upload_folder + file.filename)
			.resize(file.maxSize)
			.toBuffer('PNG', (error, buffer) => {
				if (error) {
					throw e.error('FILE_ERROR_RESIZE');
				}
				resolve(buffer);	
			});
	});
}