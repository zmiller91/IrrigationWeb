define([], function() {
    return {
        init: function(app) {
            app.controller("TimelineCtrl", function ($scope, $http) {
                $scope.COMMENT = 0;
                $scope.IMAGE = 1;
                $scope.CONF = 2;

                $scope.timeline = [
                    {
                        id: 1,
                        type: 0, 
                        date: 1288323623006, 
                        text: "Hand watered the plant, added 15 drops of pH Down to a gallon of water\n\
                                to achieve a pH of 6.0. The pH of runoff was approx. 7.0."
                    },

                    {
                        id: 2,
                        type: 1, 
                        date: 1288323623006, 
                        text: "Ran into an issue with my tomatoes before transplanting.  These\n\
                                guys grew quick and ran out of space before we could plant them\n\
                                outside.", 
                        image: "http://i.imgur.com/L55aAGA.jpg"
                    },

                    {
                        id: 3,
                        type: 2, 
                        date: 1288323623006, 
                        list: [
                            "Minimum temperature changed from 65 to 68", 
                            "Irrigation halted", 
                            "Light halted"
                        ]
                    },

                    {
                        id: 4,
                        type: 1, 
                        date: 1288323623006, 
                        title: "Image uploaded", 
                        image: "http://i.imgur.com/Jqr0D1V.jpg"
                    }
                ];

                $scope.canvas = [];

                angular.element(document).ready(function() {

                    for(var line in $scope.timeline){

                        line = $scope.timeline[line];

                        if(line.type === 1) {
//                            var img = new Image();
//                            img.src = line.image;
//
//                            var canvas = document.getElementById(line.id.toString());
//                            var ctx = canvas.getContext("2d");
//
//                            canvas.height = canvas.width * (img.height / img.width);
//
//                            /// step 1
//                            var oc = document.createElement('canvas'),
//                                octx = oc.getContext('2d');
//
//                            oc.width = img.width * 0.5;
//                            oc.height = img.height * 0.5;
//                            octx.drawImage(img, 0, 0, oc.width, oc.height);
//
//                            /// step 2
//                            octx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5);
//
//                            ctx.drawImage(oc, 0, 0, oc.width * 0.5, oc.height * 0.5,
//                            0, 0, canvas.width, canvas.height);
                        }
                    }
                });

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
        }
    };
});