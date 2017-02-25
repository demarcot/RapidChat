angular.module('coreApp')
.controller('oldRoomCtrl', function ($scope, $state, ChatRoomService, UserService){

    $scope.setOldRoom = function(){
      localStorage.setItem("oldRoom", $state.params.chatRoomId);
    };


    //This should grab all current direct messages

  $scope.callApi = function() {
      UserService.GetAll().then(function(user){
        $scope.allUsers = user;
      });

      //This should grab all current chatrooms 

      ChatRoomService.GetAll().then(function(chatrooms){
        $scope.chatRooms = chatrooms;
        console.log(chatrooms);
      });
    };


      $scope.callApi();





});
