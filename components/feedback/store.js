const Store = require('../../store/mongo');

const schema = 'Feedback';

exports.list = list;
exports.post = post;

function list() {
    const statements = {
		populate: [{
            path: 'user',
            select: 'nickname'
        }],
        sort: {
            "created_at": -1
        }
	};
	
	return Store.query(schema, {}, statements, true);
}

function post(feedback, userId) {
    const query = { user: userId, feedback: feedback };
	return Store.post(schema, query);
}