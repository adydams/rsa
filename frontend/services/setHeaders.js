// register the interceptor as a service
angular.module('mainApp')
  .factory('mainAppInterceptor', function ($q, $cookies) {
    return {
      // optional method
      'request': function (config) {

        var details = $cookies.getObject('details');
        if (details) {
          var token = details.token;
          //removing token from headers for creating recipient in flutterwave
          if (config.url == 'https://ravesandboxapi.flutterwave.com/v2/gpx/transfers/beneficiaries/create') {
            config.headers['Content-Type'] = 'application/json'
          } else {
            config.headers['x-access-token'] = token
            config.headers['Content-Type'] = 'application/json'
          }
        }
        return config;
      }
    }
  })