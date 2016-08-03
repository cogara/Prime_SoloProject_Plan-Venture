(function() {

DashboardController.$inject = ['$http', '$state', 'DataService', 'UserService'];

angular
  .module('planVentureApp')
  .controller('DashboardController', DashboardController)

  function DashboardController($http, $state, DataService, UserService) {
    var vm = this;
    vm.goToTrip = goToTrip;
    vm.data = DataService.data;
    vm.userData = UserService.data;
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
