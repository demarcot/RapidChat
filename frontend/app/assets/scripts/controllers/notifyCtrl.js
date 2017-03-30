angular.module('coreApp')
.controller('notifyCtrl', function ($scope, chatSocket, nickName, UserService, $state, ChatRoomService) {
  var noteButton = angular.element(document.querySelector('#note-footer'));
  noteButton.removeClass('navbar-default navbar-nav :hover');
  $scope.notifications = [];
  $scope.readNotifications = true;
  $scope.newNotifications = false;
  $scope.clearNotifications = function(){
    $scope.notifications = [];
  };
  $scope.read = function(){
    if ($scope.readNotifications===true) {

      $scope.readNotifications = false;
    } else {
      $scope.readNotifications = true;
    }
    if ($scope.notifications.length > 0) {
      $scope.newNotifications = true;
    } else {
      $scope.newNotifications = false;
    }
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

  $scope.$on('socket:inviteUser', function(event, data){
    $scope.invite = {
      'message': data.payload,
      'source': data.source,
      '_id': data._id
    };
    $scope.invites.push($scope.invite);

  });


});
