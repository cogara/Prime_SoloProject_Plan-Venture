(function() {

DashboardController.$inject = ['$http', '$state', 'TripService', 'UserService'];

angular
  .module('planVentureApp')
  .controller('DashboardController', DashboardController)

  function DashboardController($http, $state, TripService, UserService) {
    var vm = this;
    vm.tempProfile = {};
    vm.goToTrip = goToTrip;
    vm.userData = UserService.data;
    // vm.data = TripService.data;
    vm.addPersonalEquipment = addPersonalEquipment;
    vm.addGroupEquipment = addGroupEquipment;
    vm.removeEquipment = removeEquipment;
    vm.claimEquipment = claimEquipment;
    vm.getUserProfile = getUserProfile;
    vm.closeProfile = closeProfile;
    vm.unclaimEquipment = unclaimEquipment;
    vm.preventClose = preventClose;
    vm.leaveTrip = leaveTrip;
    vm.sendMessage = sendMessage;
    vm.deleteMessage = deleteMessage;

    function deleteMessage(id) {
      TripService.deleteMessage(id).then(function() {
        TripService.getMessages(vm.trip.info.id).then(function(response) {
          vm.trip.messages = response.data;
        });
      });
    }

    function sendMessage(message) {
      vm.addMessage = null;
      var sendData = {};
      sendData.message = message;
      sendData.tripId = vm.trip.info.id;
      TripService.sendMessage(sendData).then(function() {
        TripService.getMessages(vm.trip.info.id).then(function(response) {
          vm.trip.messages = response.data;
        });
      });
    }

    function leaveTrip(tripId) {
      UserService.leaveTrip(tripId).then(function(response){
        console.log('promise?');
        getTrips();
        $state.go('user.dashboard')
      });
    }

    function getTrips() {
      TripService.getTrips().then(function(response){
        vm.trips = response;
      }, function(){
        console.log('Error');
      });
    }

    function goToTrip(tripId) {
      TripService.getOverview(tripId).then(overviewSuccess);
      TripService.getPersonalEquipment(tripId).then(personalEquipSuccess);
      TripService.getGroupEquipment(tripId).then(groupEquipSuccess);
    }

    function getUserProfile(index) {
      vm.tempProfile.username = vm.trip.users[index].username;
      vm.tempProfile.email = vm.trip.users[index].email;
      vm.tempProfile.phone = vm.trip.users[index].phone;
      vm.profileView = true;
    }

    function preventClose() {
      vm.prevent = true;
    }

    function closeProfile(){
      if (!vm.prevent) {
        vm.tempProfile = {};
        vm.profileView = false;
      }
      vm.prevent = false;
    }

    function addPersonalEquipment() {
      TripService.addPersonalEquipment(vm.personalEquipmentAdd, vm.trip.info.id).then(function() {
        TripService.getPersonalEquipment(vm.trip.info.id).then(personalEquipSuccess);
      }, function() {
        console.log('ERROR');
      });
    }

    function removeEquipment(equipment) {
      TripService.removeEquipment(equipment).then(function() {
        TripService.getPersonalEquipment(vm.trip.info.id).then(personalEquipSuccess);
        TripService.getGroupEquipment(vm.trip.info.id).then(groupEquipSuccess);
      });
    }

    function addGroupEquipment() {
      TripService.addGroupEquipment(vm.groupEquipmentAdd, vm.trip.info.id).then(function() {
        TripService.getGroupEquipment(vm.trip.info.id).then(groupEquipSuccess);
      }, function() {
        console.log('ERROR on add group');
      });;
    }

    function claimEquipment(equipment) {
      TripService.claimEquipment(equipment).then(function() {
        TripService.getGroupEquipment(vm.trip.info.id).then(groupEquipSuccess);
      }, function() {
        console.log('Error on claim');
      })
    }

    function unclaimEquipment(equipment) {
      TripService.unclaimEquipment(equipment).then(function() {
        TripService.getGroupEquipment(vm.trip.info.id).then(groupEquipSuccess);
      }, function() {
        console.log('unclaim fail');
      })
    }

    function overviewSuccess(response) {
      vm.trip = response;
      $state.go('user.dashboard.tripDisplay.tripOverview');
    }

    function personalEquipSuccess(response) {
      vm.personalEquipment = response;
    }

    function groupEquipSuccess(response) {
      vm.groupEquipment = response;
    }

    getTrips();

  }//end DashboardController
})();
