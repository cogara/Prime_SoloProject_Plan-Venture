(function() {

JoinTripController.$inject = ['$http', '$state', 'DataService'];

angular
  .module('planVentureApp')
  .controller('JoinTripController', JoinTripController)

  function JoinTripController($http, $state, DataService) {
    var vm = this;
    vm.joinTrip = joinTrip;
    vm.getTrips = DataService.getTrips;

    function joinTrip(){
      var sendData = {};
      sendData.tripName = vm.tripName;
      sendData.accessCode = vm.accessCode;
      $http.post('/trips/join', sendData).then(joinSuccess, httpFailure);
    }
    function joinSuccess(response) {
      vm.getTrips();
      console.log(response.data);
      $state.go('dashboard');
    }
    function httpFailure() {
      console.log('HTTP Request Failure');
    }

  } //end JoinTripController
})();
