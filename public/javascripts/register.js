app.controller('register__', function($scope, $http, partial) {
	$scope.register = function() {
//        $http.post('/api/register', {
        console.log({
		    username: $scope.register.username,
			firstname: $scope.register.firstname,
			lastname: $scope.register.lastname,
			gender: $scope.register.gender,
			lookingFor: {
				male: $scope.register.interested.male,
				female: $scope.register.interested.female,
				other: $scope.register.interested.othermail
			},
			birthdate: $scope.register.birthdate,
			email: $scope.register.email,
            password: $scope.register.password
		});
/*        }).success(function(data, status, headers, config) {
            console.log(data);
            $sessionStorage.user = data;
			partial.reload();
        }).error(function(data, status, headers, config) {
            console.log('Error ' + data);
        }); */
    };

	$scope.checkUsername = function() {
		if ($scope.register.username !== undefined) {
			$http.post('/api/check_username', {
				username: $scope.register.username
			}).success(function(data, status, headers, config) {
				console.log(data);
			}).error(function(data, status, headers, config) {
				console.log('Error ' + data);
			});
		} else {
			console.log('No username');
		}
	};
});