app.controller('login__', function($http, $scope, $sessionStorage, partial) {
    $scope.login = function() {
        $http.post('/api/login', {
            username: $scope.login.username,
            password: $scope.login.password
        }).success(function(data, status, headers, config) {
            console.log(data);
            $sessionStorage.user = data;
			partial.reload();
        }).error(function(data, status, headers, config) {
            console.log('Error' + data);
        });
    };
});

app.controller('locate__', function($http, $scope, $sessionStorage, partial){

    $scope.locate = function() {
      console.log("Activating GPS...");
    	navigator.geolocation.getCurrentPosition(on_success, on_error, {
    		timeout: 5000});
    };

    function on_success(position){
    	console.log("GPS activated sucessfully!");
    	var lat = position.coords.latitude;
    	var lng = position.coords.longitude;
    	my_location = new google.maps.LatLng(lat, lng);
      console.log(lat);
      console.log(lng);
    };

    function on_error(error) {
    	console.log("GPS activation failure!");
    	//fallback on wifi and call tower location
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
