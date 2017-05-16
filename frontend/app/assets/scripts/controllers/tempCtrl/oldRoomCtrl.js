angular.module('coreApp')
.controller('oldRoomCtrl', function ($scope, $state,$stateParams, ChatRoomService, UserService, $window){
  // $scope.chatRooms = [];
  // $scope.test = function(){console.log("hello")};


    $scope.setOldRoom = function(){
      localStorage.setItem("oldRoom", $state.params.chatRoomId);
    };
    $scope.roomName = null;
    $scope.setRoomName = function(name, _id){
      $scope.roomName = name;
      $scope.roomId = _id;
    };
  });
