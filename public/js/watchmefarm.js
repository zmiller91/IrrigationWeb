define([
    '../lib/js-common/user/user',
    'charts',
    'notifications',
    'components',
    'activities',
    'journal',
    'functions',
],

  function(user, charts, notifications, components, activities, journal){
      
    // Create the base module for the page
    var wmf = angular.module('watchmefarm', ['chart.js', 'ui.bootstrap', 'btorfs.multiselect']);
    
    // Init the controllers, directives, and services for all the components
    // on the page
    user.init(wmf);
    charts.init(wmf);
    notifications.init(wmf);
    components.init(wmf);
    activities.init(wmf);
    journal.init(wmf);
    
    // Bootstrap the page
    angular.bootstrap(document, ['watchmefarm']);
});