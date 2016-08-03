(function() {

DashboardController.$inject = ['$http', '$state', 'DataService'];

angular
  .module('planVentureApp')
  .controller('DashboardController', DashboardController)

  function DashboardController($http, $state, DataService) {
    var vm = this;
    vm.goToTrip = goToTrip;
    vm.data = DataService.data;
    vm.getOverview = DataService.getOverview;
    vm.getTrips = DataService.getTrips;

    vm.getTrips();

    function goToTrip(trip_id, trip_name) {
      vm.currentTripId = trip_id;
      vm.currentTripName = trip_name;
      vm.getOverview(trip_id, trip_name);
    }

  }//end DashboardController
})();
