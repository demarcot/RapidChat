module.exports = function (io) {
  'use strict';
  io.sockets.on('connection', function (socket) {
	  //This is a logical room. Use for alerts...
	  socket.join("updateRoom");


    socket.on("inviteUser", function(author, invitedUser, chatroom, chatroomId){
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
        console.log("Name of room: ", name);
        if (name != undefined) {
          io.sockets.to(chatRoom).emit("broadcast", {

            payload: "Connected " + username +" to " + name,
            source: "Server"
          });
        }

      console.log("User:", username);
      console.log("Chat Room", chatRoom);
      console.log("Old Room", oldRoom)
    });

    socket.on("message", function(from, msg, chatRoom){
      //On message send, broadcast to all users that this chatroom has been updated. Frontend logic for who should update what.
      //TODO(Tom, Mike): send the hashed name of the chatroom for the clients to compare to so we don't leak private chatroom names
      // socket.on("notify", function(author, chatroom, chatroomId){
      //   io.sockets.to("updateRoom").emit("notify", {
      //
      //     payload: author +" sent a message to: " + chatroom,
      //     _id: chatroomId,
      //     source: "Server"
      //   });
      // });

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



   });

};
