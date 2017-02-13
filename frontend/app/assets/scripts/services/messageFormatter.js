'use strict';

angular.module('coreApp')
  .value('messageFormatter', function(date, nick, message) {
    return date.toLocaleTimeString() + ' - ' +
           nick + ' - ' +
           message + '\n';

  });
