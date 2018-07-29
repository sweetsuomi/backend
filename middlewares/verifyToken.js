const jwt = require('jsonwebtoken');
const config = require('../config');
const Response = require('../network/response');

module.exports = (req, res, next) => {
	const bearerHeader = req.headers["authorization"];
	if (bearerHeader) {
		const bearer = bearerHeader.split(" ");
		const bearerToken = bearer[1];
		jwt.verify(bearerToken, config.jwt_secret, (error, decoded) => {
			if (error) {
				Response.error(req, res, next, (error.code || 500), 'Invalid token');
			}
			req.user = decoded;
			next();
		});
	} else {
		Response.error(req, res, next, 403, 'Unauthenticated');
	}
}