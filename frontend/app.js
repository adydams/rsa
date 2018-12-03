var mainApps = angular.module("mainApp", [
  'ngMaterial',
  'ngMessages',
  'ui.router',
  'ngCookies',
  'angularUtils.directives.dirPagination'
]);

mainApps.config(['$stateProvider', '$httpProvider', function ($stateProvider, $httpProvider) {

  $stateProvider

    .state('home', {
      url: '/home',
      templateUrl: './views/template.html', //controller: 'homeController'
      access: {
        restricted: false
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: './views/loginPage.html',
      controller: 'loginController',
      access: {
        restricted: false
      }
    })

    .state('signUp', {
      url: '/signUp',
      templateUrl: './views/signUpPage.html',
      controller: 'signUpController',
      access: {
        restricted: false
      }
    })

    .state('dashboard', {
      url: '/dashboard',
      resolve: {
        dashboardResolve: function (dashboardService, $cookies) {
          var details = $cookies.getObject('details');
          userId = details.userId;
          return dashboardService.listSavingsHistory(userId);

        }
      },
      templateUrl: './views/dashboardPage.html',
      controller: 'dashboardController',
      access: {
        restricted: true
      }
    })

    .state('recurringDashboard', {
      url: '/recurringDashboard',
      resolve: {
        result: function (recurringDashboardService, $cookies) {
          var details = $cookies.getObject('details');
          userId = details.userId;
          return recurringDashboardService.listRecurringSavingsHistory(userId);
        }
      },
      templateUrl: './views/recurringDashboard.html',
      controller: 'recurringDashboardController',
      access: {
        restricted: true
      }
    })

    .state('createPlan', {
      url: '/createplan',
      templateUrl: './views/createPlan.html',
      controller: 'createPlanController',
      access: {
        restricted: true
      }
    })


    .state('withdrawal', {
      url: '/withdrawal/:duePaymentDate/:save/:withdrawalStatus/:planType',
      templateUrl: './views/withdrawal.html',
      controller: 'withdrawalController',
      access: {
        restricted: true
      }
    })

    .state('penaltyWithdrawal', {
      url: '/penaltyWithdrawal/:duePaymentDate/:save/:withdrawalStatus/:planType',
      templateUrl: './views/penaltyWithdrawal.html',
      controller: 'withdrawalController',
      access: {
        restricted: true
      }
    })

    .state('logout', {
      url: '/logout',
      templateUrl: './views/logout.html',
      controller: 'logoutController',
      access: {
        restricted: true
      }
    })

    .state('transactionClosed', {
      url: '/transactionClosed',
      templateUrl: './views/transactionClosed.html',
      access: {
        restricted: true
      }
    })

    .state('userProfile', {
      url: '/userProfile/:userId',
      resolve: {
        result: function (userProfileService, $cookies) {
          var details = $cookies.getObject('details');
          userId = details.userId;
          return userProfileService.showUserProfile(userId)
        }
      },
      templateUrl: './views/usersProfile.html',
      controller: 'userProfileController',
      access: {
        restricted: true
      }
    })

    .state('listAllUsers', {
      url: '/listAllUsers/:userId/:permission',
      resolve: {
        result: function (viewAllUserService, $cookies) {
          var details = $cookies.getObject('details');
          userId = details.userId;
          permission = details.permission;         
          return viewAllUserService.listAllUsers(userId, permission)
        }
      },
      templateUrl: './views/viewAllUserBoard.html',
      controller: 'viewAllUserController',
      access: {
        restricted: true
      }
    })

    .state('listAdmin', {
      url: '/listAdmin/:userId/:permission',
      resolve: {
        result: function (viewAdminService, $cookies) {
          var details = $cookies.getObject('details');
          userId = details.userId;
          permission = details.permission;
          return viewAdminService.listAdmin(userId, permission)
        }
      },
      templateUrl: './views/viewAdminBoard.html',
      controller: 'viewAdminController',
      access: {
        restricted: true
      }
    })

    .state('editProfile', {
      url: '/editProfile/:userId',
      templateUrl: './views/editProfile.html',
      controller: 'editProfileController',
      access: {
        restricted: true
      }
    })

    .state('listUserSavings', {
      url: '/listUserSavings/:userId/:name',
      resolve: {
        result: function (listUserSavingsService) {
          return listUserSavingsService.savingsList(userId);

        }
      },
      templateUrl: './views/dashboardPage.html',
      controller: 'listUserSavingsController',
      access: {
        restricted: true
      }
    })

    // .state('contact', {
    //   url: '/',
    //   templateUrl: '/views/contact.html ',
    //   controller: 'contactController',
    //   controllerAs: 'vm',
    // })

    .state('noRoute', {
      url: '*path',
      redirectTo: 'home',
      access: {
        restricted: false
      }
    })

  $httpProvider.interceptors.push('mainAppInterceptor');
}]);


mainApps.run(['$rootScope', '$cookies', '$state', 'AuthService', function ($rootScope, $cookies, $state, AuthService) {

  $rootScope.$on('$stateChangeStart', function (e, toState, toParams, fromState, fromParams, options) {
    //when a page is loading
    if (toState.resolve) {
      $rootScope.isLoading = true;
    }

    //assigning false to the state of user's sign in
    // todetermine buttons that will be displayed in the navigation bar

    $rootScope.newStateName = toState.name;

    //getting logged in status from user's details from cookies
    if ($cookies.getObject('details')) {
      var details = $cookies.getObject('details');
    }

    // checking if accesss is not restricted and user is not logged in 
    // return to login page

    //assigning promise response value in loggedIn
    if (!details && (toState.name != 'home' || toState.name != 'signUp' || toState.name != 'login' || toState.name != 'logout')) {
      $rootScope.state = false;
      if (toState.access.restricted == true) {
        $state.go('login');
        e.preventDefault();
      }
    }
    if (details) {
      $rootScope.state = true;
    }


    if (toState.redirectTo) {
      e.preventDefault();
      $state.go(toState.redirectTo, fromState, {
        location: 'replace'
      })
    }

  })

  $rootScope.$on('$stateChangeSuccess', function (e, toState, toParsams, fromState, fromParams) {
       if (AuthService.isLoggedIn() == false || details == undefined) {
      $rootScope.state = false;
    } else {
      $rootScope.state = true;
    }

    if (toState.resolve) {
      $rootScope.isLoading = false;
    }
    var details = $cookies.getObject('details');
  })

}]);