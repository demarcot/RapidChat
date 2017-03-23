angular.module('coreApp')
.controller('oldRoomCtrl', function ($scope, $state,$stateParams, ChatRoomService, UserService, $window){
  $scope.chatRooms = [];

    $scope.setOldRoom = function(){
      localStorage.setItem("oldRoom", $state.params.chatRoomId);
    };
//    $scope.sideStyle = {"background-color":"#0000FF"};
//    $scope.topStyle = {"background-color":"#FF00FF"};
//    $scope.sideHover = {"background-color":"#0000BB"};
//    $scope.topHover = {"background-color":"#0000BB"};


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
        $window.location.reload();
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
      $scope.sideStyle = {"background-color": user.colors.sideBarColor};
      $scope.sideHover = user.colors.sideBarHover;
      $scope.topStyle = {"background-color": user.colors.topBarColor};
      $scope.topHover = user.colors.topBarHover;
      console.log($scope.sideHover);


      ChatRoomService.GetAllowedChatrooms($scope.username).then(function(chatrooms){
        $scope.allowedChatRooms = [];
        for (var i = 0; i < chatrooms.length; i++) {
          var temp = chatrooms[i].acceptedUsers.indexOf($scope.username.username);
          chatrooms[i].acceptedUsers.splice(temp,1);
          console.log(chatrooms[i].acceptedUsers);
          $scope.allowedChatRooms.push(chatrooms[i]);
          console.log($scope.allowedChatRooms);
        }
        $scope.chatRooms.push({"allowedChatRooms":$scope.allowedChatRooms});
        console.log("Accepted Chatrooms", $scope.chatRooms[1]);

        });
      });

    };


      $scope.callApi();





});
