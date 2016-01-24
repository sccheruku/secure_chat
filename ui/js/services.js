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
  socket.on('joined', function(msg){
    updateRoom(msg);
  });
  socket.on('updated', function(msg){
  	updateContact(msg, 'updated');
  });
  socket.on('created', function(msg){
  	updateContact(msg, 'created');
  });
  socket.on('deleted', function(msg){
  	updateContact(msg, 'deleted');
  });
  function updateContact(msg, event){
  	updateRoom(msg);
  	if (window.location.hash == '#/'){
    	angular.element('[ng-controller="ContactCtrl"]').scope().Methods.GetContacts();
    	angular.element('[ng-controller="ContactCtrl"]').scope().$apply();
    }
    angular.element('[ng-controller="ContactCtrl"]').scope().Methods.OnServerEvent(msg, event);
    angular.element('[ng-controller="ContactCtrl"]').scope().$apply();
  }
  function updateRoom(msg){
  	// Is there a better way? 
		angular.element('[ng-controller="StreamCtrl"]').scope().updates.push(msg);
    angular.element('[ng-controller="StreamCtrl"]').scope().$apply();
  }
  return { socket: socket }
});