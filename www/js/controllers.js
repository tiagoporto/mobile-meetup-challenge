angular.module('devmeetup.github', [])

.controller('GithubCtrl', function($scope, $http) {

	$scope.validar = function(){
		$http.get("https://api.github.com/users/tiagoporto").then(function(result){
			console.log(result);
		})
	}

})

.controller('FotoCtrl', function($scope) {

});
