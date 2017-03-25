angular.module('coreApp')
.controller('SocketCtrl', function ($log, $scope, chatSocket, messageFormatter, nickName, UserService, $state, ChatRoomService) {


// NOTE: Estabish variables
  $scope.chatRoom = $state.params.chatRoomId;
  $scope.chatRoomId = {'_id': $state.params.chatRoomId }
  console.log($state)
  $scope.messageTest= [];
  $scope.nickName = nickName;
  $scope.messageLog = '';


// NOTE: Watching for user to hit enter and call send message
  $scope.myFunct = function(keyEvent) {

  if (keyEvent.which === 13)
    $scope.sendMessage();
  }



 // NOTE: Send message Function
  $scope.sendMessage = function() {
    var match = $scope.message.match('^\/nick (.*)');

    if (angular.isDefined(match) && angular.isArray(match) && match.length === 2) {
      var oldNick = nickName;
      nickName = match[1];
      $scope.message = '';
      $scope.messageLog = messageFormatter(new Date(), nickName, 'nickname changed - from ' + oldNick + ' to ' + nickName + '!') + $scope.messageLog;
      $scope.nickName = nickName;
    }

      // NOTE: This needs to be a catch for an empty message
      if ($scope.message=='') {
        console.log("Cannot send this");
      } else {
        $log.debug('sending message', $scope.message);

        chatSocket.emit('message', nickName, $scope.message, $scope.chatRoom, $scope.chatRoomName);

        $scope.encapMessge = {
          "_id":$scope.chatRoom,
          "username":nickName,
          "messageContent": $scope.message,
          "timestamp": new Date()
        };
        ChatRoomService.InsertMessage($scope.encapMessge).then(function(data) {
          console.log(data);
        });
        $scope.message = '';
      };
}



  $scope.$on('socket:broadcast', function(event, data) {
    $log.debug('got a message', event.name);
    if (!data.payload) {
      $log.error('invalid message', 'event', event, 'data', JSON.stringify(data));
      return;
    }
    $scope.$apply(function() {
      console.log("Data payload", data.payload);
      $scope.messageLog = $scope.messageLog + messageFormatter(new Date(), data.source, data.payload);
      $scope.messageTest.push({timestamp: new Date(), author: data.source, messageContent: data.payload});
    });
  });




  $scope.init = function() {

    UserService.GetCurrent().then(function (user) {
          $scope.username = user.username;
          nickName = $scope.username;
          $scope.oldRoom = localStorage.getItem("oldRoom");
          chatSocket.emit('currentRoom', $scope.username, $scope.chatRoom, $scope.oldRoom);
          ChatRoomService.getById($scope.chatRoomId).then(function(chatRoom){
            $scope.chatRoomName = chatRoom[0].name;
            console.log("Chat room thing", chatRoom)
              chatSocket.emit('currentRoom', $scope.username, $scope.chatRoom, $scope.oldRoom, $scope.chatRoomName);
          })

    });


    // NOTE: make case for empty room!
    ChatRoomService.GetMessages($scope.chatRoomId).then(function (messages) {
      console.log("messages ",messages[0].messages);


        if (messages[0].messages == null) {

          console.log("This is when the messages are empty");
        }
        else {
          for (var i = 0; i < messages[0].messages.length; i++) {
              $scope.messageTest.push(messages[0].messages[i]);

              console.log("added message");
          }
        }
    });


  };

   $scope.init();


});
