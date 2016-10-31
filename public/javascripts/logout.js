app.controller('logout__', function($http, $scope, $sessionStorage, partial) {
	$scope.logout = function() {
		$http.post('/api/logout')
		.success(function(data, status, headers, config) {
			console.log(data);
			$sessionStorage.user = data;
			partial.reload();
		}).error(function(data, status, headers, config) {
			console.log('Error' + data);
		});
	};
});