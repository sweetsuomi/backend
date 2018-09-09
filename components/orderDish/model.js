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
	},
	menu: {
		type: 'ObjectId',
		ref: 'Menu',
		required: true
	}
};

module.exports = {
	model: model
};