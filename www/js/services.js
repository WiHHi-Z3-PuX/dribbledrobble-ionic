angular.module('dribbledrobble.services', ['ngResource'])

  .constant("baseURL", "http://dribbledrobble.mybluemix.net/")

  .factory('localStorage', function ($window) {
    return {
      store: function (key, value) {
        $window.localStorage[key] = value;
      },
      get: function (key, defaultValue) {
        return $window.localStorage[key] || defaultValue;
      },
      remove: function (key) {
        $window.localStorage.removeItem(key);
      },
      storeObject: function (key, value) {
        $window.localStorage[key] = JSON.stringify(value);
      },
      getObject: function (key, defaultValue) {
        return JSON.parse($window.localStorage[key] || defaultValue);
      }
    };
  })

  .factory('AuthFactory', function ($resource, $http, localStorage, $rootScope, baseURL, $ionicPopup) {
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var authToken = undefined;

    function loadUserCredentials() {
      var credentials = localStorage.getObject(TOKEN_KEY, '{}');
      if (credentials.username !== undefined) {
        useCredentials(credentials);
      }
    }

    function storeUserCredentials(credentials) {
      localStorage.storeObject(TOKEN_KEY, credentials);
      useCredentials(credentials);
    }

    function useCredentials(credentials) {
      isAuthenticated = true;
      username = credentials.username;
      authToken = credentials.token;

      $http.defaults.headers.common['x-access-token'] = authToken;
    }

    function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      isAuthenticated = false;
      $http.defaults.headers.common['x-access-token'] = authToken;
      localStorage.remove(TOKEN_KEY);
    }

    authFac.login = function (loginData) {
      $resource(baseURL + "users/login")
        .save(loginData,
          function (response) {
            storeUserCredentials({username: loginData.username, token: response.token});
            $rootScope.$broadcast('login:Successful');
          },
          function (response) {
            isAuthenticated = false;

            var message = '<div><p>' +  response.data.err.message + '</p><p>' + response.data.err.name + '</p></div>';

            var alertPopup = $ionicPopup.alert({
              title: '<h4>Login Failed!</h4>',
              template: message
            });

            alertPopup.then(function(res) {
              console.log('Login Failed!');
            });
          }
        );
    };

    authFac.logout = function () {
      $resource(baseURL + "users/logout").get(function (response) {
        console.log(response);
      });
      destroyUserCredentials();
    };

    authFac.register = function (registerData) {
      $resource(baseURL + "users/register")
        .save(registerData,
          function (response) {
            authFac.login({username: registerData.username, password: registerData.password});

            localStorage.storeObject('userinfo', {username: registerData.username, password: registerData.password});

            $rootScope.$broadcast('registration:Successful');
          },
          function (response) {
            var message = '<div><p>' +  response.data.err.message + '</p><p>' + response.data.err.name + '</p></div>';

            var alertPopup = $ionicPopup.alert({
              title: '<h4>Registration Failed!</h4>',
              template: message
            });

            alertPopup.then(function(res) {
              console.log('Registration Failed!');
            });
          }
        );
    };

    authFac.isAuthenticated = function () {
      return isAuthenticated;
    };

    authFac.getUsername = function () {
      return username;
    };

    loadUserCredentials();

    return authFac;
  })

  .factory('homefactory', function ($resource, baseURL) {
    return $resource(baseURL + "wordDefs/random", null, {
      'query': {
        method: 'GET'
      }
    });
  })

  .factory('newFactory', function ($resource, baseURL) {
    return $resource(baseURL + "wordDefs/new", null, {
      'query': {
        method: 'GET',
        isArray: true
      }
    });
  })

  .factory('topFactory', function ($resource, baseURL) {
    return $resource(baseURL + "wordDefs/top", null, {
      'query': {
        method: 'GET',
        isArray: true
      }
    });
  })

  .factory('wordfactory', function ($resource, baseURL) {
    return $resource(baseURL + "words/one", null, {
      'save': {
        method: 'POST',
        isArray: true
      }
    });
  })

  .factory('tagsfactory', function ($resource, baseURL) {
    return $resource(baseURL + "tags", null, {
      'query': {
        method: 'GET',
        isArray: true
      }
    });
  })

  .factory('searchfactory', function ($resource, baseURL) {
    return $resource(baseURL + "words", null, {
      'query': {
        method: 'GET',
        isArray: true
      }
    });
  })

  .factory('randomfactory', function ($resource, baseURL) {
    return $resource(baseURL + "words/random", null, {
      'query': {
        method: 'GET',
        isArray: true
      }
    });
  })

  .factory('addnewfactory', function ($resource, baseURL) {
    return $resource(baseURL + "wordDefs", null, {
      'save': {
        method: 'post'
      }
    });
  })

  .factory('usernamesfactory', function ($resource, baseURL) {
    return $resource(baseURL + "users", null, {
      'query': {
        method: 'GET',
        isArray: true
      }
    });
  })

  .factory('upvotefactory', function ($resource, baseURL) {
    return $resource(baseURL + "wordDefs/:wordDefId/upvote", {wordDefId: '@id'}, {
      'update': {
        method: 'PUT'
      }
    });
  })

  .factory('downvotefactory', function ($resource, baseURL) {
    return $resource(baseURL + "wordDefs/:wordDefId/downvote", {wordDefId: '@id'}, {
      'update': {
        method: 'PUT'
      }
    });
  })

  .factory('tagdefsfactory', function ($resource, baseURL) {
    return $resource(baseURL + "tags/one", null, {
      'save': {
        method: 'POST',
        isArray: true
      }
    });
  })

;
