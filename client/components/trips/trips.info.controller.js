(function() {

TripInfoController.$inject = ['$http', '$state', '$timeout', 'UserService', 'TripService', 'trip','moment', 'print'];

angular
  .module('planVentureApp')
  .controller('TripInfoController', TripInfoController)

  function TripInfoController($http, $state, $timeout, UserService, TripService, trip, moment, print) {
    var vm = this;


    vm.printDisplay = printMenu;
    vm.menuPrint = print;
    vm.menuItems = [];

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
      for (var day = 0; day < vm.menuPrint.length; day++) {
        for (var meal = 0; meal < vm.menuPrint[day].breakfast.length; meal++) {
          vm.menuItems.push(vm.menuPrint[day].breakfast[meal]);
          // console.log(vm.menuPrint[day].breakfast[meal]);
        }
        for (var meal = 0; meal < vm.menuPrint[day].lunch.length; meal++) {
          vm.menuItems.push(vm.menuPrint[day].lunch[meal]);
          // console.log(vm.menuPrint[day].lunch[meal]);
        }
        for (var meal = 0; meal < vm.menuPrint[day].dinner.length; meal++) {
          vm.menuItems.push(vm.menuPrint[day].dinner[meal]);
          // console.log(vm.menuPrint[day].dinner[meal]);
        }
      }
    }


    //selected trip info - receives complete overview except menu
    vm.data = trip;
    vm.toggleTab = toggleTab;
    vm.tabDetails = true;
    //current logged in user
    vm.currentUser = UserService.data.currentUser;

    //equipment objects and functions
    vm.addPersonalEquipment = addPersonalEquipment;
    vm.addGroupEquipment = addGroupEquipment;
    vm.togglePersonalEquipment = true;
    vm.addEquipmentToggle = addEquipmentToggle;
    vm.toggleSetPersonal = toggleSetPersonal;
    vm.toggleSetGroup = toggleSetGroup;
    vm.removeEquipment = removeEquipment;
    vm.claimEquipment = claimEquipment;
    vm.unclaimEquipment = unclaimEquipment;
    vm.leaveTrip = leaveTrip;
    vm.editInfo = editInfo;
    vm.saveChanges = saveChanges;

    //menu objects and functions
    vm.addItem = addItem;
    vm.toggleAdd = toggleAdd;
    vm.editMenu = editMenu;
    vm.editingMenu = 'Edit Menu';
    vm.removeMenuItem = removeMenuItem;

    //message board
    vm.deleteMessage = deleteMessage;
    vm.sendMessage = sendMessage;

    //profile info
    vm.getUserProfile = getUserProfile;
    vm.closeProfile = closeProfile;
    vm.preventClose = preventClose;

    vm.calendarOpen = calendarOpen;

    vm.dateFormat = 'MMM dd, yyyy'
    vm.dateOptions = {
      formatYear: 'yy',
      maxDate: new Date(2020, 5, 22),
      minDate: new Date(),
      startingDay: 0
    };

    function calendarOpen() {
      vm.calendarOpened = true;
    }


    function toggleTab(tab) {
      switch(tab) {
        case 'details':
          clearTabs();
          vm.tabDetails = true;
          return;
        case 'menu':
          clearTabs();
          vm.tabMenu = true;
          return;
        case 'equipment':
          clearTabs();
          vm.tabEquipment = true;
          return;
        case 'map':
          clearTabs();
          vm.tabMap = true;
          return;
      }
    }
    function clearTabs() {
      vm.tabDetails = false;
      vm.tabEquipment = false;
      vm.tabMenu = false;
      vm.tabMap = false;
    }

    vm.toggleMessage = "Add Items"
    function addEquipmentToggle() {
      if (vm.toggleAddEquip) {
        vm.toggleMessage = 'Add Items';
        vm.toggleAddEquip = false;
      } else {
        vm.toggleMessage = 'Done';
        vm.toggleAddEquip = true;
      }
    }

    function toggleSetPersonal() {
      vm.togglePersonalEquipment = true;
      vm.toggleGroupEquipment = false;
    }
    function toggleSetGroup() {
      vm.togglePersonalEquipment = false;
      vm.toggleGroupEquipment = true;
    }

    //get trip location for google maps
    $http.get('http://maps.google.com/maps/api/geocode/json?address=' + vm.data.info.location + '&sensor=false').success(function(mapData) {
      vm.map = {};
      vm.zoom = 12;
      vm.map.latitude = mapData.results[0].geometry.location.lat;
      vm.map.longitude = mapData.results[0].geometry.location.lng;
    });

    function saveChanges() {
      console.log('Saving Changes');
      var edits = [{location: vm.locationIsEdited}, {date: vm.dateIsEdited}, {duration: vm.durationIsEdited}, {notes: vm.notesIsEdited}];
      console.log(edits);
      if (vm.data.info.duration > 50) {
        alert('Duration too long. Must be below 50 nights');
        return false;
      }
      if (!vm.locationIsEdited && !vm.dateIsEdited && !vm.durationIsEdited && !vm.notesIsEdited) {
        return;
      }
      for (var i = 0; i < edits.length; i++) {
        if(edits[i].location) {
          TripService.editLocation(vm.data.info.location, vm.data.info.id);
        }
        if(edits[i].date) {
          TripService.editDate(vm.data.info.date, vm.data.info.id);
        }
        if(edits[i].duration) {
          TripService.editDuration(vm.data.info.duration, vm.data.info.id, vm.menu);
        }
        if(edits[i].notes) {
          TripService.editNotes(vm.data.info.notes, vm.data.info.id);
        }
      }
      vm.notesIsEdited = false;
      vm.locationIsEdited = false;
      vm.dateIsEdited = false;
      vm.durationIsEdited = false;
      $timeout(function(){
        $state.reload();
      }, 500);
      // window.setTimeout(function () {
      //   console.log('pause');
      // }, 1000);
      // $state.reload();
    }

    //sets current info to check if info has changed before clicking edit
    var tempNotes = vm.data.info.notes;
    var tempLocation = vm.data.info.location;
    var tempDate = vm.data.info.date;
    var tempDuration = vm.data.info.duration;
    function editInfo() {
      if(vm.editDetails) {
        vm.editDetails = false;
        if (vm.data.info.location !== tempLocation) {
          vm.locationIsEdited = true;
        } else {
          vm.locationIsEdited = false;
        }
        if (vm.data.info.date !== tempDate) {
          vm.dateIsEdited = true;
        } else {
          vm.dateIsEdited = false;
        }
        if (parseInt(vm.data.info.duration) !== tempDuration) {
          vm.durationIsEdited = true;
        } else {
          vm.durationIsEdited = false;
        }
        if (vm.data.info.notes !== tempNotes) {
          vm.notesIsEdited = true;
        } else {
          vm.notesIsEdited = false;
        }
      } else {
        vm.editDetails = true;
      }

      // switch(info) {
      //   case 'location':
      //     if (vm.editLocation) {
      //       console.log(vm.data.info.location, tempLocation);
      //       if (vm.data.info.location !== tempLocation) {
      //         vm.locationIsEdited = true;
      //       } else {
      //         vm.locationIsEdited = false;
      //       }
      //       vm.editLocation = false;
      //       vm.editLocationButton = 'Edit';
      //     } else {
      //       vm.editLocation = true;
      //       vm.editLocationButton = 'Done';
      //     }
      //     return;
      //   case 'date':
      //     if (vm.editDate) {
      //       if (vm.data.info.date !== tempDate) {
      //         vm.dateIsEdited = true;
      //       } else {
      //         vm.dateIsEdited = false;
      //       }
      //       vm.editDate = false;
      //       vm.editDateButton = 'Edit';
      //     } else {
      //       vm.editDate = true;
      //       vm.editDateButton = 'Done';
      //     }
      //     return;
      //   case 'duration':
      //     if (vm.editDuration) {
      //       console.log(typeof vm.data.info.duration, typeof tempDuration);
      //       if (parseInt(vm.data.info.duration) !== tempDuration) {
      //         vm.durationIsEdited = true;
      //       } else {
      //         vm.durationIsEdited = false;
      //       }
      //       vm.editDuration = false;
      //       vm.editDurationButton = 'Edit';
      //     } else {
      //       vm.editDuration = true;
      //       vm.editDurationButton = 'Done';
      //     }
          // return;
      // }


    }

    //Leave trip
    function leaveTrip(tripId) {
      console.log(vm.data.info);
      console.log(vm.currentUser);
      var userId = vm.currentUser.id;
      var orgId = vm.data.info.organizer_id;
      console.log(userId, orgId);
      if(orgId === userId) {
        // var confirm = confirm('You are the trip organizer. Leaving this trip will delete this trip. Are you sure you want to leave?');
        // console.log(confirm);
        if (confirm('You are the trip organizer. Leaving this trip will delete this trip. Are you sure you want to leave?')) {
          UserService.leaveTrip(tripId, orgId, userId).then(function(response){
            $state.go('trips')
          });
        } else {
          return;
        }
      } else {
        if(confirm('Are you sure you want to leave this trip?')) {
          UserService.leaveTrip(tripId).then(function(response){
            $state.go('trips')
          });
        } else {
          return;
        }
      }
    }

    //Equipment functions
    function addPersonalEquipment(equipment) {
      vm.personalEquipmentToAdd = '';
      TripService.addPersonalEquipment(equipment, vm.data.info.id)
      .then(function() {
        TripService.getPersonalEquipment(vm.data.info.id)
        .then(function(response) {
          vm.data.equipment.personal = response.personal;
        });
      });
    }

    function addGroupEquipment(equipment) {
      vm.groupEquipmentToAdd = '';
      TripService.addGroupEquipment(equipment, vm.data.info.id)
      .then(function() {
        TripService.getGroupEquipment(vm.data.info.id)
        .then(function(response) {
          vm.data.equipment.group = response.group;
        });
      });
    }

    function removeEquipment(equipment) {
      TripService.removeEquipment(equipment)
      .then(function() {
        refreshEquipment(equipment);
      });
    }

    function claimEquipment(equipment) {
      TripService.claimEquipment(equipment)
      .then(function() {
        refreshEquipment(equipment);
      });
    }

    function unclaimEquipment(equipment) {
      TripService.unclaimEquipment(equipment)
      .then(function() {
        refreshEquipment(equipment);
      });
    }
    //refreshes current local data to match new database information
    function refreshEquipment(equipment) {
      if(equipment.is_group) {
        TripService.getGroupEquipment(vm.data.info.id)
        .then(function(response) {
          vm.data.equipment.group = response.group;
        });
      } else {
        TripService.getPersonalEquipment(vm.data.info.id)
        .then(function(response) {
          vm.data.equipment.personal = response.personal;
        });
      }
    }

    //menu functions
    function getMenu() {
        TripService.getMenu(vm.data.info.id, vm.data.info.date).then(function(response){
        vm.menu = response;
      })
    }

    function menuToArray(menu) {
      for (var i = 0; i < menu.length; i++) {

      }
    }

    //toggles menu editing buttons
    function editMenu() {
      if (vm.menuEdit) {
        vm.menuEdit = false;
      } else {

        vm.menuEdit = true;
      }
    }

    //toggles input in specified day to add item
    function toggleAdd(day, meal) {
      var tempShow = day[meal].show;
      for (var i = 0; i < vm.menu.length; i++) {
        vm.menu[i].breakfast.show = false;
        vm.menu[i].lunch.show = false;
        vm.menu[i].dinner.show = false;
      }
      day[meal].show = tempShow;
      vm.addMenuItem = null;
      vm.addMenuQty = null;
      if(!day[meal].show) {
        day[meal].show = true;
      } else {
        day[meal].show = false;
      }
    }

    function removeMenuItem(day, meal, item) {
      console.log(day, meal, item);
      var data = {};
      data.day = day;
      data.meal = meal;
      data.item = item.itemId;
      console.log(data);
      TripService.removeMenuItem(vm.data.info.id, data).then(function(){
        console.log('Getting updated menu');
        getMenu();
      });
    }

    function addItem(meal, day, item) {
      var data = {};
      data.meal = meal;
      data.day = day;
      data.item = item;
      TripService.addMenuItem(vm.data.info.id, data).then(function(response){
        console.log('anything?');
        getMenu();
      });
    }

    getMenu();

    //message board
    function deleteMessage(id) {
      TripService.deleteMessage(id).then(function() {
        TripService.getMessages(vm.data.info.id).then(function(response) {
          vm.data.messages = response.data;
        });
      });
    }

    function sendMessage(message) {
      vm.addMessage = null;
      var sendData = {};
      sendData.message = message;
      sendData.timeStamp = new Date();
      sendData.tripId = vm.data.info.id;
      TripService.sendMessage(sendData).then(function() {
        TripService.getMessages(vm.data.info.id).then(function(response) {
          vm.data.messages = response.data;
        });
      });
    }

    //profile functions
    function getUserProfile(user) {
      console.log('Working?');
      vm.tempProfile = {};
      vm.tempProfile.username = user.username;
      vm.tempProfile.email = user.email;
      vm.tempProfile.phone = user.phone;
      vm.profileView = true;
    }

    function preventClose() {
      vm.prevent = true;
    }

    function closeProfile(){
      if (!vm.prevent) {
        vm.tempProfile = {};
        vm.profileView = false;
      }
      vm.prevent = false;
    }



  }//end UserInfoController
})();
