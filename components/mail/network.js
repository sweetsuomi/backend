const router = require("express").Router();
const Response = require('../../network/response');
const Controller = require('./');
const verifyToken = require('../../middlewares/verifyToken');

/* List all the intolerances.*/
router.post('/all', verifyToken, (req, res, next) => {
	Controller.mailAllUsers(req.body).then(response => {
		Response.success(req, res, next, (response.code || 200), response.data);
	}).catch(error => {
		Response.error(req, res, next, (error.status || 500), error.message);
	});
});

module.exports = router;