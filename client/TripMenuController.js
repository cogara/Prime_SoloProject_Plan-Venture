(function() {

TripMenuController.$inject = ['$http', '$state', 'TripService'];

angular
  .module('planVentureApp')
  .controller('TripMenuController', TripMenuController)

  function TripMenuController($http, $state, TripService) {
    var vm = this;
    vm.trip = TripService.data.trip;
    vm.menu = []
    vm.addBreakfast = addBreakfast;

    function addBreakfast(index) {
      console.log(index, vm.addBreakfastItem);
      vm.menu[index].breakfast.push({food: vm.addBreakfastItem});
    }

    createMenu();
    function createMenu() {
      for (var i = 1; i <= vm.trip.info.duration; i++) {
        var menuDay = {};
        menuDay.breakfast = [];
        menuDay.lunch = [];
        menuDay.dinner = [];
        vm.menu.push(menuDay);
      }
      $http.post('/menus/create', vm.menu).then(function(response){
        console.log('created menu');
      }, function(){
        console.log('something went wrong!');
      })
    }

  } //end MenuController
})();
