// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('dribbledrobble', ['ionic', 'dribbledrobble.controllers', 'dribbledrobble.services', 'dribbledrobble.directives', 'ngMessages', 'ngTagsInput'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/sidebar.html',
    controller: 'AppCtrl'
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('app.newDefs', {
    url: '/newDefs',
    views: {
      'menuContent': {
        templateUrl: 'templates/newDefs.html',
        controller: 'NewdefsCtrl'
      }
    }
  })

  .state('app.topRated', {
    url: '/topRated',
    views: {
      'menuContent': {
        templateUrl: 'templates/topRated.html',
        controller: 'TopratedCtrl'
      }
    }
  })

  .state('app.word', {
    url: '/word',
    views: {
      'menuContent': {
        templateUrl: 'templates/word.html',
        controller: 'WordCtrl'
      }
    },
    params: { random: null, word: null }
  })

  .state('app.tags', {
    url: '/tags',
    views: {
      'menuContent': {
        templateUrl: 'templates/tags.html',
        controller: 'TagsCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html',
        controller: 'SearchCtrl'
      }
    },
    params: { words: null }
  })

  .state('app.worddefs', {
    url: '/worddefs',
    views: {
      'menuContent': {
        templateUrl: 'templates/worddefs.html',
        controller: 'WorddefsCtrl'
      }
    },
    params: { tag: null }
  })





  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/home');
});
