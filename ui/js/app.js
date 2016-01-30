var app = angular.module('app', [
  'ngRoute', 'ngCookies','controllers', 'services'
]);

app.config(['$routeProvider',
function($routeProvider) {
  $routeProvider.
  when('/', {
      templateUrl: 'views/chat/index.html',
      controller: 'ChatMainCtrl',
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



//ngEnter module
//stackoverflow.com/a/17364716
angular.module('app').directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    });