'use strict';

/**
 *
 *  @模块名称: Common Services
 *  @版 本 号: V1.0.0
 *  @作    者: Xu Kun
 *  @作者邮件:
 *  @修改日期: 2014-08-15
 *  @版本描述:
 *
 */

function getAuthToken() {
	return sessionStorage.getItem('authToken');
}

var CommonServices = angular.module('CommonServices', []);
//定义通用服务：CommonService
CommonServices.factory('CommonService', ['$http', function ($http) {

    //var baseUrl='http://192.168.1.210:8099';
    //var baseUrl = 'http://localhost:8000';
    //var baseUrl='http://192.168.192.223:8081/ckd/';
    //baseUrl='http://127.0.0.1:8081/ckd/';
    //baseUrl='http://192.168.1.103:8081';

    var testBaseUrl = 'http://localhost:8080/app';


    //定义通用服务CommonService提供的方法
    return {


        //1.Get all obj
        getAll: function(uri, data, funSuccess, funError) {
            if (data != undefined) {
                return $http({
                    method: "GET",
                    headers: {'Authorization': getAuthToken()},
                    url: window.baseUrl + uri + '?' + data
                }).success(funSuccess).error(funError);
            } else {
                return $http({
                    method: "GET",
                    headers: {'Authorization': getAuthToken()},
                    url: window.baseUrl + uri
                }).success(funSuccess).error(funError);
            }
        }
        ,

        //2.Get one obj
        getOne: function (uri, data, funSuccess, funError) {
            if (data != undefined) {
                return $http({
                    method: "GET",
                    headers: {'Authorization': getAuthToken()},
                    url: window.baseUrl + uri + '?' + data
                }).success(funSuccess).error(funError);
            } else {
                return $http({
                    method: "GET",
                    headers: {'Authorization': getAuthToken()},
                    url: window.baseUrl + uri
                }).success(funSuccess).error(funError);
            }
        }
        ,

        //3.Update one obj
        updateOne: function (uri, data, funSuccess, funError) {
            var baseUrl = window.baseUrl;
            //alert("执行："+baseUrl + uri);
            if (data != undefined) {
                console.log("客户端向服务器端传递的数据：" + data);
                return $http({
                    method: "PUT",
                    url: window.baseUrl + uri,
                    headers: {'Authorization': getAuthToken()},
                    data: data    /*从页面提交的数据，保存在http data域*/
                }).success(funSuccess).error(funError);
            }
        }
        ,

        //4.Update part of one obj
        updatePartOne: function (uri, data, funSuccess, funError) {
            var baseUrl = window.baseUrl;
            if (data != undefined) {
                return $http({
                    method: "patch",
                    url: window.baseUrl + uri,
                    headers: {'Authorization': getAuthToken()},
                    data: data    /*从页面提交的数据，保存在http data域*/
                }).success(funSuccess).error(funError);
            }
        }
        ,

        //5.Delete one
        deleteOne: function (uri, data, funSuccess, funError) {
            if (data != undefined) {
                return $http({
                    method: "DELETE",
                    headers: {'Authorization': getAuthToken()},
                    url: window.baseUrl + uri,
                    data: data
                }).success(funSuccess).error(funError);
            } else {
                return $http({
                    method: "DELETE",
                    headers: {'Authorization': getAuthToken()},
                    url: window.baseUrl + uri
                }).success(funSuccess).error(funError);
            }
        }
        ,

        //6.Add new one
        createOne: function (uri, data, funSuccess, funError) {
            if (data != undefined) {
                return $http({
                    method: "POST",
                    headers: {'Authorization': getAuthToken()},
                    url: window.baseUrl + uri,
                    //url: baseUrl + 'test',
                    data: data        /*从页面提交的数据，保存在http data域*/
                }).success(funSuccess).error(funError);
            }
        }
        ,
        //7.get data from json file
        getJson: function (uri, data, funSuccess, funError) {
            if (data != undefined) {
                return $http({
                    method: "GET",
                    headers: {'Authorization': getAuthToken()},
                    url: testBaseUrl + uri + '.json',
                    dataType: 'json'
                }).success(funSuccess).error(funError);
            } else {
                return $http({
                    method: "GET",
                    headers: {'Authorization': getAuthToken()},
                    url: uri + '.json',
                    dataType: 'json'
                }).success(funSuccess).error(funError);
            }
        }
        ,

        //8.save form data to json file
        createJson: function (uri, data, funSuccess, funError) {
            if (data != undefined) {
                return $http({
                    method: "POST",
                    headers: {'Authorization': getAuthToken()},
                    url: uri + '.json',
                    data: JSON.stringify(data), /*从页面提交的数据，保存在http data域*/
                    contentType: 'application/json; charset=utf-8'
                }).success(funSuccess).error(funError);
            }
        }
        ,

        heartbeat: function () {
            return $http({
                method: "GET",
                headers: {'Authorization': getAuthToken()},
                url: window.baseUrl + "login/heartbeat"
            }).success(function(){
                // 重置cookie
                var Authorization=getAuthToken()
                cookieOperate.setCookie('authToken',Authorization);
            }).error(function (data, status) {
                // 跳转到login
                if (status == 401) {
                    window.location.href = "/login.html"
                }
            });
        }
    }
}]);


