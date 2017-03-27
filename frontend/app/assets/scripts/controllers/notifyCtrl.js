angular.module('coreApp')
.controller('notifyCtrl', function ($scope, chatSocket, nickName, UserService, $state, ChatRoomService) {
  var noteButton = angular.element(document.querySelector('#note-footer'));
  noteButton.removeClass('navbar-default navbar-nav :hover');
  $scope.notifications = [];
  $scope.readNotifications = true;
  $scope.newNotifications = false;
  $scope.read = function(){
    if ($scope.readNotifications===true) {
      console.log("read is true");
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

  $scope.$on('socket:notify', function(event, data){
    console.log("notify room event");
    $scope.currentChatRoom = $state.params.chatRoomId;

    UserService.GetCurrent().then(function(user) {
      $scope.notifyInfo = {
        '_id':data._id,
        'username':  user.username
      };
      console.log("Notify Info = ", $scope.notifyInfo);
      ChatRoomService.notifyCheck($scope.notifyInfo).then(function(bool){
        console.log("This is Tom's return", bool);
        console.log(data);
        if(user.username != data.source && $scope.currentChatRoom != data._id && bool === true ){
          $scope.notifications.push(
            {
              'author': data.source,
              'chatroom': data.chatRoom,
              '_id':data._id
            }
          )
          console.log($scope.notifications);
        }
        else {
          console.log("User exists in still room");
        }
      });

    });

  });


});
