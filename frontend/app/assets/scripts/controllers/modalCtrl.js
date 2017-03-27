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
