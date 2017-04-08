angular.module('coreApp')
.controller('SocketCtrl', function ($log, $scope, chatSocket, messageFormatter, nickName, UserService, $state, ChatRoomService) {


// NOTE: Estabish variables
  $scope.chatRoom = $state.params.chatRoomId;
  $scope.chatRoomId = {'_id': $state.params.chatRoomId }

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
    var gif =  $scope.message.match('^\/gif (.*)');

    if (angular.isDefined(match) && angular.isArray(match) && match.length === 2) {
      var oldNick = nickName;
      nickName = match[1];
      $scope.message = '';
      $scope.messageLog = messageFormatter(new Date(), nickName, 'nickname changed - from ' + oldNick + ' to ' + nickName + '!') + $scope.messageLog;
      $scope.nickName = nickName;
    }


      // NOTE: This needs to be a catch for an empty message
      if ($scope.message=='') {

      }
      else if (angular.isDefined(gif) && angular.isArray(gif) && gif.length === 2) {
        console.log("Gif message", $scope.message);
        var search = gif[1].replace(/\s/g, '+');

        console.log(search);


        ChatRoomService.gifyUrl(search).then(function(gifyResponse){

          $scope.gifyUrl = gifyResponse.data.image_original_url;
          console.log($scope.gifyUrl);
          chatSocket.emit('gif', nickName, $scope.message, $scope.chatRoom, $scope.chatRoomName, $scope.gifyUrl);
          $scope.encapMessge = {
              "_id":$scope.chatRoom,
              "username":nickName,
              "messageContent": $scope.gifyUrl,
              "timestamp": new Date()
            };
          ChatRoomService.InsertMessage($scope.encapMessge).then(function(data) {

          });
          $scope.message = '';

        });
      }
      else {
        $log.debug('sending message', $scope.message);

        chatSocket.emit('message', nickName, $scope.message, $scope.chatRoom, $scope.chatRoomName);

        $scope.encapMessge = {
          "_id":$scope.chatRoom,
          "username":nickName,
          "messageContent": $scope.message,
          "timestamp": new Date()
        };
        ChatRoomService.InsertMessage($scope.encapMessge).then(function(data) {

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

      $scope.messageLog = $scope.messageLog + messageFormatter(new Date(), data.source, data.payload);
      $scope.messageTest.push({'data':{timestamp: new Date(), author: data.source, messageContent: data.payload, url:data.url, gif: false}, 'isLink':true});
    });
  });

  $scope.$on('socket:gify', function(event, data) {
    $log.debug('got a message', event.name);
    if (!data.payload) {
      $log.error('invalid message', 'event', event, 'data', JSON.stringify(data));
      return;
    }
    $scope.$apply(function() {

      $scope.messageTest.push({'data':{timestamp: new Date(), author: data.source, messageContent: data.payload, url:data.url, gif:true}, 'isLink':true});
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



        if (messages[0].messages == null) {


        }
        else {
          for (var i = 0; i < messages[0].messages.length; i++) {
            if(messages[0].messages[i].messageContent.includes('http://')){
              console.log("this is true");
              $scope.messageTest.push({'data':messages[0].messages[i], 'isLink':true});
            }
            else {
              $scope.messageTest.push({'data':messages[0].messages[i], 'isLink':false});
            }



          }
          console.log("Message array", $scope.messageTest);
        }
    });


  };

   $scope.init();


});
