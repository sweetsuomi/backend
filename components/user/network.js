const router = require("express").Router();
const Response = require('../../network/response');
const Controller = require('./');

// Account exist in the database
router.get('/exist/:nickname', (req, res, next) => {
	Controller.exist(req.params.nickname).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

router.get('/:id', (req, res, next) => {
	Controller.get(req.params.id).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

module.exports = router;
