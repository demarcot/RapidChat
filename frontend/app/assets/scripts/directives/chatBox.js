(function() {
    'use strict';

    angular.module('coreApp')
    .directive('chatBox', function() {
        return {
            restrict: 'E',
            templateUrl: 'assets/scripts/directives/directiveTemps/chatBox.html',
            controller: function($scope, $element, $timeout) {
              $scope.glued;
              // var objDiv = document.getElementById("testScroll");
              // objDiv.scrollTop = objDiv.scrollHeight;

              // var identicon = new Identicon('d3b07384d113edec49eaa6238ad5ff00', 420).toString();
              // $scope.identicon = identicon;
              // console.log($scope.identicon);
            }
        };
    });

}());
