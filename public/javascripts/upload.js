app.controller('upload__', ['$scope', 'Upload', '$timeout', function ($http, $scope, Upload, $timeout) {
    $scope.test = function(data) {
        console.log(data);
    };

    $scope.uploadPic = function(file) {
        console.log(file);
        $http.post('/api/photo', {
            data: file
        }).success(function(data) {
            console.log(data);
        }).error(function(data) {
            console.log('Error' + data);
        });

    /*
    IGNORE THIS SHIT
    $scope.uploadPic = function (file) {
        file.upload = Upload.upload({
            url: 'upload/url',
            data: {file: file}

        }

        ).then(function (response) {
            $timeout(function () {
                file.result = response, data;
            })
        }, function (response) {
            if (response.status > 0)
                console.log(`Error: ${data}`)
        }, function (evt) {
            file.progress = parseInt(100.0 * evt.loaded / evt.total);
        });
        */

        console.log("File Obj:");
        console.log(file);
    }
}]);