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


 $scope.removeUser = function(username, _id) {
   $scope.removeInfo = {'username':username, '_id': _id};
   ChatRoomService.removeFromAccepted($scope.removeInfo).then(function(bool){
     console.log(bool);
   });

 };


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

 $scope.removeUser = function(chatroomId, userId){
   $scope.removeUserInfo = {
     'chat_id': chatroomId,
     'user_id': userId
   };
   // call the invite user function

   //call the invite socket.io function
 };

});
