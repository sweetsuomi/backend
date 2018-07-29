const AWS = require('aws-sdk');
const Promise = require('bluebird');
const config = require('../../config');
const logger = require('../../logger');

AWS.config = new AWS.Config({
	accessKeyId: config.aws_accessKey,
	secretAccessKey: config.aws_secretKey,
	region: config.aws_region
});

AWS.config.setPromisesDependency(Promise);

AWS.config.apiVersions = {
	s3: '2006-03-01'
};

exports.upload = upload;
exports.remove = remove;

function upload(remotePath, buffer, name) {
	let s3 = new AWS.S3();
	
	let params = {
		Bucket: config.aws_s3Bucket,
		Key: remotePath + name + '.png',
		Body: buffer,
		ACL: 'public-read',
		ContentEncoding: 'base64',
		ContentType: config.images_mimeType
	};
	
	return s3.upload(params).promise();
}

function remove(remotePath, name) {
	let s3 = new AWS.S3();
	
	let params = {
		Bucket: config.aws_s3Bucket,
		Key: remotePath + name + '.png'
	};
	
	return s3.deleteObject(params).promise();
}

//const signUploadToS3 = function (name, type) {
//	return new Promise((resolve, reject) => {
//		let s3 = new AWS.S3({
//			signatureVersion: 'v4'
//		});
//		s3.getSignedUrl('putObject', {
//			Bucket: config.aws.s3Bucket,
//			Key: 'temp/' + name + '.' + type,
//			ContentType: 'image/' + type,
//			Expires: 60 * 10,
//			ACL: 'public-read'
//		}, function (err, url) {
//			if (err) {
//				reject(new Error(err));
//			}	else {
//				resolve(url);
//			}
//		});
//	});
//};
//
//const copyObject = function (oldName, newName, path) {
//	let s3 = new AWS.S3();
//	let params = {
//		Bucket: config.aws.s3Bucket,
//		Key: path + newName + ".png",
//		CopySource: config.aws.s3Bucket + '/temp/' + oldName,
//		ACL: 'public-read'
//	};
//	return s3.copyObject(params).promise();
//};

//module.exports = {
//	s3: {
//		signUpload: signUploadToS3,
//		copyObject: copyObject
//	}
//};
