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

  $scope.acceptInvite = function(){
    //call the move user to accepted list re route to new chatroom
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
