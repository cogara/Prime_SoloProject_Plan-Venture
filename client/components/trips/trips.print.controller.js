(function() {

PrintController.$inject = ['$http', '$state', 'print'];

angular
  .module('planVentureApp')
  .controller('PrintController', PrintController)

  function PrintController($http, $state, print) {
    var vm = this;
    vm.menu = print;
    vm.menuItems = [];
    vm.print = printMenu;

    function printMenu() {
      var printContents = document.getElementById('printArea').innerHTML;
      var originalContents = document.body.innerHTML;
      console.log(originalContents);
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }

    getMenuItems();
    function getMenuItems() {
      for (var day = 0; day < vm.menu.length; day++) {
        for (var meal = 0; meal < vm.menu[day].breakfast.length; meal++) {
          vm.menuItems.push(vm.menu[day].breakfast[meal]);
          // console.log(vm.menu[day].breakfast[meal]);
        }
        for (var meal = 0; meal < vm.menu[day].lunch.length; meal++) {
          vm.menuItems.push(vm.menu[day].lunch[meal]);
          // console.log(vm.menu[day].lunch[meal]);
        }
        for (var meal = 0; meal < vm.menu[day].dinner.length; meal++) {
          vm.menuItems.push(vm.menu[day].dinner[meal]);
          // console.log(vm.menu[day].dinner[meal]);
        }
      }
      console.log(vm.menuItems);
    }

    // function getMenu() {
    //     TripService.getMenu(vm.data.info.id, vm.data.info.date).then(function(response){
    //     vm.menu = response;
    //   })
    // }


  } //end MainController
})();
