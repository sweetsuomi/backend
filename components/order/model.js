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
		default: 0
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
		type: 'ObjectId',
		ref: 'Schedule',
		required: true
	}
};

module.exports = {
	model: model
};