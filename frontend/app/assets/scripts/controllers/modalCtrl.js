angular.module('coreApp')
.controller('modalCtrl', function ($scope, $state,$stateParams, ChatRoomService, UserService, $window){
 $scope.isPrivate = false;

  $scope.createChatroom = function(user) {
    if ($scope.isPrivate === true) {
      $scope.newChatRoom = {
        "name":$scope.chatRoomName,
        "acceptedUsers": [user],
        "privateStatus": $scope.isPrivate,
        "direct":false,
        "maxUsers": 0
      };

    }
    else {
      $scope.newChatRoom = {
        "name":$scope.chatRoomName,
        "acceptedUsers": [],
        "privateStatus": $scope.isPrivate,
        "direct":false,
        "maxUsers": 0
      };

    }


    ChatRoomService.Create($scope.newChatRoom).then(function(chatroomId) {

      $state.go("chatRoomById", {chatRoomId: chatroomId},{reload:true});

      $window.location.reload();
    });
  };

})


angular.module('coreApp')
.controller('modalCtrlInv', function ($scope, $state,$stateParams, chatSocket, ChatRoomService, UserService, $window){





 $scope.inviteUser = function(chatroomId, invitedUser, author, chatRoom){
   $scope.inviteUserInfo = {
     '_id': chatroomId,
     'username': invitedUser
   };

   // call the invite user function
   ChatRoomService.inviteUser($scope.inviteUserInfo).then(function(bool){
     console.log(bool);
   });

   //call the invite socket.io function
    chatSocket.emit('inviteUser', author, invitedUser, chatroomId, chatRoom);
 };


});
