(function() {

JoinTripController.$inject = ['$http', '$state', 'TripService', 'tripId'];

angular
  .module('planVentureApp')
  .controller('JoinTripController', JoinTripController)

  function JoinTripController($http, $state, TripService, tripId) {
    var vm = this;
    vm.joinTrip = joinTrip;
    vm.getTrips = TripService.getTrips;
    vm.tripId = tripId;
    console.log(vm.tripId);

    function joinTrip(){
      var sendData = {};
      sendData.id = vm.tripId;
      sendData.accessCode = vm.accessCode;
      $http.post('/api/trips/join', sendData).then(joinSuccess, httpFailure);
    }

    function joinSuccess(response) {
      vm.getTrips();
      // alert(response.data.message);
      $state.go('trips');
    }
    function httpFailure() {
      console.log('HTTP Request Failure');
    }

  } //end JoinTripController
})();
