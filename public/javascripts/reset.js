app.controller('sendReset__', function($http, $scope) {
	$scope.sendReset = function() {
		if ($scope.reset !== undefined) {
			$http.post('/api/send_reset', {
	            usernameEmail: $scope.reset.username
	        }).success(function(data) {
	            console.log(data);
				if (data === true) {
					window.location.replace('/');
				}
	        }).error(function(data) {
	            console.log('Error' + data);
	        });
		} else {
			console.log('no username or email');
		}
	};
});

app.controller('confirmReset__', function($http, $scope, $routeParams) {
	$scope.confirmReset = function() {
		if ($routeParams.link !== undefined) {
			$http.post('/api/reset', {
	            link: $routeParams.link,
				password: $scope.reset.password
	        }).success(function(data) {
	            console.log(data);
				if (data === true) {
					window.location.replace('/');
				}
	        }).error(function(data) {
	            console.log('Error' + data);
	        });
		}
	};
});