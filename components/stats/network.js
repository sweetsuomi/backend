const router = require('express').Router();
const Controller = require('./index');
const Response = require('../../network/response');
const verifyToken = require('../../middlewares/verifyToken');

router.get('/orderdish/sold', verifyToken, function (req, res, next) {
	Controller.orderDishSold(req.user).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

router.get('/user/count', verifyToken, function (req, res, next) {
	Controller.userCount(req.user).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

router.get('/order/count', verifyToken, function (req, res, next) {
	Controller.orderCount(req.user).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

module.exports = router;