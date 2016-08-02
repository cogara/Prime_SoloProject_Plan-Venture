(function() {

DashboardController.$inject = ['$http', '$state', 'DataService'];

angular
  .module('planVentureApp')
  .controller('DashboardController', DashboardController)

  function DashboardController($http, $state, DataService) {
    var vm = this;
    vm.goToTrip = goToTrip;
    vm.true = true;
    vm.data = DataService.data;
    vm.getOverview = DataService.getOverview;

    function goToTrip(trip_id, trip_name) {
      vm.currentTripId = trip_id;
      vm.currentTripName = trip_name;
      vm.getOverview(trip_id, trip_name);

      // $http.get('/trips/pe/' + trip_id).then(personalEquipSuccess, httpFailure);
      // $http.get('/trips/ge/' + trip_id).then(groupEquipSuccess, httpFailure);
      // $http.get('/trips/info/' + trip_id).then(getTripOverview, httpFailure);
      
    }

    // function getTripOverview(response) {
    //   vm.tripUsers = response.data.users;
    //   vm.tripInfo = response.data.info[0];
    //   console.log(vm.tripInfo);
    //   vm.tripInfo.date = new Date(vm.tripInfo.date).toLocaleDateString('en-US');
    //   $state.go('dashboard.tripDisplay.tripOverview');
    // }
    //
    // function personalEquipSuccess(response){
    //   vm.personalEquipment = response.data;
    // }
    // function groupEquipSuccess(response){
    //   vm.groupEquipment = response.data;
    // }
    function httpFailure(){
      console.log('HTTP Request Failed');
    }
    // getTrips();
  }//end DashboardController
})();
