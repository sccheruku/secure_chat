var ctrls = angular.module('controllers', []);

function errorCallback(data, status){
	console.log({ status: status, data: data});
}

ctrls.controller("ChatMainCtrl", ['$scope', '$http', '$location', '$routeParams', 'ChatService',
  function($scope, $http, $location, $routeParams, ChatService){
    $scope.Methods = {};
    $scope.invitees = [""];
    $scope.Methods.SendInvitation = function(){
      if (!$scope.createRoomForm.$valid) return;
      ChatService.Invite($scope.inviter, $scope.invitees, successCallback, errorCallback);
      function successCallback(data, status){;
        alert("redirecting you to chatroom...");
        window.location.href = data.chatUrl;
      }
      function errorCallback(data, status){
        alert("error: " + data);
      }
    };
  }
]);

ctrls.controller('ChatCtrl', ['$scope', '$http', '$location', '$routeParams', 'ChatService',
  function($scope, $http, $location, $routeParams, ChatService) {
  	$scope.Methods = {};
    $scope.messages = [];
  	$scope.passKey = $routeParams.key;
    $scope.Methods.SendMessage = function(name, message){
      $scope.messages.push("<b>" + name + "</b>: " + message + " at " + new Date());
    }
  }
]);

ctrls.controller('StaticCtrl', ['$scope', '$http', function($scope, $http) {

}]);

ctrls.controller('StreamCtrl', ['$scope', '$http', 'SocketService', function($scope, $http, SocketService) {
  SocketService.socket.emit('join', {room: window.location.hash, user: userName});
	$scope.updates = [];
}]);