app.directive('validUsername', function ($q, $http) {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {

            ctrl.$asyncValidators.username = function (modelValue, viewValue) {
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty model valid
                    return $q.resolve();
                }
                if (scope.originalUsername !== undefined && modelValue === scope.originalUsername){
                    return $q.resolve();
                }
                var def = $q.defer();
                $http.post('/api/check_username', {
                    username: modelValue
                }).success(function (data, status, headers, config) {
                    if (data === false) {
                        def.reject();
                    }
                    def.resolve();
                }).error(function (data, status, headers, config) {
                    console.log('Error ' + data);
                    def.reject();
                });
                return def.promise;
            };
        }
    };
});

app.directive("validEmail", function ($q, $http) {
    return {
        require: "ngModel",
        link: function (scope, element, attrs, ctrl) {
            ctrl.$asyncValidators.freeEmail = function (modelValue, viewValue) {
                console.log("modle: " + modelValue + " view: " + viewValue);
                if (ctrl.$isEmpty(modelValue)) {
                    // consider empty model valid
                    return $q.resolve();
                }
                var def = $q.defer();
                $http.post('/api/check_email', {
                    email: modelValue
                }).success(function (data) {
                    console.log(data);
                    if (data === false)
                        def.reject();
                    def.resolve();
                }).error(function (data) {
                    console.log('Error ' + data);
                    def.reject();
                });
                return def.promise;
            }
        }
    };
});
