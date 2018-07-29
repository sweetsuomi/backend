const model = {
	user: {
		type: 'ObjectId',
		ref: 'User',
		required: true
	},
	note: {
		type: 'String',
		length: {
			max: 100
		},
	},
	isDelivered: {
		type: 'Boolean',
		default: false,
		required: true
	},
	date: {
		type: 'Number',
		required: true
	},
	time: {
		type: 'Number',
		required: true
	}
};

module.exports = {
	model: model
};