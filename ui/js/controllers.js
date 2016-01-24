var ctrls = angular.module('controllers', []);

function errorCallback(data, status){
	console.log({ status: status, data: data});
}

ctrls.controller('ContactCtrl', ['$scope', '$http', '$location', '$routeParams', 'ContactService',
  function($scope, $http, $location, $routeParams, ContactService) {
  	$scope.Methods = {};
  	$scope.contacts = [];
  	$scope.contact = {};

    $scope.Methods.GetContacts = function(){
      ContactService.Search({}, function(data, status){
        $scope.contacts = data;
      }, errorCallback)
    }
    $scope.Methods.GetContact = function(){
      ContactService.Get($routeParams.id, function(data, status){
        $scope.contact = data;
      }, errorCallback)
    }
  	if ($routeParams.id){
  		$scope.Methods.GetContact();
  	}
  	else{
			$scope.Methods.GetContacts();
  	}
    
  	$scope.Methods.NavigateToContact = function(contact){
  		window.location.href = '/#/contact/' + contact.id;
  	}
  	$scope.Methods.SaveContact = function(contact){
  		if (contact.id){
	  		ContactService.Update(contact, function(data, status){
					if (data.replaced){
            //updated successfully
          }
          else if (data.unchanged){
            //saved but no changes logged on db
          }
          else{
            errorCallback();
          }
				}, errorCallback)
  		}
  		else{
        console.log(contact);
  			ContactService.Create(contact, function(data, status){
          if (data.inserted){
            $scope.contact.id = data.generated_keys[0];
            $scope.Methods.NavigateToContact($scope.contact);
          }
          else{
            errorCallback();
          }
				}, errorCallback)	
  		}
  	}
  	$scope.Methods.DeleteContact = function(contact){
      if (!contact.id) {window.location.href = '/#/'; return;}
			ContactService.Delete(contact.id, function(data, status){
				if (data.deleted){
          window.location.href = '/#/';
        }
        else{
          errorCallback();
        }
			}, errorCallback)
  	};
    $scope.Methods.OnServerEvent = function(msg, event){
      if (event == 'deleted') $scope.Methods.OnContactDeleted();
      if (event == 'updated' )//&& sessionStorage.awaitEvent != ('updated:' + $scope.contact.id))
      {
        $scope.Methods.OnContactUpdated(msg.data);
      }
      // if (sessionStorage.awaitEvent == ('updated:' + $scope.contact.id))
      //   sessionStorage.awaitEvent = null;
    }
    $scope.Methods.OnContactDeleted = function(msg){
      if (window.location.hash == '#/') { $scope.Methods.GetContacts(); return; }
      alert("The contact you are editing has been deleted. This contact is no longer available.");
      window.location.href = '/#/';
    }
    $scope.Methods.OnContactUpdated = function(data){
      if (window.location.hash == '#/') { $scope.Methods.GetContacts(); return; }
      console.log(data);
      // Compare updated contact model
      var syncRequired = false;
      if (data.new_val.id == $scope.contact.id){
        if ((data.new_val.firstName != $scope.contact.firstName) || (data.new_val.lastName != $scope.contact.lastName) || (data.new_val.email != $scope.contact.email) || (data.new_val.age != $scope.contact.age)){
          syncRequired = true;
        }
      }
      if (syncRequired){
        var update = confirm("The current contact has been updated. would you like to update your page?")
        if (update){
          // two options - look through form's unchanged fields and update the unchanged fields only using angular's built-in methods
          // simpler way - update the whole model at once.
          $scope.contact = data.new_val;
        }
      }
    };
  }
]);

ctrls.controller('StaticCtrl', ['$scope', '$http', function($scope, $http) {

}]);

ctrls.controller('StreamCtrl', ['$scope', '$http', 'SocketService', function($scope, $http, SocketService) {
  SocketService.socket.emit('join', {room: window.location.hash, user: userName});
	$scope.updates = [];
}]);