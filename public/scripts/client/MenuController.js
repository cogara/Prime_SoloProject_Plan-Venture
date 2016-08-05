(function() {

TripMenuController.$inject = ['$http', '$state', 'TripService'];

angular
  .module('planVentureApp')
  .controller('MenuController', TripMenuController)

  function TripMenuController($http, $state, TripService) {
    var vm = this;





  } //end MenuController
})();
