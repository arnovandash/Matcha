app = angular.module('matcha', ['ngMaterial', 'ngMessages', 'ngRoute', 'ngStorage']);

app.controller('matcha__', function($http, $scope, $location, $sessionStorage) {
    $scope.title = 'Matcha';


});

app.controller('login__', function($http, $scope, $location, $sessionStorage, partial) {
    $scope.login = function() {
        $http.post('/api/login', {
            username: $scope.username,
            password: $scope.password
        }).success(function(data, status, headers, config) {
            console.log(data);
            $sessionStorage.user = data;
			partial.reload();
        }).error(function(data, status, headers, config) {
            console.log('Error' + data);
        });
    };
});

app.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('loginDark', 'default')
	.primaryPalette('pink')
	.backgroundPalette('deep-purple')
	.dark();
});

/******************************************************************************/
/*    This factory is just to simplify reloading partials that have the same  */
/*    address, but different content rendered by the server for different     */
/*    situations. For example: the home page says login or signup before the  */
/*    user has logged in, but after they have logged in, it displays their    */
/*    home page and logout information.                                       */
/*                                                                            */
/*    Include 'partial' as a dependency for controllers and use               */
/*    'partial.reload()' to get the new page from the server                  */
/******************************************************************************/
app.factory('partial', ['$route', '$templateCache', function($route, $templateCache) {
	return {
		reload: function() {
		    $templateCache.remove($route.current.templateUrl);
		    $route.reload();
		}
	};
}]);