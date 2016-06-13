angular.module('dribbledrobble.directives', [])
  .directive('worddef', function () {
    return {
      templateUrl: '/templates/worddeftemplate.html',
      restrict: 'E'
    };
  })

  .directive('duplicate', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, element, attrs, ctrl) {
        ctrl.$parsers.unshift(function (viewValue) {
          // console.log(attrs.duplicate);
          var duplicate = scope[attrs.duplicate];
          // console.log(duplicate);
          if (duplicate.indexOf(viewValue) !== -1) {
            // console.log('exists!');
            ctrl.$setValidity('duplicate', false);
            return undefined;
          } else {
            ctrl.$setValidity('duplicate', true);
            return viewValue;
          }
        });
      }
    };
  });
