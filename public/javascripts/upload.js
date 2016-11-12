app.controller('upload__', ['$http', 'Upload', '$timeout', '$scope', '$sessionStorage', function ($http, Upload, $timeout, $scope, $sessionStorage) {
    $scope.uploadPic = function(file) {
        Upload.base64DataUrl(file).then(function (image) {
            $timeout(function () {
                imgPost(image, function(result) {
                    console.log(`Image Upload Status: ${result}`);
                });
            });
        });
    };

    function makeid(length)
    {
        var text = "";
        var possible = "abcdefg0123456789";
        for( var i=0; i < length; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    function imgPost(data, callback) {
        var img = data.replace(/^data:image\/\w+;base64,/, "");
        var uid = makeid(16);
        $http.post('/api/add_img', {
            uid: uid,
            data: img
        }).success((data) => {
            callback(data);
        });
    }
}]);