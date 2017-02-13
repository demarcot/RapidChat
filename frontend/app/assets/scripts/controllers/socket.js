angular.module('coreApp')
.controller('SocketCtrl', function ($log, $scope, chatSocket, messageFormatter, nickName, UserService, $state) {
  $scope.chatRoom = $state.params.chatRoomId;
  console.log($state)
  $scope.nickName = nickName;
  $scope.messageLog = '';
  $scope.messageTest = [];
  $scope.myFunct = function(keyEvent) {
  if (keyEvent.which === 13)
    $scope.sendMessage();
  }




  $scope.sendMessage = function() {
    var match = $scope.message.match('^\/nick (.*)');

    if (angular.isDefined(match) && angular.isArray(match) && match.length === 2) {
      var oldNick = nickName;
      nickName = match[1];
      $scope.message = '';
      $scope.messageLog = messageFormatter(new Date(), nickName, 'nickname changed - from ' + oldNick + ' to ' + nickName + '!') + $scope.messageLog;
      $scope.nickName = nickName;
    }

    $log.debug('sending message', $scope.message);
    chatSocket.emit('message', nickName, $scope.message, $scope.chatRoom);
    $scope.message = '';
  };

  $scope.$on('socket:broadcast', function(event, data) {
    $log.debug('got a message', event.name);
    if (!data.payload) {
      $log.error('invalid message', 'event', event, 'data', JSON.stringify(data));
      return;
    }
    $scope.$apply(function() {
      $scope.messageLog = $scope.messageLog + messageFormatter(new Date(), data.source, data.payload);
      $scope.messageTest.push({date: new Date(), name: data.source, message: data.payload});
    });
  });




  $scope.init = function() {

    UserService.GetCurrent().then(function (user) {
          $scope.username = user.username;
          $scope.oldRoom = localStorage.getItem("oldRoom");
          chatSocket.emit('currentRoom', $scope.username, $scope.chatRoom, $scope.oldRoom);
    });

  };

   $scope.init();


});
