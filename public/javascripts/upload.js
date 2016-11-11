app.controller('upload__', ['$http', 'Upload', '$timeout', '$scope', '$sessionStorage', function ($http, Upload, $timeout, $scope, $sessionStorage) {
    $scope.uploadPic = function(file) {
        console.log($sessionStorage);
        console.log($sessionStorage.user.username);
      //  if ($sessionStorage.data.username !== undefined)
     //   {
            var image = Upload.base64DataUrl(file);
            image.then(function (image) {
                $timeout(function () {
                    imgPost(image);
                });
            }, function (response) {
                if (response.status > 0)
                    console.log(`Error: ${data}`);
            }, function (evt) {
                file.progress = 100, parseInt(100.0 * evt.loaded / evt.total);
            });
      //  }
      //  else
       //     $http.post('/api/logout')
       //     window.location.replace('/');
       //     console.log($scope);
    }

    function makeid(length)
    {
        var text = "";
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    function imgPost(data) {
        var img = data.replace(/^data:image\/\w+;base64,/, "");
        var uid = makeid(16);
        $http.post('/api/photo', {
            uid: uid,
            data: img
        });
    }
}]);