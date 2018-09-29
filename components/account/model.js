const model = {
	email: {
		type: 'String',
		length: {
			min: 6,
			max: 100
		},
		trim: true,
		required: true
	},
	username: {
		type: 'String',
		length: {
			min: 5,
			max: 50
		},
		trim: true,
		required: true
	},
	password: {
		type: 'String',
		length: {
			min: 5,
			max: 30
		},
		trim: true,
		required: true
	},
	role: {
		type: 'String',
		enum: ['User', 'Admin'],
		default: 'user'
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