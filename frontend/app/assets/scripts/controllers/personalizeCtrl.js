(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('personalizeCtrl', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.user = null;
        vm.saveUser = saveUser;
        //vm.deleteUser = deleteUser;

        initController();

        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }

        function saveUser() {
            UserService.Update(vm.user)
                .then(function () {
                    location.reload();
                    FlashService.Success('User updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

//         function deleteUser() {
//             UserService.Delete(vm.user._id)
//                 .then(function () {
//                     // log user out
//                     $window.location = '/login';
//                 })
//                 .catch(function (error) {
//                     FlashService.Error(error);
//                 });
//         }
    }

})();
