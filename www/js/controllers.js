angular.module('dribbledrobble.controllers', [])

  .controller('AppCtrl', function($scope, $ionicModal, $timeout, localStorage, AuthFactory, $rootScope, usernamesfactory, searchfactory, addnewfactory, tagsfactory, $q, $filter) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    $scope.loginData = localStorage.getObject('username', '{}');
    $scope.registration = {};
    $scope.loggedIn = false;

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.modal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeLogin = function() {
      $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function() {
      // console.log('Doing login', $scope.loginData);
      localStorage.storeObject('userinfo',$scope.loginData);

      AuthFactory.login($scope.loginData);

      $scope.closeLogin();
    };

    $scope.logOut = function() {
      AuthFactory.logout();
      $scope.loggedIn = false;
      $scope.username = '';
    };

    $rootScope.$on('login:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.username = AuthFactory.getUsername();
    });

    $scope.usernames = [];

    usernamesfactory.query(function (res) {
      $scope.usernames = res.map(function (userObj) {
        return userObj.username;
      });
      // console.log($scope.usernames);
    }, function (err) {
      console.log(err);
    });

    // Create the registration modal that we will use later
    $ionicModal.fromTemplateUrl('templates/register.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.registerform = modal;
    });

    // Triggered in the registration modal to close it
    $scope.closeRegister = function () {
      $scope.registerform.hide();
    };

    // Open the registration modal
    $scope.register = function () {
      $scope.registerform.show();
    };

    // Perform the registration action when the user submits the login form
    $scope.doRegister = function () {
      console.log('Doing registration', $scope.registration);
      $scope.loginData.username = $scope.registration.username;
      $scope.loginData.password = $scope.registration.password;

      AuthFactory.register($scope.registration);

      $scope.closeRegister();
    };

    $rootScope.$on('registration:Successful', function () {
      $scope.loggedIn = AuthFactory.isAuthenticated();
      $scope.username = AuthFactory.getUsername();
      localStorage.storeObject('userinfo',$scope.loginData);
    });

    $scope.words = null;

    searchfactory.query(function (res) {
      // $scope.words = res.map(function (wordObj) {
      //   return wordObj.word;
      // });
      $scope.words = res;
      // console.log($scope.words);
    }, function (err) {
      console.log(err);
    });

    $scope.new = {};
    $scope.newTags = null;

    $scope.allTags = [];

    tagsfactory.query(
      function (res) {
        $scope.allTags = res.map(function (tag) {
          return {'text': tag.tag};
        });
        // console.log(allTags);
      },
      function (err) {
        console.log(err);
      }
    );

    $scope.loadTagsAutocomplete = function (query) {
      var deferred = $q.defer();
      deferred.resolve( $filter('filter')($scope.allTags, query));
      // deferred.resolve($scope.allTags);
      return deferred.promise;
    };

    $ionicModal.fromTemplateUrl('templates/addNew.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.addnewform = modal;
    });

    $scope.closeAddNew = function () {
      $scope.addnewform.hide();
    };

    $scope.addNew = function () {
      $scope.addnewform.show();
    };

    $scope.doAddNew = function () {
      // console.log($scope.newTags);

      var tagsFlat = $scope.newTags.map(function (tag) {
        return tag.text;
      });

      $scope.new.tags = tagsFlat;

      console.log($scope.new);

      addnewfactory.save($scope.new,
        function (res) {
          console.log(res);
        },
        function (err) {
          console.log(err);
        }
      );

      $scope.closeAddNew();
    };
  })

  .controller('HomeCtrl', function ($scope, homefactory) {
    $scope.slogan = 'you won\'t find this in a dictionary';

    $scope.randomWord = null;

    homefactory.query(
      function (res) {
        $scope.randomWord = res;
        // console.log($scope.randomWord);
      },
      function (err) {
        console.log(err);
      }
    );
  })

  .controller('NewdefsCtrl', function ($scope, newFactory, upvotefactory, downvotefactory, AuthFactory, $ionicPopup) {
    $scope.newDefs = [];

    newFactory.query(
      function (res) {
        $scope.newDefs = res;
        // console.log($scope.newDefs);
      },
      function (err) {
        console.log(err);
      }
    );

    $scope.loggedIn = false;

    if (AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
    }

    $scope.showVotePopup = function () {
      var votePopup = $ionicPopup.confirm({
        title: '<h3>Vote failed</h3>',
        template: '<p>You can only vote once</p>'
      });

      votePopup.then(function (res) {
        console.log(res);
      });
    };

    $scope.upvote = function (id, index) {
      // console.log(id);
      upvotefactory.update({wordDefId: id}, {}, function (res) {
        // console.log(res);
        if (res._id === id) {
          $scope.newDefs[index].rating += 1;
        } else {
          $scope.showVotePopup
        }
      }, function (err) {
        console.log(err);
      });
    };

    $scope.downvote = function (id, index) {
      // console.log(id);
      downvotefactory.update({wordDefId: id}, {}, function (res) {
        // console.log(res);
        if (res._id === id) {
          $scope.newDefs[index].rating -= 1;
        } else {
          $scope.showVotePopup
        }
      }, function (err) {
        console.log(err);
      });
    };
  })

  .controller('TopratedCtrl', function ($scope, topFactory, upvotefactory, downvotefactory, AuthFactory, $ionicPopup) {
    $scope.topRated = [];

    topFactory.query(
      function (res) {
        $scope.topRated = res;
        // console.log($scope.topRated);
      },
      function (err) {
        console.log(err);
      }
    );

    $scope.loggedIn = false;

    if (AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
    }

    $scope.showVotePopup = function () {
      var votePopup = $ionicPopup.confirm({
        title: '<h3>Vote failed</h3>',
        template: '<p>You can only vote once</p>'
      });

      votePopup.then(function (res) {
        console.log(res);
      });
    };

    $scope.upvote = function (id, index) {
      // console.log(id);
      upvotefactory.update({wordDefId: id}, {}, function (res) {
        // console.log(res);
        if (res._id === id) {
          $scope.topRated[index].rating += 1;
        } else {
          $scope.showVotePopup
        }
      }, function (err) {
        console.log(err);
      });
    };

    $scope.downvote = function (id, index) {
      // console.log(id);
      downvotefactory.update({wordDefId: id}, {}, function (res) {
        // console.log(res);
        if (res._id === id) {
          $scope.topRated[index].rating -= 1;
        } else {
          $scope.showVotePopup
        }
      }, function (err) {
        console.log(err);
      });
    };
  })

  .controller('WordCtrl', function ($scope, $stateParams, randomfactory, wordfactory, upvotefactory, downvotefactory, AuthFactory, $ionicPopup) {
    $scope.defs = null;

    if ($stateParams.random) {
      randomfactory.query(
        function (res) {
          $scope.defs = res;
          // console.log($scope.defs);
        },
        function (err) {
          console.log(err);
        }
      );
    }

    if ($stateParams.word) {
      wordfactory.save({word: $stateParams.word}, function (res) {
        $scope.defs = res;
        // console.log($scope.defs);
      }, function (err) {
        console.log(err);
      });
    }

    $scope.loggedIn = false;

    if (AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
    }

    $scope.showVotePopup = function () {
      var votePopup = $ionicPopup.confirm({
        title: '<h3>Vote failed</h3>',
        template: '<p>You can only vote once</p>'
      });

      votePopup.then(function (res) {
        console.log(res);
      });
    };

    $scope.upvote = function (id, index) {
      // console.log(id);
      upvotefactory.update({wordDefId: id}, {}, function (res) {
        // console.log(res);
        if (res._id === id) {
          $scope.defs[index].rating += 1;
        } else {
          $scope.showVotePopup
        }
      }, function (err) {
        console.log(err);
      });
    };

    $scope.downvote = function (id, index) {
      // console.log(id);
      downvotefactory.update({wordDefId: id}, {}, function (res) {
        // console.log(res);
        if (res._id === id) {
          $scope.defs[index].rating -= 1;
        } else {
          $scope.showVotePopup
        }
      }, function (err) {
        console.log(err);
      });
    };
  })

  .controller('TagsCtrl', function ($scope, tagsfactory) {
    $scope.tags = [];

    tagsfactory.query(
      function (res) {
        $scope.tags = res;
        // console.log($scope.tags);
      },
      function (err) {
        console.log(err);
      }
    );
  })

  .controller('SearchCtrl', function ($scope, $stateParams) {
    $scope.queryString = '';
    $scope.sorting = 'word';

    $scope.words = [];

    if ($stateParams.words) {
      $scope.words = $stateParams.words;
    }
  })

  .controller('WorddefsCtrl', function ($scope, tagdefsfactory, $stateParams, upvotefactory, downvotefactory, AuthFactory, $ionicPopup) {
    $scope.defs = null;

    if ($stateParams.tag) {
      tagdefsfactory.save({tag: $stateParams.tag}, function (res) {
        $scope.defs = res;
        // console.log($scope.defs);
      }, function (err) {
        console.log(err);
      });
    }

    $scope.loggedIn = false;

    if (AuthFactory.isAuthenticated()) {
      $scope.loggedIn = true;
    }

    $scope.showVotePopup = function () {
      var votePopup = $ionicPopup.confirm({
        title: '<h3>Vote failed</h3>',
        template: '<p>You can only vote once</p>'
      });

      votePopup.then(function (res) {
        console.log(res);
      });
    };

    $scope.upvote = function (id, index) {
      // console.log(id);
      upvotefactory.update({wordDefId: id}, {}, function (res) {
        // console.log(res);
        if (res._id === id) {
          $scope.defs[index].rating += 1;
        } else {
          $scope.showVotePopup();
        }
      }, function (err) {
        console.log(err);
      });
    };

    $scope.downvote = function (id, index) {
      // console.log(id);
      downvotefactory.update({wordDefId: id}, {}, function (res) {
        // console.log(res);
        if (res._id === id) {
          $scope.defs[index].rating -= 1;
        } else {
          $scope.showVotePopup
        }
      }, function (err) {
        console.log(err);
      });
    };
  })
;
