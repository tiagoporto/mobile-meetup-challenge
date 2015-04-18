angular.module('devmeetup.github')

.factory('github.service', ['$http', function($http) {
	var getUser = function(username){

		$http.get("https://api.github.com/users/" + username).then(function(result){
			console.log(result);
		})

	}


 }]);
