const router = require('express').Router();
const Controller = require('./index');
const Response = require('../../network/response');

router.get('/', function (req, res, next) {
	Controller.list().then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

router.post('/', function (req, res, next) {
	Controller.post(req.body).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

module.exports = router;