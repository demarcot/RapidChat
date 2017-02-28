angular.module('coreApp')
.controller('modalCtrl', function ($scope, $state,$stateParams, ChatRoomService, UserService){

  $scope.createChatroom = function() {
    $scope.newChatRoom = {
      "name":$scope.chatRoomName,
      "acceptedUsers": [],
      "privateStatus": false,
      "direct":true,
      "maxUsers": 0
    };


    ChatRoomService.Create($scope.newChatRoom).then(function(chatroomId) {

      $state.go("chatRoomById", {chatRoomId: chatroomId});
      console.log("Chat Room id", chatroomId);
      location.reload();
    });
  };

})
