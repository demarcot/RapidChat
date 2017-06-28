(function () {
    angular.module('coreApp').controller('startUpCtrl', Controller);

    function Controller($scope, $window, UserService, ChatRoomService, FlashService) {
        var vm = this
        vm.initData = null;
        vm.allUsers = null;
        vm.username = null;
        vm.callApi = callApi;
        vm.initConnection = initConnection;
        vm.initNotifications = initNotifications;
        //testing desktop notifications
        function initNotifications(){
          if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
          }

          // Let's check whether notification permissions have already been granted
          else if (Notification.permission === "granted") {
            // If it's okay let's create a notification
            var notification = new Notification("Hi there!");
          }
          else if (Notification.permission !== "denied") {
           Notification.requestPermission(function (permission) {
             // If the user accepts, let's create a notification
             if (permission === "granted") {
               var notification = new Notification("Hi there!");
             }
           });
         }

        }
        initNotifications();

        // end testing desktop notifications
        function callApi() {

            vm.chatRooms = [];
            UserService.GetAll().then(function(user){
              vm.allUsers = user;
            });


          UserService.GetCurrent().then(function (user) {
            vm.username = {"username":user.username};
            });

          };
            callApi();
            if($scope.connection == null)
        		{
        			console.log("Creating new connection object...");
        			$scope.connection = new RTCMultiConnection();
        			$scope.autoCloseEntireSession = true;
        		}

        		//$scope.connection = new RTCMultiConnection();
        		//var connection = new RTCMultiConnection();

        		$scope.connectVideo = function (roomId)
        		{
        			//TODO(Tom): Replace 'your-room-id' with the current chatroomID and _Video
        			// Ex. myCoolChatroom#5134_Video
              $scope.showVideo = true;
        			$scope.connection.openOrJoin(roomId + '_video');
              console.log("RoomID = ", roomId + '_video');
              console.log($scope.connection);
        		}

        		$scope.leaveVideo = function()
        		{
        			console.log("Leaving video...");
        			//$scope.connection.leave();
              $scope.connection.attachStreams[0].stop();
        			$scope.connection.close();
              $scope.showVideo = false;
        			//$scope.connection.disconnect();
        		}

        		$scope.getPartyPeople = function()
        		{
        			console.log("Participants: ", $scope.connection.getAllParticipants());
        		}

        		$scope.connectionInfo = function()
        		{
        			console.log("Connection: ", $scope.connection);
        		}

        		function initConnection()
        		{
              console.log("init connection'");
        			// this line is VERY_important
        			//connection.socketURL = 'https://52.90.171.126:9443/';
        			$scope.connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/';

        			// if you want audio+video conferencing
        			$scope.connection.session =
        			{
        				audio: true,
        				video: true
        			};

        			$scope.connection.onstream = function (event)
        			{
        				$scope.isInitiator = $scope.connection.isInitiator;

        				if (event.type === 'local')
        				{
        					// initiator's own stream
        					//alert('you are initiator');
        					var loc = document.getElementById("main-video");
        					if (loc == null)
        					{
        						console.log("Unable to locate local video container...");
        						return;
        					}

        					if(document.getElementById(event.streamid)) return;

        					event.mediaElement.id = event.streamid;
        					loc.appendChild(event.mediaElement);
        				}

        				if (event.type === 'remote')
        				{
        					// initiator recieved stream from someone else
        					//alert('dear initiator, you just receive a remote stream');
        					var rem = document.getElementById("remote-video");
        					if (rem == null)
        					{
        						console.log("Unable to locate remote video container...");
        						return;
        					}

        					if(document.getElementById(event.streamid)) return;

        					event.mediaElement.id = event.streamid;
        					rem.appendChild(event.mediaElement);
        				}
        			};
        		}

        		initConnection();



      }

    })();
