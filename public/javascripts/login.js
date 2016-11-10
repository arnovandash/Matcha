app.controller('login__', ($http, $scope, $sessionStorage, partial, locate) => {
    $scope.login = () => {
        $http.post('/api/login', {
            username: $scope.login.username,
            password: $scope.login.password
        }).success((data) => {
			locate.getLocation(() => {
				console.log(data);
		        $sessionStorage.user = data;
				partial.reload();
			});
        }).error((data) => {
            console.log(`Error ${data}`);
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
