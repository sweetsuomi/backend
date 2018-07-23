const router = require("express").Router();
const Response = require('../../network/response');
const Controller = require('./');
const verifyToken = require('../../middlewares/verifyToken');

router.get('/now', (req, res, next) => {
	Controller.getNow().then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

router.get('/', (req, res, next) => {
	Controller.list(req.query).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

router.post('/', verifyToken, (req, res, next) => {
	Controller.post(req.body).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

router.put('/:id', verifyToken, (req, res, next) => {
	Controller.upsert(req.params.id, req.body).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});


router.delete('/:id', verifyToken, (req, res, next) => {
	Controller.disable(req.params.id).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});



module.exports = router;