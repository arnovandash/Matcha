app = angular.module('matcha', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngStorage']);

app.controller('matcha__', function($http, $scope, $location, $sessionStorage) {
    $scope.login = function() {
		console.log('Login');
        $http.post('/api/login', {
            username: $scope.username,
            password: $scope.password
        }).success(function(data, status, headers, config) {
			console.log(data);
			$sessionStorage.user = data;
			$location.url('/');
		}).error(function(data, status, headers, config) {
			console.log('Error' + data);
		});
    };
});