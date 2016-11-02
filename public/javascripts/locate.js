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

    function on_error(){
    	console.log("GPS activation failure!");
      console.log("Location falling back on Cell towers");
      var location = $http.post("https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBjCZRwFkhJpKNqq_HNxJfDeNOWBFE5Ijc")
      .success(function(){console.log("SUCCESS!!"),
      console.log("Lat: " + location.$$state.value.data.location.lat),
      console.log("Long: " + location.$$state.value.data.location.lng),
      console.log('Gotcha bi*ch!')})
      .error(function(error){console.log("Failure.. retrying"),
      setTimeout(on_error, 5000)
    });
  };
});
