angular.module('coreApp')
.controller('notifyCtrl', function ($scope, chatSocket, nickName, UserService, $state, ChatRoomService) {
  $scope.notifications = [];
  $scope.readNotifications = true;
  $scope.read = function(){
    if ($scope.readNotifications===true) {
      console.log("test");
      $scope.readNotifications = false;
    } else {
      $scope.readNotifications = true;
    }
  };

  $scope.$on('socket:notify', function(event, data){
    console.log("notify room event");
    $scope.currentChatRoom = $state.params.chatRoomId;

    UserService.GetCurrent().then(function(user) {
      $scope.notifyInfo = {
        '_id':$scope.currentChatRoom,
        'username':  user.username
      };
      ChatRoomService.notifyCheck($scope.notifyInfo).then(function(bool){
        console.log(bool);
        if(user.username != data.source && $scope.currentChatRoom != data._id && bool === true ){
          $scope.notifications.push(
            {
              'author': data.source,
              'chatroom': data.name,
              '_id':data.chatroom
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
