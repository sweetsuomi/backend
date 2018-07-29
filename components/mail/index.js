const Validate = require('./validations');
const User = require('../user');
const config = require('../../config');
const mail = require('../../mails');
const aws = require('../aws');

exports.mailAllUsers = mailAllUsers;

function mailAllUsers(data) {
    return Validate.mailAllUsers(data.message).then(() => {
        return User.list();
    }).then(response => {
        for (let i = 0; i < response.length; i += 1) {
            sendOrderEmail('comunication', 'Sweetsuomi - Comunica', {
                message: data.message,
                aws_cloudfront: config.aws_cloudfront,
                nickname: response[i].nickname
            }, response[i].account.email);
        }
        return { data: true };
    });
}

function sendOrderEmail(type, title, data, email) {
	mail.build(type, data).then(response => {
		return aws.sendMail(email, title, response);
	});
}