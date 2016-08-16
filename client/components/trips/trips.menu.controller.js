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
    vm.toggleAdd = toggleAdd;
    vm.editMenu = editMenu;
    vm.editingMenu = 'Edit Menu';
    vm.removeMenuItem = removeMenuItem;

    function removeMenuItem(day, meal, item) {
      console.log(day, meal, item);
      var data = {};
      data.day = day;
      data.meal = meal;
      data.item = item.itemId;
      console.log(data);
      TripService.removeMenuItem(vm.trip.info.id, data).then(function(){
        console.log('Getting updated menu');
        getMenu();
      });
    }

    function editMenu() {
      if (vm.menuEdit) {
        vm.menuEdit = false;
        vm.editingMenu = 'Edit Menu';
      } else {
        vm.editingMenu = 'Done Editing'
        vm.menuEdit = true;
      }
    }

    function toggleAdd(day, meal) {
      vm.addMenuItem = null;
      vm.addMenuQty = null;
      if (vm.tripMenu[day-1][meal].show) {
        vm.tripMenu[day-1][meal].show = false;
      } else {
        vm.tripMenu[day-1][meal].show = true;
      }
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

    // getMenu()
    //
    // function getMenu() {
    //   TripService.getMenu(vm.trip.info.id).then(function(response){
    //     console.log(response);
    //     vm.tripMenu = response.menu;
    //     for (var i = 0; i < vm.tripMenu.length; i++) {
    //       var tempDate = new Date(vm.trip.info.date);
    //       tempDate.setDate(tempDate.getDate() + i);
    //       vm.tripMenu[i].date = tempDate;
    //       console.log(vm.tripMenu[i]);
    //     }
    //   });
    // };

  } //end MenuController
})();
