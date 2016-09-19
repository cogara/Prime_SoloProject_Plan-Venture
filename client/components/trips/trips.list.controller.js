(function() {

TripsListController.$inject = ['$http', '$state', 'TripService', 'UserService'];

angular
  .module('planVentureApp')
  .controller('TripsListController', TripsListController)

  function TripsListController($http, $state, TripService, UserService) {
    var vm = this;
    vm.title = 'Current Trips';
    vm.goToTrip = goToTrip;
    vm.userData = UserService.data;

    function getTrips() {
      TripService.getTrips().then(function(response){
        vm.trips = response;
        for (var i = 0; i < vm.trips.length; i++) {
          var tempEndDate = moment(vm.trips[i].date).add(vm.trips[i].duration, 'days');
          vm.trips[i].endDate = tempEndDate._d;
        }
      }, function(){
        console.log('Error');
      });
    }



    function goToTrip(id) {
      $state.go('trip.overview', {tripId: id});
    }


    getTrips();

  }//end Trip List controller
})();
