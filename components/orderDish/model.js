const model = {
	dish: {
		type: 'ObjectId',
		ref: 'Dish',
		required: true
	},
	quantity: {
		type: 'Number',
		default: 0
	},
	order: {
		type: 'ObjectId',
		ref: 'Order',
        required: true,
        index: true
	}
};

module.exports = {
	model: model
};