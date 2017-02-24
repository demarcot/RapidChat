module.exports = function (io) {
  'use strict';
  io.sockets.on('connection', function (socket) {
	  //This is a logical room. Use for alerts...
	  socket.join("updateRoom");

    socket.on("currentRoom", function(username, chatRoom, oldRoom) {
      socket.leave(oldRoom);
      socket.join(chatRoom);
      io.sockets.to(chatRoom).emit("broadcast", {
        payload: "User connected " + username +" to " + chatRoom,
        source: "Server"
      });
      console.log("User:", username);
      console.log("Chat Room", chatRoom);
      console.log("Old Room", oldRoom)
    });

    socket.on("message", function(from, msg, chatRoom){
		//On message send, broadcast to all users that this chatroom has been updated. Frontend logic for who should update what.
		//TODO(Tom, Mike): send the hashed name of the chatroom for the clients to compare to so we don't leak private chatroom names 
		io.sockets.to("updateRoom").emit("broadcast", {payload:chatRoom});
      io.sockets.to(chatRoom).emit("broadcast", {
        payload: msg,
        source: from
      });
    });



   });

};



      // console.log('recieved messagee from', from, 'msg', JSON.stringify(msg));
      //
      // console.log('broadcasting message');
      // console.log('payload is', msg);

      // io.sockets.on('connection', function (socket) {
      //   socket.join('justin bieber fans');
      //   socket.broadcast.to('justin bieber fans').emit('new fan');
      //   io.sockets.in('rammstein fans').emit('new non-fan');
      // });
      // socket.join('testRoom1');
      // socket.broadcast.to('testRoom1').emit({
      //   room:'testRoom1'
      // });
      // io.sockets.emit('broadcast', {
      //   payload: msg,
      //   source: from
      // });
      // console.log('broadcast complete');


      // io.on('connection', function (socket) {
      //   socket.broadcast.emit('user connected');
      //
      //
      //   socket.on('message', function (from, msg, room) {
      //     //So what im thinking this needs to be is an if statement that
      //
      //     socket.broadcast.to(room.ChatroomName).emit({
      //       payload: msg,
      //       source: from
      //     })
      //
      //
      //
      //   });
      // });
