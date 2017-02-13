(function () {
    'use strict';
 
    angular
        .module('coreApp')
        .controller('chatLayoutCtrl', Controller);
 
    function Controller(UserService) {
        var vm = this;
 
        vm.user = null;
 
        initController();
 
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            });
        }
    }
 
})();