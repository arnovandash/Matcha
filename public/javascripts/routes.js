app.config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: '/home',
			controller: 'home__'
		})
		.when('/account', {
			templateUrl: '/account',
			controller: 'account__'
		});
});