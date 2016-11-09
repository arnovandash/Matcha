app.controller('home__', function($scope, $http) {
	$scope.r = [];
	$http.post('/api/get_recomendations')
	.success(function(data) {
		console.log(data);
		if (typeof data === 'object') {
			data.forEach(function(item) {
				item.age = Math.round((Math.round(new Date().getTime()/1000.0) - item.birthdate) / 31536000);
			});
			$scope.recomendations = data;
		} else {
			console.log(data);
		}
	}).error(function(data) {
		console.log('Error' + data);
	});
});