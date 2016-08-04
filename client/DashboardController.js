(function() {

DashboardController.$inject = ['$http', '$state', 'TripService', 'UserService'];

angular
  .module('planVentureApp')
  .controller('DashboardController', DashboardController)

  function DashboardController($http, $state, TripService, UserService) {
    var vm = this;
    vm.goToTrip = goToTrip;
    vm.userData = UserService.data;
    vm.addPersonalEquipment = addPersonalEquipment;
    vm.addGroupEquipment = addGroupEquipment;
    vm.removeEquipment = removeEquipment;

    function getTrips() {
      TripService.getTrips().then(function(response){
        vm.tripList = response;
      }, function(){
        console.log('error');
      })
    }

    function goToTrip(tripId, tripName) {
      vm.currentTripId = tripId;
      vm.currentTripName = tripName;
      TripService.getOverview(tripId).then(overviewSuccess);
      TripService.getPersonalEquipment(tripId).then(personalEquipSuccess);
      TripService.getGroupEquipment(tripId).then(groupEquipSuccess);
    }

    function addPersonalEquipment(tripId) {
      console.log(vm.personalEquipment);
      TripService.addPersonalEquipment(vm.personalEquipmentAdd, tripId).then(function() {
        TripService.getPersonalEquipment(vm.currentTripId).then(personalEquipSuccess);
      }, function() {
        console.log('ERROR');
      });
    }

    function removeEquipment(equipment) {
      console.log('Equipment', equipment);
      TripService.removeEquipment(equipment).then(function() {
        TripService.getPersonalEquipment(vm.currentTripId).then(personalEquipSuccess);
        TripService.getGroupEquipment(vm.currentTripId).then(groupEquipSuccess);
      });
    }

    function addGroupEquipment(tripId) {
      console.log(vm.groupEquipment);
      TripService.addGroupEquipment(vm.groupEquipmentAdd, tripId).then(function() {
        TripService.getGroupEquipment(vm.currentTripId).then(groupEquipSuccess);
      }, function() {
        console.log('ERROR');
      });;
    }

    function overviewSuccess(response) {
      vm.trip = response;
      $state.go('dashboard.tripDisplay.tripOverview');
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
