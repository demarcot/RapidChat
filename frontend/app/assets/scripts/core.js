var coreApp = angular.module('coreApp', []);

coreApp.controller('coreCtrl', ['$scope','restFactory', function($scope, restFactory){

  $scope.showMsgs = function() {
    restFactory.getMessages().success(function (data) {
    $scope.messages = data;
  });
  };
  $scope.showUsers = function(){
    restFactory.getUsers().success(function (data) {
    $scope.users = data;
  });
  }


}]);
