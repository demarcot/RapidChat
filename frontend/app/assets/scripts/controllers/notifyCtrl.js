angular.module('coreApp')
.controller('notifyCtrl', function ($scope, chatSocket, nickName, UserService, $state, ChatRoomService) {
  var noteButton = angular.element(document.querySelector('#note-footer'));
  noteButton.removeClass('navbar-default navbar-nav :hover');
  $scope.notifications = [];
  $scope.invites = [];
  $scope.readNotifications = true;
  $scope.newNotifications = false;
  $scope.newInvites = false;
  $scope.clearNotifications = function(){
    $scope.notifications = [];
    $scope.newNotifications = false;
  };

  $scope.acceptInvite = function(username, _id){
    //call the move user to accepted list re route to new chatroom
    $scope.moveInfo = {'_id':_id, 'username': username};
    ChatRoomService.moveToAccepted($scope.moveInfo).then(function(bool){

    });
  };

  $scope.$on('socket:notify', function(event, data){

    $scope.currentChatRoom = $state.params.chatRoomId;


    UserService.GetCurrent().then(function(user) {
      $scope.notifyInfo = {
        '_id':data._id,
        'username':  user.username
      };

      ChatRoomService.notifyCheck($scope.notifyInfo).then(function(bool){


        if(user.username != data.source && $scope.currentChatRoom != data._id && bool === true ){
          $scope.newNotifications = true;
          $scope.notifications.push(
            {
              'author': data.source,
              'chatroom': data.chatRoom,
              '_id':data._id
            }
          )

        }

      });

    });

  });
  $scope.checkInvites = function(){
    // add invites to the invites array or make it empty
  }
  $scope.inviteCheck = function(){
    UserService.GetCurrent().then(function(user) {
      $scope.userInfo = user.username;
  });
}
  $scope.inviteCheck();
  // we could make a new controller to keep things separate
  $scope.initRoom = function(roomId){
    //check pending users
    //check accpeted users
    $scope.checkRoom = {'_id':roomId};

    ChatRoomService.getUsers($scope.checkRoom).then(function(roomInfo){

      $scope.acceptedUsers = roomInfo.acceptedUsers;
      $scope.pendingUsers = roomInfo.pendingUsers;
      UserService.GetAll().then(function(users){

        for (var i = 0; i < users.length; i++) {
            if(users[i].username === $scope.acceptedUsers[0] || users[i].username === $scope.pendingUsers ){
              users.splice(i, 1);
            }
        }
        $scope.restOfUsers = users;


      });
    });

    // list rest of users
  };

  $scope.$on('socket:inviteUser', function(event, data){
    //check if user is in pending
    if (data.invitedUser === $scope.userInfo) {
      $scope.newInvites = true;
      $scope.invites.push({
        'message': data.payload,
        'source': data.source,
        '_id': data._id
      });
    }


  });


});
