angular.module('coreApp')
.controller('oldRoomCtrl', function ($scope, $state,$stateParams, ChatRoomService, UserService, $window){
  // $scope.chatRooms = [];
  // $scope.test = function(){console.log("hello")};
    $scope.adminCheck = false;

    $scope.setOldRoom = function(){
      localStorage.setItem("oldRoom", $state.params.chatRoomId);
    };
    $scope.roomName = null;
    $scope.setRoomName = function(name, _id){
      $scope.roomName = name;
      $scope.roomId = _id;
    };


    // $scope.isAdmin = function(){
    //
    // }

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
        $scope.callApi();


        //$window.location.reload();
      });
    };


    //This should grab all current direct messages

  $scope.callApi = function() {

      $scope.chatRooms = [];
      UserService.GetAll().then(function(user){
        $scope.allUsers = user;
      });

      //This should grab all current chatrooms

      ChatRoomService.GetAll().then(function(chatrooms){
        $scope.publicChatRooms = chatrooms;
        $scope.chatRooms.push({"publicChatRooms":$scope.publicChatRooms});

      });


    UserService.GetCurrent().then(function (user) {
      $scope.username = {"username":user.username};
      $scope.sideStyle = {"background-color": user.colors.sideBarColor};
      $scope.sideHover = user.colors.sideBarHover;
      $scope.topStyle = {"background-color": user.colors.topBarColor};
      $scope.topHover = user.colors.topBarHover;
      $scope.frameColor = user.colors.sideBarColor;



      ChatRoomService.GetAllowedChatrooms($scope.username).then(function(chatrooms){
        $scope.allowedChatRooms = [];
        for (var i = 0; i < chatrooms.length; i++) {
          var temp = chatrooms[i].acceptedUsers.indexOf($scope.username.username);
          chatrooms[i].acceptedUsers.splice(temp,1);

          $scope.allowedChatRooms.push(chatrooms[i]);

        }
        $scope.chatRooms.push({"allowedChatRooms":$scope.allowedChatRooms});


        });
      });

    };


      $scope.callApi();





});
