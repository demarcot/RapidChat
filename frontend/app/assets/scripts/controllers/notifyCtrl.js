angular.module('coreApp')
.controller('notifyCtrl', function ($scope, chatSocket, nickName, UserService, $state, ChatRoomService, $rootScope)
{
	$scope.selectedIndex;
	//$scope.notifications = [];
	//$scope.invites = [];
	$scope.readNotifications = true;
	$scope.newNotifications = false;
	$scope.newInvites = false;
	$scope.currentPrivateCheck = false;
	$scope.currentDirectCheck = false;
	$scope.clearNotifications = function()
	{
		$scope.notifications = [];
		$scope.newNotifications = false;
	};

	$scope.clearInvites = function()
	{
		$scope.invites = [];
		$scope.newInvites = false;
	};

	$scope.eraseInvite = function(index)
	{
        $scope.invites.splice(index, 1);
				if ($scope.invites.length == 0)
				{
        	$scope.newInvites = false;
    		}
  };
	$scope.eraseNotification = function(index)
	{
				$scope.notifications.splice(index, 1);
				if ($scope.notifications.length == 0)
				{
					$scope.newNotifications = false;
				}
	};

	$scope.removeUser = function(chatroomId, username){
		$scope.removed = true;
    $scope.removeUserInfo = {
      '_id': chatroomId,
      'username': username
    };
		console.log($scope.removeUserInfo);
    // call the invite user function
    ChatRoomService.removeFromAccepted($scope.removeUserInfo).then(function(bool){


    });
    //call the invite socket.io function
  };

	$scope.inviteUser = function(chatroomId, invitedUser, author, chatRoom){
    $scope.inviteUserInfo = {
      '_id': chatroomId,
      'username': invitedUser
    };

    // call the invite user function
    ChatRoomService.inviteUser($scope.inviteUserInfo).then(function(bool){
      console.log(bool);
    });

    //call the invite socket.io function
     chatSocket.emit('inviteUser', author, invitedUser, chatroomId, chatRoom);
		 //$scope.initRoom($scope.inviteUserInfo._id);
  };

	$scope.acceptInvite = function(username, _id)
	{
		//call the move user to accepted list re route to new chatroom
		$scope.moveInfo = {'_id':_id, 'username': username};
		ChatRoomService.moveToAccepted($scope.moveInfo).then(function(bool){
			console.log(bool);
		});
	};

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
						}
					)
				}
			});
		});
	});

	$scope.checkInvites = function()
	{
		// add invites to the invites array or make it empty
	}
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
  $scope.inviteCheck = function()
	{
		UserService.GetCurrent().then(function(user)
		{
			$scope.userInfo = user.username;

      ChatRoomService.checkPending({'username':$scope.userInfo}).then(function(chat){
        $scope.invites = [];
        if(chat != false){
          for(invite in chat){
          $scope.invites.push(
            {
              'message': "You have been invited to " + chat[invite].name,
              'source': chat[invite].name,
              '_id': chat[invite]._id,
            })
        }
        $scope.newInvites = true;
        }
        else {
          $scope.invites = [];
        }

      })
		});
	}

	$scope.inviteCheck();
	// we could make a new controller to keep things separate

	$scope.moveUser = function(index,type){


		switch (type) {
			case 'remove':
				$scope.acceptedUsers.splice(index,1)
				break;
			case 'add':
			var user = $scope.restOfUsers[index];
			$scope.restOfUsers.splice(index,1)
			$scope.pendingUsers.push(user.username);
				break;


		}

	}


	$scope.initRoom = function(roomId)
	{
		//check pending users
		//check accpeted users
		$scope.checkRoom = {'_id':roomId};
		ChatRoomService.getUsers($scope.checkRoom).then(function(roomInfo)
		{
			$scope.acceptedUsers = roomInfo.acceptedUsers;
      console.log($scope.acceptedUsers);
			$scope.pendingUsers = roomInfo.pendingUsers;
			console.log("pending",$scope.pendingUsers);
			console.log(roomInfo);

			UserService.GetAll().then(function(users)
			{
				var tempUsrArr = users.slice();
				for (user in users)
				{
					if($scope.acceptedUsers.includes(users[user].username) || $scope.pendingUsers.includes(users[user].username))
					{
						tempUsrArr.splice(tempUsrArr.indexOf(users[user]), 1);
					}
				}
				$scope.restOfUsers = tempUsrArr;
			});
		});
	};

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
});
