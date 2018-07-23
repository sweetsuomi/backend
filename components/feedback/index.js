const validate = require('./validations');
const config = require('../../config');
const store = require('./store');

exports.list = list;
exports.post = post;

function list() {
    return store.list().then(list => {
        return { data: list };
    });
}

function post(data) {
    const userId = data.userId || config.user_id;
    return validate.post(data.feedback, userId).then(() => {
        return store.post(data.feedback, userId);
    }).then(() => {
        return { data: {} };
    });
}