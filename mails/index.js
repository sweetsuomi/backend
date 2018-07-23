const Handlebars = require('handlebars');
const Promise = require('bluebird');
const logger = require('../logger');
const path = require('path');
const fs = Promise.promisifyAll(require('fs'));

exports.build = build;

// TODO (DevStarlight): Create send mail layer https://codeforgeek.com/2014/07/send-e-mail-node-js/

function build(kind, data) {
	return fs.readFileAsync(path.resolve(__dirname, kind + '.hbs'), 'utf-8').then(source => {
		if (!data) {
			return Handlebars.compile(source.toString());
		}
		return Handlebars.compile(source.toString())(data);
	});
}