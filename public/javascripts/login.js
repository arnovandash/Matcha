app.controller('login__', ($http, $scope, $rootScope, $sessionStorage, $mdToast, partial, locate) => {
    $scope.login = () => {
        $http.post('/api/login', {
            username: $scope.login.username,
            password: $scope.login.password
        }).success((data) => {
			if (typeof data === 'object') {
				locate.getLocation(() => {
					$rootScope.cat = data.cat;
					delete data.cat;
		            $sessionStorage.user = data;
					partial.reload();
				});
			} else {
				$mdToast.show(
                    $mdToast.simple()
                    .parent(document.getElementById('toaster'))
                    .textContent(data)
                    .position('top right')
                    .hideDelay(3000)
                );
				$sessionStorage.user = null;
			}

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
