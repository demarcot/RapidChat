module.exports = function (io) {
  'use strict';
  io.sockets.on('connection', function (socket) {
	  //This is a logical room. Use for alerts...
	  socket.join("updateRoom");


    socket.on("inviteUser", function(author, invitedUser, chatroomId, chatroom){
      io.sockets.to("updateRoom").emit("inviteUser", {

        payload: author +" Invited you to: " + chatroom,
        invitedUser: invitedUser,
        _id: chatroomId,
        source: "Server"
      });
    });

    socket.on("currentRoom", function(username, chatRoom, oldRoom, name) {
      socket.leave(oldRoom);
      socket.join(chatRoom);
        if (name != undefined) {
          io.sockets.to(chatRoom).emit("broadcast", {
            payload: "Connected " + username +" to " + name,
            source: "Server"
          });
        }
    });

    socket.on('gif', function(from, msg, chatRoom, name, url){
      console.log("url", url);

		  io.sockets.to("updateRoom").emit("notify", {
        _id:chatRoom,
        chatRoom: name,
        source: from
      });
      io.sockets.to(chatRoom).emit("gify", {
        payload: from + ": " + " Powered by Giphy!",
        source: "Giphybot",
        url: url
      });
    });

    socket.on("message", function(from, msg, chatRoom, name){

		  io.sockets.to("updateRoom").emit("notify", {
        _id:chatRoom,
        chatRoom: name,
        source: from
      });
      io.sockets.to(chatRoom).emit("broadcast", {
        payload: msg,
        source: from
      });
    });



    // NOTE: this is shit i dont want in the final verison

    // convenience function to log server messages on the client
  // function log() {
  //   var array = ['Message from server:'];
  //   array.push.apply(array, arguments);
  //   socket.emit('log', array);
  // }
  //
  // socket.on('messageRTC', function(message) {
  //   log('Client said: ', message);
  //   // for a real app, would be room-only (not broadcast)
  //   socket.broadcast.emit('messageRTC', message);
  // });
  //
  // socket.on('create or join', function(room) {
  //   log('Received request to create or join room ' + room);
  //
  //   var numClients = io.sockets.clients().length;
  //   console.log(numClients);
  //   log('Room ' + room + ' now has ' + numClients + ' client(s)');
  //
  //   if (numClients === 1) {
  //     socket.join(room);
  //     log('Client ID ' + socket.id + ' created room ' + room);
  //     socket.emit('created', room, socket.id);
  //
  //   } else {
  //     log('Client ID ' + socket.id + ' joined room ' + room);
  //     io.sockets.in(room).emit('join', room);
  //     socket.join(room);
  //     socket.emit('joined', room, socket.id);
  //     io.sockets.in(room).emit('ready');
  //   }
  //   //else { // max two clients
  //   //   socket.emit('full', room);
  //   // }
  // });
  //
  // socket.on('ipaddr', function() {
  //   var ifaces = os.networkInterfaces();
  //   console.log("IFACES: ", ifaces);
  //   for (var dev in ifaces) {
  //     ifaces[dev].forEach(function(details) {
  //       if ((details.family === 'IPv4' | details.family === "IPv6") && details.address !== '127.0.0.1') {
  //         socket.emit('ipaddr', details.address);
  //       }
  //     });
  //   }
  // });
  //
  // socket.on('bye', function(){
  //   console.log('received bye');
  // });



   });

};
