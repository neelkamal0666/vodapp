angular.module('starter.services', ['ngResource'])
    .factory('RestService', function($q, $http) {
        return {
            getData : function(api_url){
                return $http.get(api_url).
                    success(function(data, status, headers, config) {
                    }).
                    error(function(data, status, headers, config) {
                    });
            },
            postData: function(api_url, data_string) {
                $http.post(api_url, JSON.stringify(data_string)).
                    success(function(resultData, status, headers, config) {

                    }).
                    error(function(data, status, headers, config) {

                    });
            }
        }
    })
