(function() {
angular
  .module('planVentureApp', ['ui.router', 'uiGmapgoogle-maps', 'angularMoment', 'ngAnimate', 'ui.bootstrap', 'monospaced.elastic'])
  .run(function(amMoment) {
    amMoment.changeLocale('en');
  });
})();
