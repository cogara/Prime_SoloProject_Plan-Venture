(function() {

DashboardController.$inject = ['$http', '$state'];

angular
  .module('planVentureApp')
  .controller('DashboardController', DashboardController)

  function DashboardController($http, $state) {
    var vm = this;
    vm.testing = 'dashbord test';
    vm.goToTrip = goToTrip;

    function goToTrip(trip_id, trip_name) {
      vm.currentTripId = trip_id;
      vm.currentTripName = trip_name;
      $http.get('/trips/users/' + trip_id).then(getTripOverview, httpFailure);
    }
    function getTripOverview(response) {
      console.log('Trip Overview', response.data);
      vm.tripUsers = response.data;
      getPersonalEquipment(vm.currentTripId);
      getGroupEquipment(vm.currentTripId);
      $state.go('dashboard.tripDisplay.tripOverview');
    }
    function getPersonalEquipment(trip_id) {
      $http.get('/trips/pe/' + trip_id).then(personalEquipSuccess, httpFailure);
    }
    function getGroupEquipment(trip_id) {
      $http.get('/trips/ge/' + trip_id).then(groupEquipSuccess, httpFailure);
    }
    function getTrips() {
      $http.get('/trips').then(getTripsSuccess, httpFailure);
    }
    function personalEquipSuccess(response){
      vm.personalEquipment = response.data;
    }
    function groupEquipSuccess(response){
      console.log('Getting group Equip', response.data);
      vm.groupEquipment = response.data;
    }
    function getTripsSuccess(response) {
      console.log(response.data);
      vm.trips = response.data;

    }
    function httpFailure(){
      console.log('HTTP Request Failed');
    }
    getTrips();
  }//end DashboardController
})();
