(function() {

CreateTripController.$inject = ['$http', '$state'];

angular
  .module('planVentureApp')
  .controller('CreateTripController', CreateTripController)

  function CreateTripController($http, $state) {
    var vm = this;

    vm.createTrip = createTrip;

    function createTrip(){
      var sendData = {};

      sendData.tripName = vm.tripName;
      sendData.tripDate = vm.tripDate;
      sendData.tripDuration = vm.tripDuration;
      sendData.accessCode = vm.accessCode;
      console.log(sendData);

      $http.post('/trips/create', sendData).then(createSuccess, httpFailure);

      function createSuccess(response) {
        console.log(response);
      }
      function httpFailure() {
        console.log('HTTP Request Failure');
      }
    }

  } //end CreateTripController
})();
