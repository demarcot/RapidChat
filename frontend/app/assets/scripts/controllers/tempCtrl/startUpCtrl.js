(function ()
{
	angular.module('coreApp').controller('startUpCtrl', Controller);

	function Controller($scope, $window, UserService, ChatRoomService, FlashService)
	{
		var vm = this
		vm.initData = null;
		vm.allUsers = null;
		vm.username = null;
		vm.callApi = callApi;
		vm.initConnection = initConnection;
		vm.initNotifications = initNotifications;

		var isVideo = false;
		var isVoice = false;
		var isData = false;
		$scope.isAdmin = function(){
				UserService.isAdmin().then(function(admin){
						$scope.adminCheck = admin.isAdmin;
				})
		};
		$scope.isAdmin();
		//testing desktop notifications
		function initNotifications()
		{
			if (!("Notification" in window))
			{
				alert("This browser does not support desktop notification");
			}

			// Let's check whether notification permissions have already been granted
			else if (Notification.permission === "granted")
			{
				// If it's okay let's create a notification
			}
			else if (Notification.permission !== "denied")
			{
				Notification.requestPermission(function (permission)
				{
					// If the user accepts, let's create a notification
					if (permission === "granted")
					{
						console.log("Notifications Granted");
					}
				}
				);
			}

		}
		initNotifications();

		// end testing desktop notifications
		function callApi()
		{

			vm.chatRooms = [];
			UserService.GetAll().then(function (user)
			{
				vm.allUsers = user;
			}
			);

			UserService.GetCurrent().then(function (user)
			{
				vm.username =
				{
					"username": user.username
				};
			}
			);

		};
		callApi();
		if ($scope.connection == null)
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
			$scope.connection.session =
			{
				audio: true,
				video: true
			};

			$scope.connection.sdpConstraints.mandatory = {
				OfferToReceiveAudio: true,
				OfferToReceiveVideo: true
			};
			$scope.connection.mediaConstraints = {
				audio: true,
				video: true
			};
			isVideo = true;
			isAudio = false;
			isData = false;
			$scope.showVideo = true;
			$scope.connection.openOrJoin(roomId + '_video');
			console.log("RoomID = ", roomId + '_video');
			console.log($scope.connection);
		}


		$scope.leaveVideo = function ()
		{
			isVideo = false;
			isAudio = false;
			isData = false;
			console.log("Leaving video...");
			//$scope.connection.leave();
			$scope.connection.attachStreams[0].stop();
			$scope.connection.close();
			$scope.showVideo = false;
			//$scope.connection.disconnect();
		}

		$scope.connectVoice = function (roomId)
		{
			//TODO(Tom): Replace 'your-room-id' with the current chatroomID and _Video
			// Ex. myCoolChatroom#5134_Video
			$scope.connection.session =
			{
				audio: true,
			};
			$scope.connection.sdpConstraints.mandatory = {
				OfferToReceiveAudio: true,
				OfferToReceiveVideo: false
			};
			$scope.connection.mediaConstraints = {
				audio: true,
				video: false
			};
			isVideo = false;
			isAudio = true;
			isData = false;
			$scope.showVideo = false;
			$scope.connection.openOrJoin(roomId + '_voice');
			console.log("RoomID = ", roomId + '_voice');
			console.log($scope.connection);
		}


		$scope.leaveVoice = function ()
		{
			isVideo = false;
			isAudio = false;
			isData = false;
			console.log("Leaving video...");
			//$scope.connection.leave();
			//$scope.connection.attachStreams[0].stop();
			$scope.connection.close();
			//$scope.connection.disconnect();
		}

		$scope.connectData = function(roomId)
		{

			//TODO(Tom): Replace 'your-room-id' with the current chatroomID and _Video
			// Ex. myCoolChatroom#5134_Video
			$scope.connection.session =
			{
				data: true,
			};
			$scope.connection.sdpConstraints.mandatory = {
				OfferToReceiveAudio: false,
				OfferToReceiveVideo: false
			};
			$scope.connection.mediaConstraints = {
				audio: false,
				video: false
			};
			isVideo = false;
			isAudio = false;
			isData = true;
			$scope.showVideo = false;
			$scope.connection.openOrJoin(roomId + '_data');
			//console.log("RoomID = ", roomId + '_data');
			//console.log($scope.connection);

			$scope.connection.enableFileSharing = true;
			$scope.connection.preferJSON = false;
			//TODO(Tom): Make a container for the files being sent/received.
			// Maybe have the container be in the file share md-dialog?
			$scope.connection.filesContainer = document.getElementById('remote-voice');
		}

		$scope.sendFile = function()
		{
			var file = document.getElementById('fileSubmission').files[0];
			$scope.connection.send(file);
		}

		$scope.getPartyPeople = function ()
		{
			console.log("Participants: ", $scope.connection.getAllParticipants());
		}

		$scope.connectionInfo = function ()
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
			/*
			$scope.connection.session =
			{
				audio: true,
				video: true
			};
			*/

			$scope.connection.onstream = function (event)
			{
				$scope.isInitiator = $scope.connection.isInitiator;

				if(isVideo == true)
				{

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

						if (document.getElementById(event.streamid))
							return;

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

						if (document.getElementById(event.streamid))
							return;

						event.mediaElement.id = event.streamid;
						rem.appendChild(event.mediaElement);
					}
				}
				else if(isAudio == true)
				{

					if (event.type === 'local')
					{
						// initiator's own stream
						//alert('you are initiator');
						/*
						var loc = document.getElementById("main-video");
						if (loc == null)
						{
							console.log("Unable to locate local video container...");
							return;
						}

						if (document.getElementById(event.streamid))
							return;

						event.mediaElement.id = event.streamid;
						loc.appendChild(event.mediaElement);
						*/
					}

					if (event.type === 'remote')
					{
						// initiator recieved stream from someone else
						//alert('dear initiator, you just receive a remote stream');
						var rem = document.getElementById("remote-voice");
						if (rem == null)
						{
							console.log("Unable to locate remote voice container...");
							return;
						}

						if (document.getElementById(event.streamid))
							return;

						event.mediaElement.id = event.streamid;
						rem.appendChild(event.mediaElement);
					}
				}
				else if(isData == true)
				{
					console.log("?????????????????????????");
					var rem = document.getElementById("remote-voice");
					if (rem == null)
					{
						console.log("Unable to locate file container...");
						return;
					}

					if (document.getElementById(event.streamid))
						return;

					event.mediaElement.id = event.streamid;
					rem.appendChild(event.mediaElement);
				}
				else
				{
					console.log("OH NOOOOOO! WE RUINED EVERYTHING GOOD AND HOLY!!!");
				}
			};
		}

		initConnection();

	}

}
)();
