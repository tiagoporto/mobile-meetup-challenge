angular.module('starter.services', [])

.factory('ProgramacaoCache', function($cacheFactory) {
	return $cacheFactory('ProgramacaoCache');
})

.factory('ParticipantesCache', function($cacheFactory) {
	return $cacheFactory('ParticipantesCache');
})

.factory('ExpositoresCache', function($cacheFactory) {
	return $cacheFactory('ExpositoresCache');
})

.factory('ProgramacaoSocialCache', function($cacheFactory) {
	return $cacheFactory('ProgramacaoSocialCache');
})

.factory('ConciergeCache', function($cacheFactory) {
	return $cacheFactory('ConciergeCache');
})

.factory('AlternativasVotacao', function() {
	var opcoes =[];

	return {
		get: function(opcao) {
			return opcoes[opcao];
		},

		set: function(opcao, id) {

			opcoes[opcao] = id;

		}
	};
});

