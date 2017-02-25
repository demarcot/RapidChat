(function () {
    'use strict';

    angular
        .module('coreApp', ['ui.router', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'luegg.directives', 'ngMaterial'])
        .value('nickName', 'Nick_name')
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider) {
        // default route
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('chatLayout', {
                url: '/',
                templateUrl: 'assets/views/chatLayout.html',
                controller: 'chatLayoutCtrl',
                controllerAs: 'vm',
                data: { activeTab: 'home' }
            })
            .state('personalize', {
                url: '/personalize',
                templateUrl: 'assets/views/personalize.html',
                controller: 'personalizeCtrl',
                controllerAs: 'vm',
                data: { activeTab: 'personalize' }
            })
            .state('secretChat', {
                url: '/secretChat',
                templateUrl: 'assets/views/testChat.html',
                data: { activeTab: 'secretChat' }
               })
            .state('chatRoomById',{
              url: '/chatRoom/:chatRoomId',
              templateUrl:'assets/views/testChat.html',
              data:{activeTab: ':chatRoomId'}
            });
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
        console.log($window.jwtToken);

        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
        });
    }

    // manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/frontend/app/token', function (token) {
            window.jwtToken = token;

            angular.bootstrap(document, ['coreApp']);
        });
    });
})();
