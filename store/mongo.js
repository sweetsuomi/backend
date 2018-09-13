/*
	Script that connects store layer with mongoose
		- Support for declaring new models
		-	Support for mongoose.type.objectId referenced fields
		- Query by id, or any other params, for a single or multiple results.
		- Post - Create a new document
		- Update by id or any other field
	
			POWERED BY DEVSTARLIGHT
*/

const mongoose = require('mongoose');
const Promise = require('bluebird');
const logger = require('../logger');
const e = require('../helpers/errors');

mongoose.Promise = Promise;

let modelInstances = [];

exports.list = list;
exports.count = count;
exports.query = query;
exports.post = post;
exports.upsert = upsert;
exports.remove = remove;

function list(name, query) {
	let schema = setupSchema(name);
	
	return schema.find(query).lean().exec().catch(error => {
		logger.error(error.message);
		throw e.error('DATABASE_ERROR', 500);
	});
}

function count(name, condition) {
	let schema = setupSchema(name);

	return schema.count(condition).catch(error => {
		logger.error(error.message);
		throw e.error('DATABASE_ERROR', 500);
	});
}

function query(name, condition, statements, multi) {
	let schema = setupSchema(name);
	
	let sentence = undefined;
	
	if (condition && condition.id && multi === false) {
		sentence = schema.findById(condition.id);
	} else if (multi) {
		sentence = schema.find(condition);
	} else {
		sentence = schema.findOne(condition);			
	}

	for (const key in statements) {
		const statement = statements[key];
		if (key === 'populate') {
			setupSchemaFromRecursivePopulate(statement);
		}
		sentence[key](statement);
	}

	return sentence.lean().exec().catch(error => {
		logger.error(error.message);
		throw e.error('DATABASE_ERROR', 500);
	});
}

function post(name, query) {
	let schema = setupSchema(name);

	return schema.create(query).catch(error => {
		logger.error(error.message);
		throw e.error('DATABASE_ERROR', 500);
	});
}

function upsert(name, condition, query, filters) {
	let schema = setupSchema(name);

	let sentence = undefined;
	
	if (typeof condition === 'object') {
		sentence = schema.update(condition, query, filters);
	} else {
		sentence = schema.findByIdAndUpdate(condition, query, filters);
	}
	
	return sentence.lean().exec().then(response => {
		if (response && response.upserted) {
			return response.upserted[0]._id;
		}
		return response ? true : false;
	}).catch(error => {
		logger.error(error.message);
		throw e.error('DATABASE_ERROR', 500);
	});
}

function remove(name, condition, multi) {
	let schema = setupSchema(name);
	let sentence = undefined;

	if (condition && condition.id && multi === false) {
		sentence = schema.findById(condition.id);
	} else if (multi) {
		sentence = schema.find(condition);
	} else {
		sentence = schema.findOne(condition);
	}
	
	return sentence.remove().exec().then(response => {
		return response.result.n === 0 ? false : true;
	}).catch(error => {
		logger.error(error.message);
		throw e.error('DATABASE_ERROR', 500);
	});
}

function getModel(name) {
	let model = require('../components/' + lowerCaseFirstLetter(name) + '/model').model;
	
	for (const key in model) {
		if (model[key].ref) {
			model[key].type = mongoose.Schema.Types.ObjectId;
		} else if (model[key][0] && model[key][0].ref) {
			model[key][0].type = mongoose.Schema.Types.ObjectId;
		}
	}
	
	return model;
}

function setupSchema(name) {
	if (modelInstances[name]) {
		return modelInstances[name];
	}
	let model = getModel(name);
	let schema = new mongoose.Schema(model, { timestamps: { createdAt: 'created_at' } });
	modelInstances[name] = mongoose.model(name, schema);
	return modelInstances[name];
}

function setupSchemaFromRecursivePopulate(object) {
	for (const element in object) {
		if (object[element].path) {
			const schema = setupSchema(capitalizeFirstLetter(object[element].path));
			for (const subobject in object[element].populate) {
				setupSchemaFromRecursivePopulate([object[element].populate[subobject]]);
			}
		}
	}
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseFirstLetter(string) {
	return string.toLowerCase();
}