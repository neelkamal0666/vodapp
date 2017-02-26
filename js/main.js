var app = angular.module('VODApp', [
  'ngRoute','angular-sly'
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
app.controller('IndexCtrl', function ( $scope, $location, $http,$sce,$timeout) {
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
        console.log(api_url);
        $http.get(api_url).
            success(function (data, status, headers, config) {
                if(data.entries) {
                    console.log(data);
                    $scope.videos = data.entries;
                }
                document.getElementById('data_loader').innerHTML = '';
                $scope.Message = "";
            }).
            error(function (data, status, headers, config) {
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

    $scope.getVideoLink = function(content){
        console.log(content[0].url);
        return $sce.trustAsResourceUrl(content[0].url);
    }

    $scope.getHistory = function(){
        $scope.videos =[];
        console.log("history");
        console.log($scope.userId);
        console.log(history_api_url + '/'+ $scope.userId);
        $scope.view_type = "history";
        $http.get(history_api_url + '/'+ $scope.userId).
            success(function (data, status, headers, config) {
                var arr = Object.keys(data).map(function (key) { return data[key]; });
                console.log(arr);
                $scope.histories = arr;
                if(arr.length ==0){
                    $scope.Message = "No history found.";
                }
                document.getElementById('history_loader').innerHTML = '';
            }).
            error(function (data, status, headers, config) {
                $scope.Message = "Failed to history. Please try again.";
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
        console.log("save history");

        $http.post(history_api_url, JSON.stringify(data_string)).
            success(function(data, status, headers, config) {
                console.log(data);
            }).
            error(function(data, status, headers, config) {

            });
    }

    $scope.activateListener = function(index,id, title, image_url, video_url){
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
    $scope.capture = function(){
        console.log("viewed");
    }

    $scope.keyPressed = function (keyEvent) {
        console.log(keyEvent.keyCode);
        if (keyEvent.keyCode == 13) {
            alert('presiono enter');
            console.log('presiono enter');
        }
    };



   /* $timeout(function(){
        var id =1;
        videojs('#video_'+id).ready(function() {
            this.hotkeys({
                volumeStep: 0.1,
                seekStep: 5,
                enableModifiersForNumbers: false
            });
        });
    }, 5000); */

    /*var player = videojs('myvideos', options, function onPlayerReady() {
        videojs.log('Your player is ready!');

        // In this context, `this` is the player that was created by Video.js.
        this.play();

        // How about an event listener?
        this.on('ended', function() {
            videojs.log('Awww...over so soon?!');
        });
    }); */




})
