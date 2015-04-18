angular.module('starter.controllers', [])

// Programação
.controller('ProgramacaoCtrl', function($scope, $stateParams, $http, $ionicViewSwitcher, $state, $ionicModal, $timeout, ProgramacaoCache, AlternativasVotacao) {

	$scope.dia = $stateParams.dia + '/04';

	$scope.go = function(){
		$ionicViewSwitcher.nextDirection('none');
	};

	$scope.goHome = function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('menu.home');
	};

	$scope.replaceSpace = function(value) {

		if(value && value !== null){
			return value.replace(/ /g,'-');
		}else{
			return 'outros';
		}
	};

	$scope.checkDia = function(dia){
		if(String(dia) === String($stateParams.dia)){
			return true;
		}
	};

	$scope.place = function(value) {
		if(String(value) === '1'){
			return 'Auditório Principal';
		}else if(String(value) === '1'){
			return 'Auditório 1';
		}
	};

	/////// Modal ///////

	// Form data for the login modal
	$scope.loginData = {};

	// Create the login modal that we will use later
	$ionicModal.fromTemplateUrl('templates/login-votacao.html', {
		scope: $scope
	}).then(function(modal) {
		$scope.modal = modal;
	});

	$scope.login = function(atividadeId) {
		// $scope.loginData[0].id = atividadeId;

		$scope.modal.show();
	};

	$scope.closeLogin = function() {
		$scope.modal.hide();
	};

	// Perform the login action when the user submits the login form
	$scope.doLogin = function() {

		$http({
			method: 'GET',
			url: 'https://cbc2015api.azurewebsites.net/api/questions/' + $scope.loginData.senha,
			headers: {
				'Authorization': 'Basic YWRtaW46YWRtaW4='
			}
		}).
		success(function(data, status) {
			$state.go('menu.votacao', {codigoAtividade: $scope.loginData.senha});
			$scope.closeLogin();

			for (var i = 0; i < data.Answers.length; i++) {
				AlternativasVotacao.set(data.Answers[i].Option, data.Answers[i].Id);
			}

		}).
		error(function(data, status) {
			$scope.erro = 'Código Incorreto ou a sessão ainda está fechada.';
		});
	};


	var cache = ProgramacaoCache.get('ProgramacaoCache');

	if (cache) {
		$scope.atividades = cache;
	}
	else {
		$http({
			method: 'GET',
			url: 'https://cbc2015api.azurewebsites.net/api/activities',
			headers: {
				'Authorization': 'Basic YWRtaW46YWRtaW4='
			}
		}).
		success(function(data, status) {
			$scope.atividades = data;

			localStorage.setItem('programacao', JSON.stringify(data));

		 	ProgramacaoCache.put('ProgramacaoCache', data);
		}).
		error(function(data, status) {
			$scope.atividades = JSON.parse(localStorage.getItem('programacao'));

			cache = ProgramacaoCache.put('ProgramacaoCache', JSON.parse(localStorage.getItem('programacao')));
		});
	}
})

// Atividade
.controller('AtividadeCtrl', function($scope, $stateParams, $ionicViewSwitcher, $state, $sce){

	$scope.goHome = function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('menu.home');
	};

	$scope.SkipValidation = function(value) {
		return $sce.trustAsHtml(value);
	};

	$scope.Place = function(value) {
		if(String(value) === '1'){
			return 'Auditório Principal';
		}else if(String(value) === '1'){
			return 'Auditório 1';
		}
	};

	$scope.Uf = function(value) {
			if(value === '' || !value){
				return '';
			}else{
				return '(' + value + ')';
			}
		};

	$scope.Id = $stateParams.atividadeId;

	var cache = JSON.parse(localStorage.getItem('programacao'));

	for (var i = 0; i < cache.length; i++) {
		if(String(cache[i].Id) === String($stateParams.atividadeId)){
			$scope.Type = cache[i].Type;
			$scope.Theme = cache[i].Theme;
			$scope.Date = cache[i].Date;
			$scope.Room = cache[i].Room;
			$scope.Participants = cache[i].Participants;
			$scope.Lectures = cache[i].Lectures;
		}
	}
})


// Programação por participante
.controller('ProgramacaoParticipanteCtrl', function($scope, $stateParams, $ionicViewSwitcher, $state, $http){

	$scope.goHome = function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('menu.home');
	};

	$scope.Id = $stateParams.palestranteId;

	var cache = JSON.parse(localStorage.getItem('programacao')),
		arrayParticipantes = [],
		arrayPalestrantes = [],
		arrayAtividadesFiltradas = [];

	for (var i = 0; i < cache.length; i++) {

		for (var j = 0; j < cache[i].Participants.length; j++) {

			if (String(cache[i].Participants[j].Id) === String($stateParams.palestranteId)) {

				arrayParticipantes.push(cache[i].Id);

				break;
			}
		}
	}

	for (var i = 0; i < cache.length; i++) {
		for (var k = 0; k < cache[i].Lectures.length; k++) {

			if (String(cache[i].Lectures[k].SpeakerId) === String($stateParams.palestranteId)) {

				arrayPalestrantes.push(cache[i].Id);

				break;
			}
		}
	}

	function unique(ary) {
	    // concat() with no args is a way to clone an array
	    var u = ary.concat().sort();
	    for (var i = 1; i < u.length; ) {
	        if (u[i-1] === u[i])
	            u.splice(i,1);
	        else
	            i++;
	    }
	    return u;
	}

		var idUsuarios = arrayPalestrantes.concat(arrayParticipantes),
		uniq = unique(idUsuarios);

	for (var i = 0; i < cache.length; i++) {
		for (var j = 0; j < uniq.length; j++) {
			if (String(cache[i].Id) === String(uniq[j])) {
				arrayAtividadesFiltradas.push(cache[i]);

			}
		}
	}

	$scope.atividades = arrayAtividadesFiltradas;

	$scope.day = function(day){
		for (var i = 0; i < arrayAtividadesFiltradas.length; i++) {
			if (arrayAtividadesFiltradas[i].Date === day) {
				return true;
			}
		}
	};

})

//Votação
.controller('VotacaoCtrl', function($scope, $http, $ionicPopup, $ionicHistory, $stateParams, $ionicViewSwitcher, $state, AlternativasVotacao){

	$scope.A = AlternativasVotacao.get('a');
	$scope.B = AlternativasVotacao.get('b');
	$scope.C = AlternativasVotacao.get('c');
	$scope.D = AlternativasVotacao.get('d');

	$scope.goHome = function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('menu.home');
	};

	$scope.showConfirm = function(alternativaEscolhida) {

		var confirmPopup = $ionicPopup.confirm({
			title: 'Confirmar Voto',
			cancelText: 'Não',
			cancelType: 'button-assertive',
			okText: 'Sim',
			okType: 'button-balanced'

		});

		confirmPopup.then(function(res) {
			if(res) {
				$ionicPopup.alert({
					title: 'Voto Confirmado'
				}).then(function(res) {

					$http({
						method: 'POST',
						url: 'https://cbc2015api.azurewebsites.net/api/questions/' + $stateParams.codigoAtividade + '/answers/' + alternativaEscolhida + '/useranswers',
						headers: {
							'Authorization': 'Basic YWRtaW46YWRtaW4='
						}
					}).
					success(function(data, status) {
						$ionicHistory.goBack();
					}).
					error(function(data, status) {
						console.log(status);
					});

				});
			}
		});
	};
})

// Participantes
.controller('ParticipantesCtrl', function($scope, $http, $state, $ionicViewSwitcher, ParticipantesCache) {

	$scope.go = function(nacionalidade){
		$ionicViewSwitcher.nextDirection('none');
		$state.go('menu.participantes.' + nacionalidade);
	};

	$scope.goHome = function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('menu.home');
	};

	$scope.verificaFoto = function(foto){
		if (!foto) {
			return 'padrao.png';
		}else{
			return foto;
		}
	};

	var cache = ParticipantesCache.get('ParticipantesCache');

	if (cache) {
		$scope.participantes = cache;
	}
	else {
		$http({
			method: 'GET',
			url: 'https://cbc2015api.azurewebsites.net/api/speakers',
			headers: {
				'Authorization': 'Basic YWRtaW46YWRtaW4='
			}
		}).
		success(function(data, status) {
			$scope.participantes = data;

			localStorage.setItem('participantes', JSON.stringify(data));

		 	ParticipantesCache.put('ParticipantesCache', data);
		}).
		error(function(data, status) {
			$scope.participantes = JSON.parse(localStorage.getItem('participantes'));

			cache = ParticipantesCache.put('ParticipantesCache', JSON.parse(localStorage.getItem('participantes')));
		});
	}
})

// Participante
.controller('ParticipanteCtrl', function($scope, $stateParams, $ionicViewSwitcher, $state, $sce){

	$scope.goHome = function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('menu.home');
	};

	$scope.SkipValidation = function(value) {
		return $sce.trustAsHtml(value);
	};

	$scope.Id = $stateParams.participanteId;

	var cache = JSON.parse(localStorage.getItem('participantes'));


	for (var i = 0; i < cache.length; i++) {
		if(String(cache[i].Id) === String($stateParams.participanteId)){
			$scope.Name = cache[i].Name;
			$scope.Lead = cache[i].Lead;
			$scope.Resume = cache[i].Curriculum;
		}
	}

})

// Expositores
.controller('ExpositoresCtrl', function($scope, $stateParams, $ionicViewSwitcher, $state, $http, ExpositoresCache) {

	$scope.goHome = function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('menu.home');
	};

	var cache = ExpositoresCache.get('ExpositoresCache');

	if (cache) {
		$scope.expositores = cache;
	}
	else {
		$http({
			method: 'GET',
			url: 'https://cbc2015api.azurewebsites.net/api/sponsors',
			headers: {
				'Authorization': 'Basic YWRtaW46YWRtaW4='
			}
		}).
		success(function(data, status) {
			$scope.expositores = data;

			localStorage.setItem('expositores', JSON.stringify(data));

		 	ExpositoresCache.put('ExpositoresCache', data);
		}).
		error(function(data, status) {
			$scope.expositores = JSON.parse(localStorage.getItem('expositores'));

			cache = ExpositoresCache.put('ExpositoresCache', JSON.parse(localStorage.getItem('expositores')));
		});
	}
})


// Mapa evento
.controller('MapaEventoCtrl', function($scope, $stateParams) {

	$scope.X = $stateParams.positionY + 'px';

	$scope.Y = $stateParams.positionX + 'px';
})

// Informações
.controller('InformacoesCtrl', function($scope) {

	$scope.toggleGroup = function(activity) {
		if ($scope.isGroupShown(activity)) {
			$scope.shownGroup = null;
		} else {
			$scope.shownGroup = activity;
		}
	};

	$scope.isGroupShown = function(activity) {
		return $scope.shownGroup === activity;
	};
})

// Programação Social
.controller('ProgramacaoSocialCtrl', function($scope, $http, $stateParams, $state, $ionicViewSwitcher, ProgramacaoSocialCache) {

	$scope.dia = $stateParams.dia + '/04';

	$scope.go = function(){
		$ionicViewSwitcher.nextDirection('none');
	};

	$scope.goHome = function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('menu.home');
	};

	$scope.checkDia = function(dia){
		if(String(dia) === String($stateParams.dia)){
			return true;
		}
	};

	$scope.adesao = function(value) {
		if(value === '' || !value){
			return '';
		}else{
			return 'Por Adesão';
		}
	};

	var cache = ProgramacaoSocialCache.get('ProgramacaoSocialCache');

	if (cache) {
		$scope.atividades = cache;

	}
	else {
		$http({
			method: 'GET',
			url: 'https://cbc2015api.azurewebsites.net/api/socialactivities',
			headers: {
				'Authorization': 'Basic YWRtaW46YWRtaW4='
			}
		}).
		success(function(data, status) {
			$scope.atividades = data;

			localStorage.setItem('programacao-social', JSON.stringify(data));

		 	ProgramacaoSocialCache.put('ProgramacaoSocialCache', data);
		}).
		error(function(data, status) {
			$scope.atividades = JSON.parse(localStorage.getItem('programacao-social'));

			cache = ProgramacaoSocialCache.put('ProgramacaoSocialCache', JSON.parse(localStorage.getItem('programacao-social')));
		});
	}
})

// Atividade Social
.controller('AtividadeSocialCtrl', function($scope, $stateParams, $ionicViewSwitcher, $state, $sce){

	$scope.goHome = function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('menu.home');
	};

	$scope.SkipValidation = function(value) {
		return $sce.trustAsHtml(value);
	};

		$scope.Place = function(value) {
		if(value === '1'){
			return 'Auditório Principal';
		}else{
			return 'Auditório 1';
		}
	};

	$scope.adesao = function(value) {
		if(value === '' || !value){
			return '';
		}else{
			return 'Por Adesão';
		}
	};

	var cache = JSON.parse(localStorage.getItem('programacao-social'));

	for (var i = 0; i < cache.length; i++) {
		if(String(cache[i].Id) === String($stateParams.atividadeId)){
			$scope.Title = cache[i].Title;
			$scope.Photo = cache[i].Photo;
			$scope.Text = cache[i].Text;
			$scope.Type = cache[i].Type;
		}
	}
})

// Concierge
.controller('ConciergeCtrl', function($scope, $stateParams, $http, $sce, ConciergeCache) {

	var cache = ConciergeCache.get('ConciergeCache');


	if (cache) {
		$scope.lugares = cache;

	}
	else {
		$http({
			method: 'GET',
			url: 'https://cbc2015api.azurewebsites.net/api/concierges/',
			params: {
				categoryName: 'Bares e Restaurantes'
			},
			headers: {
				'Authorization': 'Basic YWRtaW46YWRtaW4='
			}
		}).
		success(function(data, status) {
			$scope.lugares = data;

			localStorage.setItem('concierge', JSON.stringify(data));

		 	ConciergeCache.put('ConciergeCache', data);
		}).
		error(function(data, status) {
			$scope.lugares = JSON.parse(localStorage.getItem('concierge'));

			cache = ConciergeCache.put('ConciergeCache', JSON.parse(localStorage.getItem('concierge')));
		});
	}
})

.controller('EstabelecimentoCtrl', function($scope, $stateParams, $sce, $ionicViewSwitcher, $state, ConciergeCache){

	$scope.goHome = function(){
		$ionicViewSwitcher.nextDirection('back');
		$state.go('menu.home');
	};

	$scope.SkipValidation = function(value) {
		return $sce.trustAsHtml(value);
	};

	var cache = JSON.parse(localStorage.getItem('concierge'));

	for (var i = 0; i < cache.length; i++) {
		if(String(cache[i].Id) === String($stateParams.estabelecimentoId)){
			$scope.Photo = cache[i].PhotoCopy;
			$scope.Title = cache[i].Title;
			$scope.Text = cache[i].Text;
		}
	}

})
