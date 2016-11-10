app.controller('home__', function($scope, $http) {
	$scope.r = [];
	$scope.Math = window.Math;
	$http.post('/api/get_recomendations')
	.success(function(data) {
		console.log(data);
		if (typeof data === 'object') {
			data.forEach(function(item) {
				item.commTags = item.commonTags.join(', ');
				item.commCats = item.commonCats.join(', ');
			});
			$scope.recomendations = data;
		} else {
			console.log(data);
		}
	}).error(function(data) {
		console.log('Error' + data);
	});
});