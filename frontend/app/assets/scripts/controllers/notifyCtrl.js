angular.module('coreApp')
.controller('notifyCtrl', function ($scope, chatSocket, nickName, UserService, $state, ChatRoomService, $rootScope)
{
	$scope.selectedIndex;
	$scope.notifications = [];
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

	$scope.removeUser = function(chatroomId, username){
		$scope.removed = true;
    $scope.removeUserInfo = {
      '_id': chatroomId,
      'username': username
    };
		console.log($scope.removeUserInfo);
    // call the invite user function
    ChatRoomService.removeFromAccepted($scope.removeUserInfo).then(function(bool){
			$scope.initRoom($scope.removeUserInfo._id);

    });
    //call the invite socket.io function
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
