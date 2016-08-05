(function() {

CreateTripController.$inject = ['$http', '$state', 'TripService'];

angular
  .module('planVentureApp')
  .controller('CreateTripController', CreateTripController)

  function CreateTripController($http, $state, TripService) {
    var vm = this;
    vm.createTrip = createTrip;

    function createTrip(){
      var sendData = {};

      sendData.tripName = vm.tripName;
      sendData.tripDate = vm.tripDate;
      sendData.tripLocation = vm.tripLocation;
      sendData.tripDuration = vm.tripDuration;
      sendData.accessCode = vm.accessCode;

      $http.post('/trips/create', sendData).then(createSuccess, httpFailure);

      function createSuccess(response) {
        console.log(response);
        TripService.getTrips();
        $state.go('dashboard');
      }
      function httpFailure() {
        console.log('HTTP Request Failure');
      }
    }

  } //end CreateTripController
})();
