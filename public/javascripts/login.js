app.controller('login__', function($http, $scope, $sessionStorage, partial) {
    $scope.login = function() {
        $http.post('/api/login', {
            username: $scope.login.username,
            password: $scope.login.password
        }).success(function(data, status, headers, config) {
            console.log(data);
            $sessionStorage.user = data;
			partial.reload();
        }).error(function(data, status, headers, config) {
            console.log('Error' + data);
        });
    };
});

app.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('deep-purple');

	$mdThemingProvider.theme('loginDark', 'default')
		.primaryPalette('pink')
		.backgroundPalette('deep-purple')
		.dark();
});