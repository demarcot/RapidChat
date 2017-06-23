(function () {
    'use strict';

    angular
        .module('coreApp', ['ui.router', 'ngCookies', 'ngResource', 'ngSanitize', 'btford.socket-io', 'luegg.directives', 'ui.identicon', 'ngMaterial', 'material.svgAssetsCache'])
        .value('nickName', 'Nick_name')
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider, $mdIconProvider, $mdThemingProvider) {
        // default route
        $urlRouterProvider.otherwise("/dashboard");
        $mdThemingProvider.theme('default').dark();

        $mdIconProvider
      .iconSet("call", 'img/icons/sets/communication-icons.svg', 24)
      .iconSet("social", 'img/icons/sets/social-icons.svg', 24);

        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'assets/views/chatLayout.html',
                controller: 'chatLayoutCtrl',
                controllerAs: 'vm',
                data: { activeTab: 'dashboard' }
            })
            .state('personalize', {
                url: '/personalize',
                templateUrl: 'assets/views/personalize.html',
                controller: 'personalizeCtrl',
                controllerAs: 'vm',
                data: { activeTab: 'personalize' }
            })
            .state('video', {
                url: '/video',
                controller: 'videoCtrl',
                controllerAs: 'vm',
                templateUrl: 'assets/views/videoChat.html',
                data: { activeTab: 'video' }
            })
            .state('secretChat', {
                url: '/secretChat',
                templateUrl: 'assets/views/testChat.html',
                data: { activeTab: 'secretChat' }
              })
              .state('admin',{
                url:'/admin',
                templateUrl:'assets/views/admin.html',
                controller:'adminCtrl',
                controllerAs:'vm',
                data:{activeTab:'admin'}
              })
            .state('chatRoomById',{
              url: '/chatRoom/:chatRoomId',
              templateUrl:'assets/views/testChat.html',
              data:{activeTab: ':chatRoomId'}
            });
    }

    function run($http, $rootScope, $window, UserService, $state) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;


        // update active tab on state change
        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.activeTab = toState.data.activeTab;
            $rootScope.params = toParams;
        });

 $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams, fromState, fromStateParams) {
console.log(toState);
        var accessDenied = function(){
            event.preventDefault();

            //do whatever neccessary
            alert("UNAUTHORIZED_ACCESS");
            $state.go("dashboard");
            //
            //                                };
            //


    }
        if(toState.name ==='admin'){
                UserService.isAdmin().then(function(admin){
                        var adminCheck = admin.isAdmin;
                        if(adminCheck != true){
                        accessDenied();
			console.log("NOT AUTH");
                        }
                        else{
                        }
                })
        }

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
