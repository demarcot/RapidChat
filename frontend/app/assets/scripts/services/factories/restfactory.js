coreApp.factory('restFactory',['$http', function($http){


//$http.get('/api/getMessages');

//we are going to need an identifyier for this api call in order to call the apropriate set of messages but for the display ths shoulkd be fine
function getMessages() {
    return $http.get('/api/getMsgs');
}
function getUsers(){
  return $http.get('/api/getUsers');
}

var factory = {
  getMessages : getMessages,
  getUsers: getUsers
};
return factory;

}]);
