angular.module('devmeetup.github')

.factory('github.service', ['$http', function($http) {
	var getUser = function(username){

		return $http.get("https://api.github.com/users/" + username).then(function(result){
			return result.data;
		})

	}

	return {getUser: getUser};

 }])

.factory('foto.service', ['$http', function($http) {
	var tirarFoto = function() {
	  		navigator.camera.getPicture(function(imageURI) {
	  	}, function(err) {

		}, cameraOptions);
  	}
  	return {tirarFoto: tirarFoto};
}]);
