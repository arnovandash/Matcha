app.controller('confirm__', function($scope, $http, $routeParams, $mdToast) {
	if ($routeParams.link !== undefined) {
		$http.post('/api/confirm', {
            link: $routeParams.link
        }).success(function(data) {
            console.log(data);

			if (data === true) {
				$mdToast.show(
					$mdToast.simple()
						.parent(document.getElementById('toaster'))
						.textContent('Account activated, you can log in')
						.position('top right')
						.hideDelay(3000)
				);
			} else {
				$mdToast.show(
					$mdToast.simple()
						.parent(document.getElementById('toaster'))
						.textContent('There was an error activating your account')
						.position('top right')
						.hideDelay(3000)
				);
			}
			setTimeout(() => {window.location.replace('/');}, 3000);
        }).error(function(data) {
            console.log(`Error: ${data}`);
        });
	}
});