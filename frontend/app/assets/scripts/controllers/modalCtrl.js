angular.module('coreApp')
.controller('modalCtrl', function ($scope, $state,$stateParams, ChatRoomService, UserService, $window){

  $scope.createChatroom = function() {
    $scope.newChatRoom = {
      "name":$scope.chatRoomName,
      "acceptedUsers": [],
      "privateStatus": false,
      "direct":true,
      "maxUsers": 0
    };


    ChatRoomService.Create($scope.newChatRoom).then(function(chatroomId) {

      $state.go("chatRoomById", {chatRoomId: chatroomId},{reload:true});
  
      $window.location.reload();
    });
  };
  $scope.reloadPage = function(){
    location.reload();
  };

})
