(function() {

uiRouter.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

angular.module('planVentureApp').config(uiRouter, ngMaps);

function ngMaps(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyCzFyDKBzayeWKY35PiAIbP7ToySvY-Txo',
      v: '3.20',
      libraries: 'weather,geometry,visualization'
    });
}

function uiRouter($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise('login');

  $stateProvider
    .state('index', {
      url: '/',
      templateUrl: '/components/common/main.html',
      resolve: {
        function($state, UserService) {
          UserService.currentUser().then(function(response) {
            if(response.id) {
              console.log(response);
              $state.go('trips');
            }
          })
        }
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/components/user/login.html',
      controller: 'LoginController',
      controllerAs: 'log',
      resolve: {
        function($state, UserService) {
          UserService.currentUser().then(function(response) {
            if(response.id) {
              console.log(response);
              $state.go('trips');
            }
          })
        }
      }
    })
    .state('register', {
      url: '/register',
      templateUrl: '/components/user/register.html',
      controller: 'RegisterController',
      controllerAs: 'reg'
    })
    .state('trips', {
      url: '/trips',
      templateUrl: '/components/trips/list.html',
      controller: 'TripsListController',
      controllerAs: 'trips',
      resolve: {
        function($state, UserService) {
          UserService.currentUser().then(function(response) {
            if(!response.id) {
              $state.go('login')
            }
          })
        }
      }
    })
    .state('trip', {
      abstract: true,
      url: '/trip/:tripId',
      templateUrl: '/components/trips/trip.html',
      controller: 'TripInfoController',
      controllerAs: 'trip',
      resolve: {
        trip: function($stateParams, $state, TripService, UserService) {
          return UserService.currentUser().then(function(user) {
            if(!user.id) {
              $state.go('login')
            } else {
              return TripService.getOverview($stateParams.tripId).then(function(trip) {
                for (var i = 0; i < trip.users.length; i++) {
                  if(trip.users[i].user_id === user.id) {
                    return trip;
                  }
                }
                $state.go('trips');
              });
            }
          });
        },
        tripId: function($stateParams) {
          return $stateParams.tripId;
        },
        print: function($stateParams, TripService) {
            return TripService.getMenu($stateParams.tripId);
        }
      }
    })
    .state('trip.overview', {
      url: '/overview',
      templateUrl: '/components/trips/detail.html'
    })
    .state('trip.equipment', {
      url: '/equipment',
      templateUrl: '/components/trips/equipment.html'
    })
    .state('trip.menu', {
      url: '/menu',
      templateUrl: '/components/trips/menu.html'
    })
    .state('trip.map', {
      url: '/map',
      templateUrl: '/components/trips/map.html'
    })
    .state('trip.print', {
      url: '/print',
      templateUrl: '/components/trips/print.html',
      controller: 'PrintController',
      controllerAs: 'print',
      resolve: {
        print: function($stateParams, TripService) {
          return TripService.getMenu($stateParams.tripId);
        }
      }
    })
    .state('user', {
      url: '/user',
      abstract: true,
      templateUrl: '/components/user/user.html',
      controller: 'UserController',
      controllerAs: 'user'
    })
    .state('user.preferences', {
      url: '/preferences',
      templateUrl: '/components/user/preferences.html'
    })
    .state('user.createTrip', {
      url: '/create',
      templateUrl: '/components/trips/create.html',
      controller: 'CreateTripController',
      controllerAs: 'create',
      resolve: {
        trips: function(TripService) {
          return TripService.getTrips();
        }
      }
    })
    .state('joinTrip', {
      url: '/join/:id',
      templateUrl: '/components/trips/join.html',
      controller: 'JoinTripController',
      controllerAs: 'join',
      resolve: {
        tripId: function($stateParams, $state, UserService) {
          return UserService.currentUser().then(function(response) {
            console.log(response);
            if(!response.id) {
              $state.go('login');
            } else {
              return $stateParams.id;
            }
          })
        }
      }
    });

  $locationProvider.html5Mode(true);
}

})();
