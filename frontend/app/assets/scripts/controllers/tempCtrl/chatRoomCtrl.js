(function () {
     'use strict';

     angular
         .module('coreApp')
         .controller('chatRoomCtrl', Controller);

     function Controller($window, UserService, ChatRoomService, FlashService, $state, $scope, $mdDialog) {
         var vm = this;
         vm.isPrivate = false;
         vm.newChatRoom = null;
         vm.chatRoomName = null;
         vm.publicChatRooms = null;
         vm.allowedChatRooms = null;
         vm.directChatrooms = null;
         vm.chatRooms = null;
         vm.newDirectMessage = null;
         vm.acceptedUsers = null;
         vm.pendingUsers = null;
         vm.restOfUsers = null;
         vm.init = init; //line 21~  Params: none
         vm.createChatroom = createChatroom; //line 62~ Params: ()
         vm.createDirectMessage = createDirectMessage; //line 91~ Params: ()
         vm.removeUser = removeUser; //line 113~ Params: ()
         vm.inviteUser = inviteUser; //line 128~ Params: ()
         vm.acceptInvite = acceptInvite; //line 144~ Params: ()
         vm.initRoom = initRoom; //line 157~ Params: ()
         vm.showCreate = showCreate;
         vm.closeCreate = closeCreate;

         var init = function() {

             vm.chatRooms = [];
             UserService.GetAll().then(function(user){
               vm.allUsers = user;
             });

             //This should grab all current chatrooms

             ChatRoomService.GetAll().then(function(chatrooms){
               vm.publicChatRooms = chatrooms;
               vm.chatRooms.push({"publicChatRooms":vm.publicChatRooms});

             });


           UserService.GetCurrent().then(function (user) {

             ChatRoomService.GetAllowedChatrooms({"username":user.username}).then(function(chatrooms){
               vm.allowedChatRooms = [];
               for (var i = 0; i < chatrooms.length; i++) {
                 var temp = chatrooms[i].acceptedUsers.indexOf(user.username);
                 chatrooms[i].acceptedUsers.splice(temp,1);

                 vm.allowedChatRooms.push(chatrooms[i]);

               }
               vm.chatRooms.push({"allowedChatRooms":vm.allowedChatRooms});


               });
             });

           };
           init();

          //  chatroom dialog function
          function showCreate(ev){
            $mdDialog.show({
              templateUrl:'/frontend/app/assets/templates/ChatroomDialogTemp.html',
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:true,
            })
            .then(function(answer){
              $scope.status = 'Modal closed';
            }, function(){
              $scope.status = 'Dialog cancelled';
            });
          };

          function closeCreate(ev){
            $mdDialog.hide({
              targetEvent: ev,
            });
          }


          function createChatroom(user) {
            console.log("User: ", user);
            if (vm.isPrivate === true) {
              vm.newChatRoom = {
                "name":vm.chatRoomName,
                "acceptedUsers": [user],
                "privateStatus": vm.isPrivate,
                "direct":false,
                "maxUsers": 0
              };

            }
            else {
              vm.newChatRoom = {
                "name":vm.chatRoomName,
                "acceptedUsers": [],
                "privateStatus": vm.isPrivate,
                "direct":false,
                "maxUsers": 0
              };

            }

            ChatRoomService.Create(vm.newChatRoom).then(function(chatroomId) {

              $state.go("chatRoomById", {chatRoomId: chatroomId},{reload:true});
            });
          };

          function createDirectMessage(invokingUser, invitedUser) {



            vm.newDirectMessage = {
              "name":invokingUser +"_"+invitedUser,
              "acceptedUsers": [invokingUser, invitedUser],
              "privateStatus": true,
              "direct":true,
              "maxUsers": 2
            };
            ChatRoomService.Create(vm.newDirectMessage).then(function(chatroomId) {
              $state.go("chatRoomById", {chatRoomId: chatroomId});
              //$scope.callApi();
              // NOTE: Update the invokingUser's UI by updating the init data somehow maybe like a factory to pass data or a $watch function


            });
          };

          var removeUser = function(chatroomId, username){
            var removed = true;
            var removeUserInfo = {
              '_id': chatroomId,
              'username': username
            };
            //console.log($scope.removeUserInfo);
            // call the invite user function
            ChatRoomService.removeFromAccepted(removeUserInfo).then(function(bool){
              // NOTE: Remove User from UI list

            });
            //call the invite socket.io function
          };

          var inviteUser = function(chatroomId, invitedUser, author, chatRoom){
            var inviteUserInfo = {
              '_id': chatroomId,
              'username': invitedUser
            };

            // call the invite user function
            ChatRoomService.inviteUser(inviteUserInfo).then(function(bool){
              //update the User list to put user on the pending list
            });

            //call the invite socket.io function
             chatSocket.emit('inviteUser', author, invitedUser, chatroomId, chatRoom);

          };

          var acceptInvite = function(username, _id)
          {
            //call the move user to accepted list re route to new chatroom
            var moveInfo = {'_id':_id, 'username': username};
            ChatRoomService.moveToAccepted(moveInfo).then(function(bool){
              console.log(bool);
            });
          };
          var initRoom = function(roomId)
        	{
        		//check pending users
        		//check accpeted users
        		var checkRoom = {'_id':roomId};
        		ChatRoomService.getUsers(checkRoom).then(function(roomInfo)
        		{
        			vm.acceptedUsers = roomInfo.acceptedUsers;
              //console.log($scope.acceptedUsers);
        			vm.pendingUsers = roomInfo.pendingUsers;
        			//console.log("pending",$scope.pendingUsers);
        			//console.log(roomInfo);

        			UserService.GetAll().then(function(users)
        			{
        				var tempUsrArr = users.slice();
        				for (user in users)
        				{
        					if(vm.acceptedUsers.includes(users[user].username) || vm.pendingUsers.includes(users[user].username))
        					{
        						tempUsrArr.splice(tempUsrArr.indexOf(users[user]), 1);
        					}
        				}
        				vm.restOfUsers = tempUsrArr;
        			});
        		});
        	};

          //EOF
       }
     })();
