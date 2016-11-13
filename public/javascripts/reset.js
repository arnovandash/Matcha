app.controller('sendReset__', function($http, $scope, $mdToast) {
	$scope.sendReset = function() {
		if ($scope.reset !== undefined) {
			$http.post('/api/send_reset', {
	            usernameEmail: $scope.reset.username
	        }).success(function(data) {
	            console.log(data);
				if (data === true) {
					$mdToast.show(
                        $mdToast.simple()
                            .parent(document.getElementById('toaster'))
                            .textContent('Password reset sent. Please check your email')
                            .position('top right')
                            .hideDelay(3000)
                    );
				} else {
					$mdToast.show(
                        $mdToast.simple()
                            .parent(document.getElementById('toaster'))
                            .textContent('An error occurred, please try again')
                            .position('top right')
                            .hideDelay(3000)
                    );
				}
				setTimeout(() => {window.location.replace('/');}, 3000);
	        }).error(function(data) {
	            console.log('Error' + data);
	        });
		} else {
			console.log('no username or email');
		}
	};
});

app.controller('confirmReset__', function($http, $scope, $routeParams, $mdToast) {
	$scope.confirmReset = function() {
		if ($routeParams.link !== undefined) {
			$http.post('/api/reset', {
	            link: $routeParams.link,
				password: $scope.reset.password
	        }).success(function(data) {
				if (data === true) {
					$mdToast.show(
                        $mdToast.simple()
                            .parent(document.getElementById('toaster'))
                            .textContent('Password reset sent. Please check your email')
                            .position('top right')
                            .hideDelay(3000)
                    );
				} else {
					$mdToast.show(
                        $mdToast.simple()
                            .parent(document.getElementById('toaster'))
                            .textContent('An error occurred, please try again')
                            .position('top right')
                            .hideDelay(3000)
                    );
				}
				setTimeout(() => {window.location.replace('/');}, 3000);
	        }).error(function(data) {
	            console.log('Error' + data);
	        });
		}
	};
});