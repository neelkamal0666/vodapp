var app = angular.module('VODApp', [
    'ngRoute','angular-sly','starter.services'
]);
/**
 * Configure the Routes
 */
app.config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
    $routeProvider
        .when("/", {templateUrl: "partials/home.html", controller: "IndexCtrl"})
        .otherwise("/404", {templateUrl: "partials/404.html", controller: "IndexCtrl"});
    //$locationProvider.html5Mode(true);
}]);

/**
 * Controls  Pages
 */
app.controller('IndexCtrl', function ( $scope, $location, $http,$sce,$timeout, RestService) {
    $scope.setUserId = function(){
        if(window.localStorage.getItem("userId")){
            $scope.userId = window.localStorage.getItem("userId");
        } else {
            $scope.userId = Math.floor(Date.now());
            window.localStorage.setItem("userId", $scope.userId);
        }

    }
    $scope.getVideos = function() {
        $scope.view_type = "videos";
        $scope.histories =[];
        RestService.getData(api_url).success(function (data) {
            if(data.entries) {
                console.log(data);
                $scope.videos = data.entries;
            }
            document.getElementById('data_loader').innerHTML = '';
            $scope.Message = "";
        }).error(function (data) {
            $scope.Message = "Failed to load videos. Please try again.";
            document.getElementById('data_loader').innerHTML = '';
        });
    }

    angular.element(document).ready(function () {
        $scope.site_url = site_url;
        $scope.getVideos();
        $scope.setUserId();
    });
    $scope.refreshHome = function(){
        location.reload();
    }
    $scope.generateSrc = function (file) {
        //console.log(file);
        if (!!file) {
            return $sce.trustAsResourceUrl(file);
        }
    };

    $scope.getHistory = function(){
        $scope.videos =[];
        $scope.view_type = "history";
        RestService.getData(history_api_url + '/'+ $scope.userId).success(function (data) {
            var arr = Object.keys(data).map(function (key) { return data[key]; });
            console.log(arr);
            $scope.histories = arr;
            if(arr.length ==0){
                $scope.history_message = "No history found.";
            }
            document.getElementById('history_loader').innerHTML = '';
        }).error(function (data) {
            $scope.history_message = "Failed to history. Please try again.";
            document.getElementById('history_loader').innerHTML = '';
        });
    }


    $scope.saveHistory = function(id, title, image_url, video_url){
        var data_string = {};
        data_string.title = title;
        data_string.poster_url = image_url;
        data_string.video_url = video_url;
        data_string.userId = $scope.userId;
        data_string.id = id;
        RestService.postData(history_api_url,data_string).success(function (data) {
            console.log(data);
        }).error(function (data) {
            console.log(data);
        });
    }

    $scope.activateListener = function(index,id, title, image_url, video_url){
        if(!document.getElementById("title_"+index)){
            return 0;
        }
        var player1 = videojs('#video_'+index).ready(function() {
            this.hotkeys({
                volumeStep: 0.1,
                seekStep: 5,
                enableModifiersForNumbers: false
            });
        });
        var options = {};

        var player = videojs('#video_'+index, options, function onPlayerReady() {
            // videojs.log('Your player is ready!');

            // In this context, `this` is the player that was created by Video.js.
            // this.play();

            // How about an event listener?
            this.on('firstplay', function(){
                //alert('firstplay');
                console.log("first play");
                $scope.saveHistory(id, title, image_url, video_url);
            });
            this.on('ended', function() {
                videojs.log('Awww...over so soon?!');
            });
        });
    }


    $scope.keyPressed = function (keyEvent) {
        console.log(keyEvent.keyCode);
        if (keyEvent.keyCode == 13) {
            console.log('presiono enter');
            document.getElementsByClassName('active');
        }
    };

})