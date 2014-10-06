(function () {
  'use strict';
  angular.module('<%= name.toLowerCase() %>').controller('AppController', function($scope, $rootScope, $state) {
    $rootScope.activeTab = 0;

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState) {
      $state.previous = fromState;

      if (toState && toState.data && angular.isDefined(toState.data.activeTab)){
        $rootScope.activeTab = toState.data.activeTab;
      }
    });
  });
}());
