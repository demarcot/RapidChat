(function() {
    'use strict';

    angular.module('coreApp')
    .directive('chatBox', function() {
        return {
            restrict: 'E',
            templateUrl: 'assets/scripts/directives/directiveTemps/chatBox.html',
            controller: function($scope, $element) {
              $scope.glued = true;


            }
        };
    });

}());
