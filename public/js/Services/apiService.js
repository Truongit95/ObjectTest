(function() {
    'use strict'

    angular
        .module('user')
        .factory('apiService', apiService)

    apiService.$inject = ['$http']

    function apiService($http) {
        var service = {
            apiGet: apiGet,
            apiPost: apiPost
        }
        var urld = 'http://104.198.181.185:3000';

        function apiGet(url, config, successCallback, errorCallback) {
            return $http.get(urld + url, config).then(successCallback, errorCallback);
        }

        function apiPost(url, data, config, successCallback, errorCallback) {
            return $http.post(urld + url, data, config).then(successCallback, errorCallback);
        }
        return service;
    }

})()