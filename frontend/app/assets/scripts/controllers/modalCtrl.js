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
.controller('modalCtrlInv', function ($scope, $state,$stateParams, ChatRoomService, UserService, $window){

// we could make a new controller to keep things separate

 $scope.inviteUser = function(chatroomId, userId){
   $scope.inviteUserInfo = {
     'chat_id': chatroomId,
     'user_id': userId
   };
   // call the invite user function

   //call the invite socket.io function
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
