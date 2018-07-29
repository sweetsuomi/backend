const model = {
	title: {
		type: 'String',
		length: {
			min: 7,
			max: 100
		},
		trim: true,
		required: true
	},
	description: {
		type: 'String',
		length: {
			min: 8,
			max: 500
		},
		trim: true
	},
	price: {
		type: 'Number',
		default: 0
	},
	category: {
		type: 'ObjectId',
		ref: 'Category',
	},
	intolerance: [{
		type: 'ObjectId',
		ref: 'Intolerance',
	}],
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