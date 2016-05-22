angular.module("notifications", [])
        
.controller("NotificationsCtrl", function ($scope, $http) {
    $scope.notifications = {
        
        data: [
            {name:"Fans",value:"0",date:1288323623006 },
            {name:"Light",value:"0",date:1288323623006 },
            {name:"Fans",value:"1",date:1288323623006},
            {name:"Light",value:"1",date:1288323623006 },
            {name:"Water Valve",value:"0",date:1288323623006}
        ],
        
        pageIndex: 0,
        pageLength: 5,
        curPage: 0,
        
        minPage: function(){
            return this.data.length > 0 ? 0 : 1;
        },
        
        maxPage: function(){
            return this.data.length - 1;
        },
        
        nextPage: function(){
            if(this.maxPage() > this.pageIndex)
            {
                this.pageIndex++;
                this.curPage = this.pageIndex * this.pageLength;
                console.log(this.curPage);
            }
        }, 
        
        prevPage: function(){
            if(this.minPage() < this.pageIndex)
            {
                this.pageIndex--;
                this.curPage = this.pageIndex * this.pageLength;
                console.log(this.curPage);
            }
        }
    };
})

.directive("notifications", function() {
  return {
    templateUrl: 'html/notifications.html'
  };
});

angular.element(document).ready(function() {
  angular.bootstrap(document.getElementById("notifications"), ["notifications"]);
});