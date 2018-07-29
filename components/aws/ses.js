const AWS = require('aws-sdk');
const Promise = require('bluebird');
const config = require('../../config');

AWS.config = new AWS.Config({
	accessKeyId: config.aws_accessKey,
	secretAccessKey: config.aws_secretKey,
	region: config.aws_region
});

AWS.config.setPromisesDependency(Promise);

AWS.config.apiVersions = {
	ses: '2010-12-01'
};

exports.send = send;

function send(email, subject, data) {
	let ses = new AWS.SES();
	const params = {
		Destination: { ToAddresses: [email] },
		Message: {
			Body: {
				Html: {
					Data: data
				},
				Text: {
					Data: data
				}
			},
			Subject: {
				Data: subject
			}
		},
		Source: 'Sweet Suomi <no-reply@sweetsuomi.com>'
	};

	return ses.sendEmail(params)
		.promise()
		.catch(error => {
			return error;
		});
};