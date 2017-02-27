angular.module('coreApp')
.controller('oldRoomCtrl', function ($scope, $state,$stateParams, ChatRoomService, UserService){
  $scope.chatRooms = [];

    $scope.setOldRoom = function(){
      localStorage.setItem("oldRoom", $state.params.chatRoomId);
    };

  

    //THis creates a Direct Message
    $scope.createDirectMessage = function(invokingUser, invitedUser){



      $scope.newDirectMessage = {
        "name":invokingUser +"_"+invitedUser,
        "acceptedUsers": [invokingUser, invitedUser],
        "privateStatus": true,
        "direct":true,
        "maxUsers": 2
      };
      ChatRoomService.Create($scope.newDirectMessage).then(function(chatroomId) {

        $state.go("chatRoomById", {chatRoomId: chatroomId});
        console.log("Chat Room id", chatroomId);
      });
    };


    //This should grab all current direct messages

  $scope.callApi = function() {
      UserService.GetAll().then(function(user){
        $scope.allUsers = user;
      });

      //This should grab all current chatrooms

      ChatRoomService.GetAll().then(function(chatrooms){
        $scope.publicChatRooms = chatrooms;
        $scope.chatRooms.push({"publicChatRooms":$scope.publicChatRooms});
        console.log("Public Chatrooms", $scope.chatRooms[0]);
      });
    UserService.GetCurrent().then(function (user) {
      $scope.username = {"username":user.username};

      ChatRoomService.GetAllowedChatrooms($scope.username).then(function(chatrooms){
        $scope.allowedChatRooms = chatrooms;
        $scope.chatRooms.push({"allowedChatRooms":$scope.allowedChatRooms});
        console.log("Accepted Chatrooms", $scope.chatRooms[1]);

        });
      });

    };


      $scope.callApi();





});
