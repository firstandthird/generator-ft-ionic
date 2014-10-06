(function () {
  'use strict';

  angular.module('<%= name.toLowerCase() %>', ['ionic', 'ngSanitize'])<% if (plugins.indexOf('org.apache.cordova.statusbar') > -1) { %>
    .run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleLightContent();
        }
      });
    })
    <% } %>
    .config(function($stateProvider, $urlRouterProvider) {
      $stateProvider
        // setup an abstract state for the tabs directive
        .state('tab', {
          url: '/tab',
          abstract: true,
          controller: 'AppController',
          templateUrl: 'templates/tabs.html'
        })
        .state('tab.first', {
          url: '/first',
          views: {
            'main-area': {
              templateUrl: 'first-tab/index.html',
              controller: 'FirstTabController'
            }
          },
          data: {
            activeTab: 0
          }
        })
        .state('tab.second', {
          url: '/second',
          views: {
            'main-area': {
              templateUrl: 'second-tab/index.html',
              controller: 'SecondTabController'
            }
          },
          data: {
            activeTab: 1
          }
        })
        .state('tab.third', {
          url: '/third',
          views: {
            'main-area': {
              templateUrl: 'third-tab/index.html',
              controller: 'ThirdTabController'
            }
          },
          data: {
            activeTab: 2
          }
        });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/tab/incidents');
    });
}());
