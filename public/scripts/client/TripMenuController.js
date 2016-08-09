(function() {

TripMenuController.$inject = ['$http', '$state', 'TripService'];

angular
  .module('planVentureApp')
  .controller('TripMenuController', TripMenuController)

  function TripMenuController($http, $state, TripService) {
    var vm = this;
    vm.trip = TripService.data.trip;
    vm.tripMenu = [];
    vm.addItem = addItem;
    vm.testClick = testClick;
    vm.menuData = menuData;
    vm.toggle = toggle;

    function toggle(meal, index) {
      console.log(meal);
      vm.addMenuItem = null;
      vm.addMenuQty = null;
      if (vm.tripMenu[index][meal].show) {
        vm.tripMenu[index][meal].show = false;
      } else {
        vm.tripMenu[index][meal].show = true;
      }

      console.log(vm.tripMenu[index]);
    }

    function menuData(){
      console.log(vm.tripMenu.length);
    }

    function testClick(test, meal) {
      console.log(test, meal);
    }

    function addItem(meal, day, item) {
      var data = {};
      data.meal = meal;
      data.day = day;
      data.item = item;
      console.log(data);
      TripService.addMenuItem(vm.trip.info.id, data).then(function(response){
        console.log('anything?');
        getMenu();
      });
    }

    getMenu()

    function getMenu() {
      TripService.getMenu(vm.trip.info.id).then(function(response){
        console.log(response);
        vm.tripMenu = response.menu;
      });
    };

    //
    // createMenu();
    // function createMenu() {
    //   for (var i = 1; i <= vm.trip.info.duration; i++) {
    //     var menuDay = {};
    //     menuDay.breakfast = [{name: 'donuts', qty: '5'}, {name: 'ceral', qty: '1'}];
    //     menuDay.lunch = [{name: 'pizza', qty: '1'}, {name: 'pop', qty: '5'}];
    //     menuDay.dinner = [{name: 'burgers', qty: '5'}];
    //     vm.tripMenu.push(menuDay);
    //   }
    //   // $http.post('/menus/create', vm.menu).then(function(response){
    //   //   console.log('created menu');
    //   // }, function(){
    //   //   console.log('something went wrong!');
    //   // })
    // }

  } //end MenuController
})();
