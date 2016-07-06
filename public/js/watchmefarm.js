define([
    '../user/user',
    'irrigation',
    'notifications',
    'settings',
    'timeline'
],

  function(user, irrigation, notifications, settings, timeline){
      
    // Create the base module for the page
    var wmf = angular.module('watchmefarm', ['chart.js', 'angular-thumbnails', 'ui.bootstrap']);
    
    // Init the controllers, directives, and services for all the components
    // on the page
    user.init(wmf);
    irrigation.init(wmf);
    notifications.init(wmf);
    settings.init(wmf);
    timeline.init(wmf);
    
    // Bootstrap the page
    angular.bootstrap(document, ['watchmefarm']);
});