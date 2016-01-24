var services = angular.module('services', ['ngResource']);

services.factory('ContactService', function($http) {
	function httpRequest(request, successCallback, errorCallback){
		$http(request).success(function(data, status){
			successCallback(data, status);})
		.error(function(data, status)
			{
				errorCallback(data, status);
			});
	}
	var Search = function(params, successCallback, errorCallback) {
    httpRequest({method: "GET", url: "/api/contacts" }, successCallback, errorCallback);
  };
  var Create = function(contact, successCallback, errorCallback) {
    httpRequest({method: "POST", url: "/api/contact", data: contact }, successCallback, errorCallback);
  };
  var Get = function(id, successCallback, errorCallback) {
    httpRequest({method: "GET", url: "/api/contact/" + id }, successCallback, errorCallback);
  };
  var Update = function(contact, successCallback, errorCallback) {
    httpRequest({method: "PUT", url: "/api/contact/" + contact.id , data: contact }, successCallback, errorCallback);
    sessionStorage.awaitEvent = 'updated:' + contact.id;
  };
  var Delete = function(id, successCallback, errorCallback) {
    httpRequest({method: "DELETE", url: "/api/contact/" + id}, successCallback, errorCallback);
    sessionStorage.awaitEvent = 'deleted:' + contact.id;
  };
  return { Search: Search, Create: Create, Get: Get, Update: Update, Delete: Delete };
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