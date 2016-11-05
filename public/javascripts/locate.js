app.controller('locate__', function($http, $scope, $sessionStorage) {
  var retryCount = 0;
  var lat;
  var lng;

  $scope.locate = function () {
    console.log('Activating GPS...');
    navigator.geolocation.getCurrentPosition(on_success, on_error, {
      timeout: 5000
    });
  };

  function on_success(position) {
    console.log('GPS activated sucessfully!');
    lat = position.coords.latitude;
    lng = position.coords.longitude;
    console.log('Lat: ' + lat);
    console.log('Long: ' + lng);
    post_latlng(lat, lng);
  }

  function on_error() {
    console.log('GPS activation failure!');
    console.log('Location falling back on Cell towers');
    var location = $http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyBjCZRwFkhJpKNqq_HNxJfDeNOWBFE5Ijc')
        .success(function () {
          console.log('SUCCESS!!');
          lat = location.$$state.value.data.location.lat;
          lng = location.$$state.value.data.location.lng;
          console.log('Lat: ' + lat);
          console.log('Long: ' + lng);
          console.log('Gotcha bi*ch!');
          post_latlng(lat, lng);
        })
        .error(function () {
          console.log('Failure, retrying...');
          if (retryCount < 3) {
            setTimeout(on_error, 5000);
            retryCount++;
          }
        });
  }

  function post_latlng(lat, lng) {
    $http.post('/api/set_location', {
      username: $sessionStorage.user,
      latitude: lat,
      longitude: lng
    }).success(function (data) {
      console.log(data);
    }).error(function (data) {
      console.log('Error ' + data);
    });
  }
})