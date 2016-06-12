angular.module("timeline", ['angular-thumbnails'])
        
.controller("TimelineCtrl", function ($scope, $http) {
    
    $scope.COMMENT = 0;
    $scope.IMAGE = 1;
    $scope.CONF = 2;
    
    $scope.timeline = [
        {
            type: 0, 
            date: 1288323623006, 
            text: "Hand watered the plant, added 15 drops of pH Down to a gallon of water\n\
                    to achieve a pH of 6.0. The pH of runoff was approx. 7.0."
        },
        
        {
            type: 1, 
            date: 1288323623006, 
            text: "Ran into an issue with my tomatoes before transplanting.  These\n\
                    guys grew quick and ran out of space before we could plant them\n\
                    outside.", 
            image: "http://i.imgur.com/L55aAGA.jpg"
        },
        
        {
            type: 2, 
            date: 1288323623006, 
            list: [
                "Minimum temperature changed from 65 to 68", 
                "Irrigation halted", 
                "Light halted"
            ]
        },
        
        {
            type: 1, 
            date: 1288323623006, 
            title: "Image uploaded", 
            image: "http://i.imgur.com/Jqr0D1V.jpg"
        }
    ];
    
    $scope.getFontAwesome = function(line)
    {
        
        switch(line.type) {
            case $scope.COMMENT:
                return "fa-paragraph";
            case $scope.IMAGE:
                return "fa-camera";
            case $scope.CONF:
                return "fa-info-circle";
        }  
        
        return "";
    }
    
    $scope.getBadgeColor = function(line)
    {
        
        switch(line.type) {
            case $scope.COMMENT:
                return "warning";
            case $scope.IMAGE:
                return "success";
            case $scope.CONF:
                return "info";
        }  
        
        return "";
    }
})

.directive("timeline", function() {
  return {
    templateUrl: 'html/timeline.html'
  };
});

angular.element(document).ready(function() {
  angular.bootstrap(document.getElementById("timeline"), ["timeline"]);
});