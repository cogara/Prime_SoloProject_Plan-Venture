(function() {

CreateTripController.$inject = ['$http', '$state', 'TripService'];

angular
  .module('planVentureApp')
  .controller('CreateTripController', CreateTripController)

  function CreateTripController($http, $state, TripService) {
    var vm = this;
    vm.createTrip = createTrip;
    vm.copyTrip = copyTrip;
    vm.data = TripService.data;

    console.log(vm.data);

    function createTrip(){
      var sendData = {};

      sendData.tripName = vm.tripName;
      sendData.tripDate = vm.tripDate;
      sendData.tripLocation = vm.tripLocation;
      sendData.tripDuration = vm.tripDuration;
      sendData.accessCode = vm.accessCode;

      $http.post('/api/trips/create', sendData).then(createSuccess, httpFailure);


    }

    function copyTrip(trip) {
      var sendData = {};
      sendData.tripName = vm.newName;
      sendData.tripDate = vm.newDate;
      sendData.tripLocation = trip.location;
      sendData.tripDuration = trip.duration;
      sendData.accessCode = vm.newAccess;
      $http.post('/api/trips/create' + '?copy=true&id=' + trip.id, sendData).then(createSuccess, httpFailure);
    }

    function createSuccess(response) {
      console.log(response);
      TripService.getTrips();
      $state.go('trips');
    }
    function httpFailure() {
      console.log('HTTP Request Failure');
    }

  } //end CreateTripController
})();
