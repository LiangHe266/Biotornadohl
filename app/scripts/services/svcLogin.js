'use strict';

/* Services */

var LoginServices = angular.module('LoginServices', ['ngResource']);

LoginServices.factory('loginService', ['$http',function($http){
    var baseUrl  = getBaseUrl() + 'login/';
    
    return {
        getToken: function (uri, funSuccess, funError) {
            $http({
                method: "GET",
                headers:{'app-secret':'09f7c8cba635f7616bc131b0d8e25947s'},
                url: baseUrl+uri
            }).success(funSuccess).error(funError);
        }
    }
}]);
