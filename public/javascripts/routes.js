app.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'partials/home',
			controller: 'home__'
		})
		.when('/account', {
			templateUrl: 'partials/account',
			controller: 'account__'
		})
		.when('/license', {
			templateUrl: 'partials/license',
			controller: 'home__'
		})
		.when('/confirm/:link', {
			templateUrl: 'partials/confirm',
			controller: 'confirm__'
		})
		.otherwise({
			redirectTo: '/'
		});

	$locationProvider.html5Mode(true);
});