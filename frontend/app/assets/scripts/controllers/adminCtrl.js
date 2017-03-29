(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('adminCtrl', Controller);

    function Controller($window, UserService, ChatRoomService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.users = null;
        vm.deleteChatroom = deleteChatroom;
        vm.deleteUser = deleteUser;

        initController();

        function deleteUser(_id) {
             UserService.Delete(_id)
                 .then(function () {
                     // log user out

                     $window.location.reload();
                 })
                 .catch(function (error) {
                     FlashService.Error(error);
                 });
         }
        function deleteChatroom(_id) {
              ChatRoomService.Delete(_id)
                  .then(function () {
                      // log user out
                      $window.location.reload();
                  })
                  .catch(function (error) {
                      FlashService.Error(error);
                  });
          }

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
