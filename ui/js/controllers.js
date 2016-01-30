var ctrls = angular.module('controllers', []);

function errorCallback(data, status){
	console.log({ status: status, data: data});
}

ctrls.controller("ChatMainCtrl", ['$scope', '$http', '$location', '$routeParams', 'ChatService',
  function($scope, $http, $location, $routeParams, ChatService){
    $scope.Methods = {};
    $scope.invitees = [""];
    $scope.Methods.EnableSendInvitationButton = function(){
      // if email is valid and invitees exist, then send invitation
      var validInviter = $scope.createRoomForm["inviter"].$valid;
      var validInvitees = true && $scope.invitees.length;
      for(var i = 0; i < $scope.invitees.length; i ++){
        validInvitees = validInvitees && $scope.createRoomForm["invitees[" + i + "]"].$valid;
      }
      return !(validInvitees && validInviter);
    }
    $scope.Methods.SendInvitation = function(){
      if (!$scope.createRoomForm.$valid) return;
      ChatService.Invite($scope.inviter, $scope.invitees, successCallback, errorCallback);
      function successCallback(data, status){;
        alert("redirecting you to chatroom...");
        setTimeout(function(){window.location.href = "http://" + data.chatUrl}, 20);
      }
      function errorCallback(data, status){
        alert("error: " + data);
      }
    };
  }
]);

ctrls.controller('ChatCtrl', ['$scope', '$http', '$location', '$routeParams', 'ChatService', "SocketService",
  function($scope, $http, $location, $routeParams, ChatService, SocketService) {
  	$scope.Methods = {};
    $scope.messages = [];
  	//$scope.chatKey = $routeParams.key;
    $scope.Methods.SendMessage = function(){
      if (!$scope.contactForm.$valid) return;
      if (!$scope.chatText) return;
      var message = { name: $scope.name, message: $scope.chatText, time : new Date().toLocaleTimeString().replace(/:\d+ /, ' ') };
      $scope.messages.push(message);
      var encryptedMessage = { name: $scope.name, message: encrypt(message.message, $scope.chatKey), time : message.time };
      SocketService.socket.emit('sendMessage', {room: window.location.hash, message : encryptedMessage });
      $scope.chatText = null;
      $scope.Methods.ScrollToBottom();
    }
    function m(){
      var a = [];
      for(var i = 0; i < 100; i++){
        a.push("message : " + i);
      }
      return a;
    }
    $scope.Methods.ScrollToBottom = function(){
      setTimeout(function(){window.scrollTo(0,document.body.scrollHeight)}, 20);
    };
    angular.element(document).ready(function () {
        $scope.Methods.ScrollToBottom();
    });
    $scope.Methods.JoinRoom = function(){
      if (!$scope.contactForm.$valid) return;
      var encrypted = encrypt("joined room!", $scope.chatKey);
      var message = { name: $scope.name, message: encrypted, time : new Date().toLocaleTimeString().replace(/:\d+ /, ' ') }
      SocketService.socket.emit('joinRoom', {room: window.location.hash, message : message});
      SocketService.updateRoom = $scope.Methods.UpdateRoom
      $scope.joinedRoom = true;
    }
    $scope.Methods.UpdateRoom = function(event, message){
      //console.log( {event: event, message: message });
      var decrypted = decrypt(message.message, $scope.chatKey);
      message.message = decrypted;
      $scope.messages.push(message);
      $scope.Methods.ScrollToBottom();
    }
    function encrypt(msg, key){
      return CryptoJS.AES.encrypt(msg, key).toString();
    }
    function decrypt(msg, key){
      return CryptoJS.AES.decrypt(msg, key).toString(CryptoJS.enc.Utf8);
    }
  }
]);

ctrls.controller('StaticCtrl', ['$scope', '$http', function($scope, $http) {

}]);