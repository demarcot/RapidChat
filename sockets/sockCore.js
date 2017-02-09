module.exports = function (io) {
  'use strict';
  io.on('connection', function (socket) {
    socket.broadcast.emit('user connected');
      var room[] = db.query(room);
      for(var i; i < room.length(); i++){
        socket.join(room.chatRoomName);
      }


    socket.on('message', function (from, msg, room) {
      //So what im thinking this needs to be is an if statement that

      socket.broadcast.to(room.ChatroomName).emit({
        payload: msg,
        source: from
      })


      
    });
  });
};



      // console.log('recieved message from', from, 'msg', JSON.stringify(msg));
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
