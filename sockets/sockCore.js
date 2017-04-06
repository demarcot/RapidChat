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

    socket.on("message", function(from, msg, chatRoom, name){
      //On message send, broadcast to all users that this chatroom has been updated. Frontend logic for who should update what.
      //TODO(Tom, Mike): send the hashed name of the chatroom for the clients to compare to so we don't leak private chatroom names


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
