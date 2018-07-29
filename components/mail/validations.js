const Promise = require('bluebird');
const validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.mailAllUsers = mailAllUsers;

function mailAllUsers(message) {
    return verifyMessage(message);
}

function verifyMessage(message) {
    return new Promise((resolve, reject) => {
        if (validations.isUndefined(message)) {
            return reject(e.error('MAIL_MESSAGE_EMPTY'));
        } else if (!validations.isString(message)) {
            return reject(e.error('MAIL_MESSAGE_NOT_VALID'));
        } else if (!validations.minLength(message, 5)) {
            return reject(e.error('MAIL_MESSAGE_LONGER'));
        } else if (!validations.maxLength(message, 1501)) {
            return reject(e.error('MAIL_MESSAGE_SHORTER'));
        }
        resolve();
    });
}