angular.module('coreApp')
.controller('oldRoomCtrl', function ($scope, $state){

    $scope.setOldRoom = function(){
      localStorage.setItem("oldRoom", $state.current.name);
    };



});
