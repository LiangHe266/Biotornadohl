'use strict';

window.baseUrl  = getBaseUrl();

var firstApp=angular.module( 'firstApp', [
    'ngRoute',
    'ngResource',
    'ngSanitize',
    'angularFileUpload',
    'CommonServices',
    'meunsManageControllers',
    'editMeunControllers',
    'editMeunItemControllers',
    'meunsAutGroupManageControllers',
    'indexControllers',
    'meunsAutUserControllers',
    'meunsAutUserGroupControllers',
    'fileControllers',
    'OperationLogControllers',
    'accountManageControllers',
    'addAccountControllers',
    'updateAccountControllers',
    'updateAccountpasswordControllers',
    'notifyControllers',
    'medcaseControllers',
    'tmControllers',
    'MainAcManageControllers',
    'updatePasswordControllers',
    'blastControllers',
    'UsemodelControllers',
    'NewmodelControllers',
    'GenControllers',
    'RnaControllers',
    'sequenceControllers',
    'sequencedetailControllers',
    
    
    
    
    
]);

  //通过a 链接的页面，这里来设定。
firstApp.config(['$routeProvider','$httpProvider','$locationProvider',function($routeProvider,$httpProvider,$locationProvider) {
    $routeProvider
        .when('/menus_manage', {
            title: '菜单管理',
            templateUrl: './views/menu/menus_manage.html',
            controller: 'meunsManageCtrl'
        }).when('/edit_menu_item', {
            title: '编辑菜单项',
            templateUrl: './views/menu/edit_menu_item.html',
            controller: 'editMeunItemCtrl'
        }).when('/edit_menu', {
            title: '编辑菜单',
            templateUrl: './views/menu/edit_menu.html',
            controller: 'editMeunCtrl'
        }).when('/menus_aut_group_manage', {
            title: '菜单权限组管理',
            templateUrl: './views/menu/menus_aut_group_manage.html',
            controller: 'meunsAutGroupManageCtrl'
        }).when('/menus_aut_user', {
            title: '菜单权限管理',
            templateUrl: './views/menu/menus_aut_user.html',
            controller: 'meunsAutUserCtrl'
        }).when('/menus_aut_user_group', {
            title: '用户菜单组',
            templateUrl: './views/menu/menus_aut_user_group.html',
            controller: 'meunsAutUserGroupCtrl'
        }).when("/tmNew", {
            title: "文件上传",
            templateUrl: "./views/tm/new.html",
            controller: "tmNewCtrl"
        }).when('/operationLog', {
            title: '操作日志',
            templateUrl: './views/operation_log/operation_log.html',
            controller: 'OperationLogCtrl'
        }).when('/check_operationLog', {
            title: '查看操作日志',
            templateUrl: './views/operation_log/check_operationLog.html',
            controller: 'OperationLogCtrl'
        }).when('/account_manage', {
            title: '账户管理',
            templateUrl: './views/account_manage/account_management.html',
            controller: 'accountManageCtrl'
        }).when('/add_account', {
            title: '新增账户',
            templateUrl: './views/account_manage/add_account.html',
            controller: 'addAccountCtrl'
        }).when('/update_account', {
            title: '修改账户信息',
            templateUrl: './views/account_manage/update_account.html',
            controller:'updateAccountCtrl'
        }).when('/update_accountpassword', {
            title: '修改账户密码',
            templateUrl: './views/account_manage/update_accountpassword.html',
            controller:'updateOtherAccountpasswordCtrl'
        }).when('/todo', {
            title: '研究进展',
            templateUrl: './views/notification/todoList.html',
            controller: 'todoCtrl'
        }).when('/message', {
            title: '消息通知',
            templateUrl: './views/notification/msgList.html',
            controller: 'msgCtrl'
        }).when("/caseList", {
            title: "案例中心",
            templateUrl: "./views/medcase/list.html",
            controller: "caseListCtrl"
        }).when("/case_download", {
            title: "案例下载",
            templateUrl: "./views/medcase/case_download.html",
            controller: "caseDownloadCtrl"
        }).when("/case_upload", {
            title: "案例上传",
            templateUrl: "./views/medcase/case_upload.html",
            controller: "caseUploadCtrl"
        }).when("/case_collect", {
            title: "案例收藏",
            templateUrl: "./views/medcase/case_collect.html",
            controller: "caseCollectCtrl"
        }).when("/caseDetail", {
            title: "案例详情",
            templateUrl: "./views/medcase/detail.html",
            controller: "caseDetailCtrl"
        }).when("/caseNew", {
            title: "新建案例",
            templateUrl: "./views/medcase/new.html",
            controller: "caseNewCtrl"
        }).when("/case_approval_list", {
            title: "案例审批列表",
            templateUrl: "./views/medcase/case_approval_list.html",
            controller: "caseApprovalListCtrl"
        }).when("/case_approval_detail", {
            title: "案例审批详情",
            templateUrl: "./views/medcase/case_approval_detail.html",
            controller: "caseApprovalDetailCtrl"
        }).when("/case_reject_detail", {
            title: "案例未通过详情",
            templateUrl: "./views/medcase/case_reject_detail.html",
            controller: "caseRejectDetailCtrl"
        }).when("/case_modify", {
            title: "案例修改",
            templateUrl: "./views/medcase/case_modify.html",
            controller: "caseModifyCtrl"
        }).when('/account_info',{
            title:'我的账号信息',
            templateUrl:'./views/patient_account/account_info.html',
            controller:'myInfoCtrl'
        }).when('/edit_account_info',{
            title:'编辑账号信息',
            templateUrl:'./views/patient_account/edit_account_info.html',
            controller:'editMyInfoCtrl'
        }).when('/change_password',{
            title:'修改密码',
            templateUrl:'./views/patient_account/change_password.html',
            controller:'updateAccountpasswordCtrl'
        }).when('/newmodel', {
            title: '创建新模型',
            templateUrl: './views/data_mining/newmodel.html',
            controller:'NewmodelCtrl'
        }).when('/usemodel', {
            title: '使用模型',
            templateUrl: './views/data_mining/usemodel.html',
            controller: 'UsemodelCtrl'
        }).when('/blast',{
            title:'BLAST系统',
            templateUrl:'./views/BLAST/blast.html',
            controller:'blastCtrl'
        }).when('/rna', {
            title: '生物染色体可视化',
            templateUrl: './views/graphics/rna.html',
            controller: 'RnaCtrl' 
        }).when('/Gen', {
            title: '基因组可视化',
            templateUrl: './views/graphics/gen.html',
            controller: 'GenCtrl' 
        }).when("/sequence", {
            title: "生物序列处理",
            templateUrl: "./views/sequence/list.html",
            controller: "sequenceCtrl"
        }).otherwise({
            redirectTo: '/todo'
        });
    //跨域
    $httpProvider.defaults.useXDomain = true;

    delete $httpProvider.defaults.headers.common['X-Requested-With'];
    $httpProvider.defaults.headers.common['Content-Type']= 'application/json';
    $httpProvider.defaults.headers.common['app-key']='fb98ab9159f51fd0'; //(key)
    //$httpProvider.defaults.headers.common['Authorization']='12345678'; //(key)

}]);

firstApp.filter('formatTime',function(){
    return function(sec){
        var min=parseInt(sec/60);
        min=min<10?"0"+min:min;
        var second=sec%60;
        second=second<10?"0"+second:second;
        return min+":"+second;
    }
});

firstApp.factory('mainAppInstance', function() {
    return {
        data:""
    }
});

firstApp.run(['$location', '$rootScope', function($location, $rootScope) {
    $rootScope.$on('$routeChangeSuccess', function(currentRoute, routes) {
        if(routes.$$route){
	        $rootScope.title = routes.$$route.title;
	        document.title = routes.$$route.title;
        }
    });
    $rootScope.$on('$locationChangeStart', function(event, newUrl){
        //console.log(newUrl);
        //var urls=newUrl.split('#');
        //window.location.href=urls[0]+"#/authorizer";
        //event.preventDefault();  //阻止页面切换
    });
}]);
