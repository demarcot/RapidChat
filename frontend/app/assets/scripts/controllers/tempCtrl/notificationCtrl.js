
(function () {
    'use strict';

    angular
        .module('coreApp')
        .controller('notificationCtrl', Controller);

    function Controller($window, UserService, ChatRoomService, FlashService, chatSocket, $scope, $state) {
    	$scope.newNotifications = false;
    	$scope.newInvites = false;
    	$scope.currentPrivateCheck = false;
    	$scope.currentDirectCheck = false;
      var vm = this;
      vm.showInvites = showInvites;
      vm.clearNotifications = clearNotifications;
      vm.clearInvites = clearInvites;
      vm.eraseInvite = eraseInvite;
      vm.eraseNotification = eraseNotification;
      vm.inviteCheck = inviteCheck;

//    DELETE AFTER TESTING
      function showInvites()
      {
        // clearInvites();
      }


    	function clearNotifications()
    	{
    		$scope.notifications = [];
    		$scope.newNotifications = false;
    	}

    	function clearInvites()
    	{
        console.log("This is the invites array", $scope.invites);
    		$scope.invites = [];
    		$scope.newInvites = false;
    	}

    	function eraseInvite(index)
    	{
            $scope.invites.splice(index, 1);
    				if ($scope.invites.length == 0)
    				{
            	$scope.newInvites = false;
        		}
      }
    	function eraseNotification(index)
    	{
    				$scope.notifications.splice(index, 1);
    				if ($scope.notifications.length == 0)
    				{
    					$scope.newNotifications = false;
    				}
    	};

      function inviteCheck()
    	{
    		UserService.GetCurrent().then(function(user)
    		{
    			$scope.userInfo = user.username;

          ChatRoomService.checkPending({'username':$scope.userInfo}).then(function(chat){
            $scope.invites = [];
            if(chat != false){
              chat.forEach(function(invite){
                $scope.invites.push(
                  {
                    'message': "You have been invited to " + invite.name,
                    'source': invite.name,
                    '_id': invite._id,
                  })
              })
            //   for(invite in chat){
            //   $scope.invites.push(
            //     {
            //       'message': "You have been invited to " + chat[invite].name,
            //       'source': chat[invite].name,
            //       '_id': chat[invite]._id,
            //     })
            // }
            $scope.newInvites = true;
            }
            else {
              $scope.invites = [];
            }

          })
    		});
    	}
      inviteCheck();

      $scope.$watch(function () {
          return $state.params.chatRoomId;
      }, function (newParams, oldParams) {
        if ($state.params.chatRoomId != undefined) {
          $scope.currentChatRoomId = {'_id': $state.params.chatRoomId};
          ChatRoomService.getById($scope.currentChatRoomId).then(function(room){
            $scope.currentChatRoomName = room[0].name;
            $scope.currentPrivateCheck = room[0].private;
            $scope.currentDirectCheck = room[0].direct;
          })
        }
        else {
          $scope.currentChatRoomName = null;
          $scope.currentPrivateCheck = false;
          $scope.currentDirectCheck = false;
        }
      });

      $scope.$on('socket:inviteUser', function(event, data)
      {
        //check if user is in pending
        if (data.invitedUser === $scope.userInfo)
        {
          $scope.newInvites = true;
          $scope.invites.push(
          {
            'message': data.payload,
            'source': data.source,
            '_id': data._id
          });
        }
      });
      $scope.$on('socket:notify', function(event, data)
    	{
    		$scope.currentChatRoom = $state.params.chatRoomId;

    		UserService.GetCurrent().then(function(user)
    		{
    			$scope.notifyInfo =
    			{
    				'_id':data._id,
    				'username':  user.username
    			};

    			ChatRoomService.notifyCheck($scope.notifyInfo).then(function(bool)
    			{
    				if(user.username != data.source && $scope.currentChatRoom != data._id && bool === true )
    				{
    					$scope.newNotifications = true;
    					$scope.notifications.push(
    						{
    						  'author': data.source,
    						  'chatroom': data.chatRoom,
    						  '_id':data._id
    						})
                if (Notification.permission === "granted")
          			{
          				// If it's okay let's create a notification
          				var notification = new Notification({
      						  'author': data.source,
      						  'chatroom': data.chatRoom,
      						  '_id':data._id
      						});
          			}
    				}
    			});
    		});
    	});
      //EOF
    }


  })();
