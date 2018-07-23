const routes = server => {
	
	const component = function(name) { return '../components/' + name + '/network' };
	
	server.use('/category', require(component('category')));
	server.use('/intolerance', require(component('intolerance')));
	server.use('/account', require(component('account')));
	server.use('/dish', require(component('dish')));
	server.use('/user', require(component('user')));
	server.use('/schedule', require(component('schedule')));
	server.use('/menu', require(component('menu')));
	server.use('/feedback', require(component('feedback')));
	server.use('/order', require(component('order')));
};

module.exports = routes;