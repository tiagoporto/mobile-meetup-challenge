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
	var enviarEmail = function(email, imageURI) {
        if(window.plugins && window.plugins.emailComposer) {
            window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
                console.log("Response -> " + result);
            },
            "Foto", // Subject
            "Segue a foto",                      // Body
            [email],    // To
            null,                    // CC
            null,                    // BCC
            false,                   // isHTML
            [imageURI.replace('file://', '')],                    // Attachments
            null);                   // Attachment Data
        }
    }

    var tirarFoto = function(email) {
     navigator.camera.getPicture(function(imageURI) {
         console.log(imageURI);
         enviarEmail(email, imageURI);
     }, function(err) {

     }, {});
 }

 return {
    tirarFoto: tirarFoto
};
}]);
