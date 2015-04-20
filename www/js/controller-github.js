angular.module('desafioMeetup.github', [])

.controller('GithubCtrl', ['$scope','$http','github.service', 'foto.service','$ionicModal', function($scope, $http, githubService, fotoService, $ionicModal) {

    $scope.model = {username: ''}

    $ionicModal.fromTemplateUrl('templates/picture-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.getUserPhoto = function(){
        githubService.getUser($scope.model.username).then(function (data) {
            $scope.userData = data;
            $scope.openModal();
        })}

        $scope.tirarFoto = function() {
            fotoService.tirarFoto($scope.userData.email);
        }
}])
