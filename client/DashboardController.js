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


    function getTrips() {
      TripService.getTrips().then(function(response){
        vm.trips = response;
        console.log(response);
        console.log('RELOADED!!!');
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
      console.log(vm.trip.users[index]);
      vm.tempProfile.username = vm.trip.users[index].username;
      vm.tempProfile.email = vm.trip.users[index].email;
      vm.tempProfile.phone = vm.trip.users[index].phone;
      vm.profileView = true;
    }

    function preventClose() {
      console.log('prevented');
      vm.prevent = true;
    }

    function closeProfile(){
      if (!vm.prevent) {
        console.log('not prevented');
        vm.tempProfile = {};
        vm.profileView = false;
      }
      vm.prevent = false;
    }

    function addPersonalEquipment() {
      console.log('testing trip id', vm.trip.info.id);
      TripService.addPersonalEquipment(vm.personalEquipmentAdd, vm.trip.info.id).then(function() {
        TripService.getPersonalEquipment(vm.trip.info.id).then(personalEquipSuccess);
      }, function() {
        console.log('ERROR');
      });
    }

    function removeEquipment(equipment) {
      console.log('Equipment', equipment);
      TripService.removeEquipment(equipment).then(function() {
        TripService.getPersonalEquipment(vm.trip.info.id).then(personalEquipSuccess);
        TripService.getGroupEquipment(vm.trip.info.id).then(groupEquipSuccess);
      });
    }

    function addGroupEquipment() {
      console.log(vm.groupEquipment);
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
