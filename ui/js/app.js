var app = angular.module('app', [
  'ngRoute', 'ngCookies','controllers', 'services'
]);

app.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
  when('/', {
      templateUrl: 'views/chat/index.html',
      controller: 'ChatCtrl',
      title: "Secure Chat"
    }).
  when('/chat/:id', {
      templateUrl: 'views/chat/room.html',
      controller: 'ChatCtrl',
      title: "Secure Chat"
    }).
    when('/static/not-found', {
      templateUrl: 'views/static/not-found.html',
      controller: 'StaticCtrl',
      title: "Page Not Found"
    }).
    otherwise({
      redirectTo: '/static/not-found'
    });
}]);

//http://stackoverflow.com/a/15267754
app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});