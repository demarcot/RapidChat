angular.module('coreApp')
.factory('chatSocket', function (socketFactory) {
      var socket = socketFactory();
      socket.forward('broadcast');
      socket.forward('notify');
      socket.forward('inviteUser');
      socket.forward('gify');
      return socket;
  });
