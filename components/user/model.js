const model = {
	nickname: {
		type: 'String',
		length: {
			min: 5,
			max: 50
		},
		required: true
	},
	phone: {
		type: 'Number'
	},
	company: {
		type: 'String',
		length: {
			min: 3,
			max: 50
		},
		trim: true
	},
	address: {
		type: 'String',
		length: {
			min: 5,
			max: 50
		}
	},
	account: {
		type: 'ObjectId',
		ref: 'Account'
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