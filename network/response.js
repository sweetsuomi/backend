const statusMessage = {
	'200': 'Done',
	'201': 'Created',
	'202': 'Accepted',
	'204': 'No content',
	'400': 'Invalid format',
	'401': 'Unauthenticated',
	'403': 'Forbidden',
	'404': 'Not found',
	'409': 'Conflict', // Data already exist in DB
	'500': 'Internal error'
};

exports.success = function(req, res, next, code, data) {
	res.status(code || 200).send(data || statusMessage[code]);
};

exports.error = function(req, res, next, code, message) {
	res.status(code || 500).send({msg: message || statusMessage[code]});
};