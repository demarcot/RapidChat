angular.module('coreApp')
.controller('oldRoomCtrl', function ($scope, $state, ChatRoomService, UserService){

    $scope.setOldRoom = function(){
      localStorage.setItem("oldRoom", $state.params.chatRoomId);
    };

    $scope.chatRooms = [{
      "chatRoomName":"testroom",
      "chatRoomId": "abc120",
      "chatRoomMembers":["Tom","Mike","Kyle"],
      "isPrivate":"false"
    },
    {
      "chatRoomName":"testroom1",
      "chatRoomId": "abc121",
      "chatRoomMembers":["Tom","Mike","Kyle"],
      "isPrivate":"false"
    },
    {
      "chatRoomName":"testroom2",
      "chatRoomId": "abc122",
      "chatRoomMembers":["Tom","Mike","Kyle"],
      "isPrivate":"false"
    }
  ];

  $scope.callApi = function() {
      UserService.GetAll().then(function(user){
        $scope.allUsers = user;
      });
    };


      $scope.callApi();





});
