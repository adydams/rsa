angular.module ('mainApp')
    .controller('signUpController',
        ['$scope','signupService',
        function($scope, signupService) {

            $scope.signUp = function () {
                signupService.signUp($scope.user)
                //for showing error message
                $scope.showMessage = function(input) {
                    var show = input.$invalid && (input.$dirty || input.$touched );
                    return show;
                }
            }
        },
        
])//directive to validate password
    .directive('validPasswordC', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                ctrl.$parsers.unshift(function (viewValue, $scope) {
                    var noMatch = viewValue != scope.signUpForm.password.$viewValue
                    ctrl.$setValidity('noMatch', !noMatch)
                })
            }
        }
    })
    //directive to compare password
    .directive("compareTo", function() {
        return {
          require: "ngModel",
          scope: {
            confirmPassword: "=compareTo"
          },
          link: function(scope, element, attributes, modelVal) {
  
            modelVal.$validators.compareTo = function(val) {
              return val == scope.confirmPassword;
            };
  
            scope.$watch("confirmPassword", function() {
              modelVal.$validate();
            });
          }
        };
      })
      .directive('restrictInput', function() {
        return {
          restrict: 'A',
          require: 'ngModel',
          link: function(scope, element, attr, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
              var options = scope.$eval(attr.restrictInput);
              if (!options.regex && options.type) {
                switch (options.type) {
                  case 'digitsOnly': options.regex = '^[0-9]*$'; break;
                  case 'lettersOnly': options.regex = '^[a-zA-Z\s]*$'; break;
                  case 'lowercaseLettersOnly': options.regex = '^[a-z]*$'; break;
                  case 'uppercaseLettersOnly': options.regex = '^[A-Z]*$'; break;
                  case 'lettersAndDigitsOnly': options.regex = '^[a-zA-Z0-9]*$'; break;
                  case 'validPhoneCharsOnly': options.regex = '^[0-9 ()/-]*$'; break;
                  default: options.regex = '';
                }
              }
              var reg = new RegExp(options.regex);
              if (reg.test(viewValue)) { //if valid view value, return it
                return viewValue;
              } else { //if not valid view value, use the model value (or empty string if that's also invalid)
                var overrideValue = (reg.test(ctrl.$modelValue) ? ctrl.$modelValue : '');
                element.val(overrideValue);
                return overrideValue;
              }
            });
          }
        };
      });