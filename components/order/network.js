const router = require("express").Router();
const Response = require('../../network/response');
const Controller = require('./');
const verifyToken = require('../../middlewares/verifyToken');

// Get a list of orders filtered by user, date or a combination of both
router.get('/:id', (req, res, next) => {
	Controller.get(req.params.id).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

// Get a list of orders filtered by user, date or a combination of both
router.get('/', (req, res, next) => {
	Controller.list(req.query).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

// Post an order
router.post('/', verifyToken, (req, res, next) => {
	Controller.post(req.user, req.body).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

router.put('/deliver', verifyToken, (req, res, next) => {
	Controller.deliver(req.user, req.body).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

router.delete('/:order', verifyToken, (req, res, next) => {
	Controller.remove(req.user, req.params.order).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

module.exports = router;




/* Get all the orders on a day */
// router.get('/all', auth, checkRole,	Validations.getAllOrders,	Order.getAllOrders);

/* Get all the orders of an user */
// router.get('/list',	auth,	Order.getUserOrderList);

/* Post an user order */ // Check if there's enough quantity in the menu
//router.post("/", auth, Validations.postOrder,	Order.postOrder);
// router.post("/", auth,	Order.postOrder);

/* Mark an order as delivered */
//router.put("/deliver", auth, checkRole, Validations.deliverOrder, Order.deliverOrder);
// router.put("/deliver", auth, checkRole, Order.deliverOrder);

/* Delete an order for a given day */
//router.delete("/force", auth, checkRole, Validations.deleteOrderForce, Order.deleteOrderForce);
// router.delete("/force", auth, checkRole, Order.deleteOrderForce);

/* Delete an user order */
//router.delete("/", auth, Validations.deleteOrder,	Order.deleteOrder);
// router.delete("/", auth,	Order.deleteOrder);