(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('adminCtrl', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.users = null;
        //vm.deleteUser = deleteUser;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
            UserService.GetAll().then(function (users){
              vm.allUsers = users;
            });
        }
      }

    })();
