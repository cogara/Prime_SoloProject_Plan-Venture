(function() {

JoinTripController.$inject = ['$http', '$state', 'TripService'];

angular
  .module('planVentureApp')
  .controller('JoinTripController', JoinTripController)

  function JoinTripController($http, $state, TripService) {
    var vm = this;
    vm.joinTrip = joinTrip;
    vm.getTrips = TripService.getTrips;

    function joinTrip(){
      var sendData = {};
      sendData.tripName = vm.tripName;
      sendData.accessCode = vm.accessCode;
      $http.post('/trips/join', sendData).then(joinSuccess, httpFailure);
    }
    function joinSuccess(response) {
      vm.getTrips();
      alert(response.data.message);
      $state.go('dashboard');
    }
    function httpFailure() {
      console.log('HTTP Request Failure');
    }

  } //end JoinTripController
})();
