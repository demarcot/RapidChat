angular.module('coreApp')
.controller('chatRoomCtrl', function ($scope, $state, ChatRoomService){


  //test tom API REMOVEEE!!!!!
  $scope.chatRoomTest = {'name':''};

  $scope.createChatRoom = function() {
    ChatRoomService.Create($scope.chatRoomTest).then(function(chatRoom){
       console.log("Test :",chatRoom);
    });
    //console.log($scope.chatRoomTest.name);
  };

//api tom end remove right after done


    $scope.chatRooms = [{
      "chatRoomName":"testroom",
      "chatRoomId": "abc120",
      "chatRoomMembers":["Tom","Mike","Kyle"],
      "isPrivate":"false"
    },
    {
      "chatRoomName":"testroom1",
      "chatRoomId": "abc121",
      "chatRoomMembers":["Tom","Mike","Kyle"],
      "isPrivate":"false"
    },
    {
      "chatRoomName":"testroom2",
      "chatRoomId": "abc122",
      "chatRoomMembers":["Tom","Mike","Kyle"],
      "isPrivate":"false"
    }
  ];




});
