const model = {
	feedback: {
		type: 'String',
		length: {
			min: 6,
			max: 1000
		},
		trim: true,
		required: true
	},
	user: {
		type: 'ObjectId',
		ref: 'User',
		required: true
	}
};

module.exports = {
	model: model
};