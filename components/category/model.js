const model = {
	name: {
		type: 'String',
		length: {
			min: 2,
			max: 30
		},
		required: true
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
