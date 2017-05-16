(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('initCtrl', Controller);

    function Controller($window, UserService, ChatRoomService, FlashService) {
        var vm = this
        vm.initData = null;
        vm.allUsers = null;
        vm.username = null;
        vm.callApi = callApi;
        var callApi = function() {

            vm.chatRooms = [];
            UserService.GetAll().then(function(user){
              vm.allUsers = user;
            });


          UserService.GetCurrent().then(function (user) {
            vm.username = {"username":user.username};
            });

          };


            vm.callApi();

      }

    })();
