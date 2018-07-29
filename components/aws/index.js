const File = require('../file');
const ses = require("./ses");
const s3 = require("./s3");
const e = require('../../helpers/errors');

exports.sendMail = sendMail;
exports.upload = upload;
exports.removeFromStore = removeFromStore;

function sendMail(email, subject, data) {
	return ses.send(email, subject, data).catch(error => {
		throw e.error('PROBLEM_SENDING_MAIL');
	});
}

function upload(remotePath, file, name) {
	return File.get(file).then(response => {
		return s3.upload(remotePath, response, name);
	}).catch(error => {
		throw e.error('PROBLEM_UPLOADING_IMAGE');
	});
}

function removeFromStore(remotePath, name) {
	return s3.remove(remotePath, name).catch(error => {
		throw e.error('PROBLEM_REMOVING_IMAGE');
	});
}

//function signUploadToS3(req, res, next) {
//	AWS.s3.signUpload(req.query.name, req.query.type)
//		.then(response => res.status(200).json({ token: response }))
//		.catch(error => next(error));
//}

//module.exports = {
//	signUploadToS3: signUploadToS3
//};
