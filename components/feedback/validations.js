const Promise = require('bluebird');
const validations = require('../../helpers/validations');
const e = require('../../helpers/errors');

exports.post = post;

function post(feedback, userId) {
    return verifyFeedback(feedback).then(() => {
        return verifyId(userId);
    });
}

function verifyId(id) {
    return new Promise((resolve, reject) => {
        if (validations.isUndefined(id)) {
            return reject(e.error('USER_NOT_EXIST'));
        } else if (!validations.isMongoose(id)) {
            return reject(e.error('USER_NOT_EXIST'));
        }
        resolve();
    });
}

function verifyFeedback(feedback) {
    return new Promise((resolve, reject) => {
        if (validations.isUndefined(feedback)) {
            return reject(e.error('FEEDBACK_EMPTY'));
        } else if (!validations.isString(feedback)) {
            return reject(e.error('FEEDBACK_EMPTY'));
        } else if (!validations.minLength(feedback, 6)) {
            return reject(e.error('FEEDBACK_LONGER'));
        } else if (!validations.maxLength(feedback, 1001)) {
            return reject(e.error('FEEDBACK_SHORTER'));
        }
        resolve();
    });
}