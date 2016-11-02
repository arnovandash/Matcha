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

    function on_error(error){
    	console.log("GPS activation failure!");
      console.log("Location falling back on Cell towers");
      var location = $http.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBjCZRwFkhJpKNqq_HNxJfDeNOWBFE5Ijc")
      .success(function(){console.log("SUCESS!!"),
    console.log("Lat: " + location.$$state.value.data.location.lat),
  console.log("Long: " + location.$$state.value.data.location.lng),
  console.log('Gotcha bi*ch!')})
      .error(function(error){console.log("Failure")}
    );
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
