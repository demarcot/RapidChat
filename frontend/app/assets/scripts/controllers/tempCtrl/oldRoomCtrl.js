angular.module('coreApp')
.controller('oldRoomCtrl', function ($scope, $state,$stateParams, ChatRoomService, UserService, $window, $location){


    $scope.initOldRoom = function(){
      if(!$scope.roomId){
        $scope.setRoomName(null,$location.$$url.split('/')[2]);
      }
    }
    $scope.setOldRoom = function(_id, name){
      localStorage.setItem("oldRoom", $state.params.chatRoomId);
        $scope.setRoomName(name,_id);
        console.log("new room stuff", {_id, name});
    };

    $scope.roomName = null;
    $scope.setRoomName = function(name, _id){
      $scope.roomName = name;
      $scope.roomId = _id;
    };
    $scope.initOldRoom();
  });
