angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		// Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		// for form inputs)
		if (window.cordova && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
		}
		if (window.StatusBar) {
			// org.apache.cordova.statusbar required
			StatusBar.styleDefault();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
 	$ionicConfigProvider.backButton.previousTitleText(false).text('&emsp;&emsp;');

	$stateProvider

	// MENU
	.state('menu', {
		url: '/menu',
		abstract: true,
		templateUrl: 'templates/menu.html',
		controller: 'ProgramacaoCtrl'
	})

	// HOME
	.state('menu.home', {
		url: '/home',
		views: {
			'menuContent': {
				templateUrl: 'templates/home.html',
			}
		}
	})

	// PROGRAMAÇÂO
	.state('menu.programacao', {
		url: '/programacao',
		abstract: true,
		views: {
			'menuContent': {
				templateUrl: 'templates/programacao.html',
				controller: 'ProgramacaoCtrl'
			}
		}
	})

	.state('menu.programacao.dia', {
		url: '/dia/:dia',
		views: {
			'tabProgramacao': {
				templateUrl: 'templates/programacao-dia.html',
				controller: 'ProgramacaoCtrl'
			}
		}
	})

	.state('menu.programacao-por-participante', {
		url: '/atividade/participante/:palestranteId',
		views: {
			'menuContent': {
				templateUrl: 'templates/programacao-por-participante.html',
				controller: 'ProgramacaoParticipanteCtrl'
			}
		}
	})

	.state('menu.atividade', {
		url: '/atividade/:atividadeId',
		views: {
			'menuContent': {
				templateUrl: 'templates/atividade.html',
				controller: 'AtividadeCtrl'
			}
		}
	})

	// PROGRAMAÇÃO INTERATIVA
	.state('menu.programacao-interativa', {
		url: '/programacao-interativa',
		abstract: true,
		views: {
			'menuContent':{
				templateUrl: 'templates/programacao-interativa.html',
				controller: 'ProgramacaoCtrl'
			}
		}
	})

	.state('menu.programacao-interativa.dia', {
		url: '/dia/:dia',
		views: {
			'tabProgramacaoInterativa': {
				templateUrl: 'templates/programacao-interativa-dia.html',
				controller: 'ProgramacaoCtrl'
			}
		}
	})

	.state('menu.votacao', {
		url: '/votacao/atividade/:codigoAtividade',
		views: {
			'menuContent': {
				templateUrl: 'templates/votacao.html',
				controller: 'VotacaoCtrl'
			}
		}
	})

	// PARTICIPANTES
	.state('menu.participantes', {
		url: '/participantes',
		abstract: true,
		views: {
			'menuContent': {
				templateUrl: 'templates/participantes.html',
				controller: 'ParticipantesCtrl'
			}
		}
	})

	.state('menu.participantes.internacionais', {
		url: '/internacionais',
		views: {
			'tabParticipantes': {
				templateUrl: 'templates/participantes-internacionais.html',
				controller: 'ParticipantesCtrl'
			}
		}
	})

	.state('menu.participantes.nacionais', {
		url: '/nacionais',
		views: {
			'tabParticipantes': {
				templateUrl: 'templates/participantes-nacionais.html',
				controller: 'ParticipantesCtrl'
			}
		}
	})

	.state('menu.participante', {
		url: '/participante/:participanteId',
		views: {
			'menuContent': {
				templateUrl: 'templates/participante.html',
				controller: 'ParticipanteCtrl'
			}
		}
	})

	//EXPOSITORES
	.state('menu.expositores', {
		url: '/expositores',
		views: {
			'menuContent': {
				templateUrl: 'templates/expositores.html',
				controller: 'ExpositoresCtrl'
			}
		}
	})

	// MAPA EVENTO
	.state('menu.mapa-evento', {
		url: '/mapa-evento/:positionX/:positionY',
		views: {
			'menuContent': {
				templateUrl: 'templates/mapa-evento.html',
				controller: 'MapaEventoCtrl'
			}
		}
	})

	// INFORMAÇÔES
	.state('menu.informacoes', {
		url: '/informacoes',
		views: {
			'menuContent': {
				templateUrl: 'templates/informacoes.html',
				controller: 'InformacoesCtrl'
			}
		}
	})

	// PROGRAMAÇÃO SOCIAL
	.state('menu.programacao-social', {
		url: '/programacao-social',
		abstract: true,
		views: {
			'menuContent': {
				templateUrl: 'templates/programacao-social.html',
				controller: 'ProgramacaoSocialCtrl'
			}
		}
	})

	.state('menu.programacao-social.dia', {
		url: '/dia/:dia',
		views: {
			'tabProgramacaoSocial': {
				templateUrl: 'templates/programacao-social-dia.html',
				controller: 'ProgramacaoSocialCtrl'
			}
		}
	})

	.state('menu.atividade-social', {
		url: '/atividade-social/:atividadeId',
		views: {
			'menuContent': {
				templateUrl: 'templates/atividade-social.html',
				controller: 'AtividadeSocialCtrl'
			}
		}
	})

	// CONCIERGE
	.state('menu.concierge', {
		url: '/concierge',
		views: {
			'menuContent': {
				templateUrl: 'templates/concierge.html',
				controller: 'ConciergeCtrl'
			}
		}
	})

	.state('menu.estabelecimento', {
		url: '/estabelecimento/:estabelecimentoId',
		views: {
			'menuContent': {
				templateUrl: 'templates/estabelecimento.html',
				controller: 'EstabelecimentoCtrl'
			}
		}
	})

	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/menu/home');
});
