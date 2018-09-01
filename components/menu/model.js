const model = {
	dish: {
		type: 'ObjectId',
		ref: 'Dish',
		required: true
	},
	quantity: {
		type: 'Number',
		default: 0,
		required: true
	},
	date: {
		type: 'Number',
		required: true
	},
	schedule: {
		type: 'ObjectId',
		ref: 'Schedule',
		required: true
	}
};

module.exports = {
	model: model
};