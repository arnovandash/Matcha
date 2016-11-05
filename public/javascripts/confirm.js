app.controller('confirm__', function($scope, $http, $routeParams) {
	if ($routeParams.link !== undefined) {
		$http.post('/api/confirm', {
            link: $routeParams.link
        }).success(function(data) {
            console.log(data);
			if (data === true) {
				window.location.replace('/');
			}
        }).error(function(data) {
            console.log(`Error: ${data}`);
        });
	}
});