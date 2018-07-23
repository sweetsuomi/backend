const model = {
	name: {
		type: 'String',
		length: {
			min: 2,
			max: 20
		},
		index: true,
		required: true
	},
	timeStart: {
		type: 'Number',
		required: true
	},
	timeEnd: {
		type: 'Number',
		required: true
	},
	enabled: {
		type: 'Boolean',
		default: true
	}
};

//const Model = new Modelate('User').set(model);

//function set(data) {
//	return Model.modelate(data);
//}


module.exports = {
	model: model,
//	set: set
};
