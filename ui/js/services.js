var services = angular.module('services', ['ngResource']);

services.factory('ChatService', function($http) {
	function httpRequest(request, successCallback, errorCallback){
		$http(request).success(function(data, status){
			successCallback(data, status);})
		.error(function(data, status)
			{
				errorCallback(data, status);
			});
	}
	var Invite = function(inviter, invitees, successCallback, errorCallback) {
    httpRequest({method: "POST", url: "/api/invite", data: {inviter: inviter, invitees: invitees} }, successCallback, errorCallback);
  };
  return { Invite: Invite };
});

services.factory("SocketService", function(){
	var socket = io();
  socket.on('joinedRoom', function(msg){
    updateRoom('joinedRoom', msg);
  });
  socket.on('messageRecieved', function(msg){
    updateRoom('messageRecieved',msg);
  });
  socket.on('leaveRoom', function(msg){
    updateRoom('leaveRoom',msg);
  });
  function updateRoom(event, msg){
    // Is there a better way? 
    angular.element('[ng-controller="ChatCtrl"]').scope().Methods.UpdateRoom(event, msg);
    angular.element('[ng-controller="ChatCtrl"]').scope().$apply();
  }
  return { socket: socket, updateRoom: updateRoom }
});