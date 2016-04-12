'use strict';

var Dicts = {};
var dictLoaded = false;

function parseDict(data, dictName) {
	var dicts;
	dicts = listToObject(data[dictName], 'rows').rows;
	Dicts[dictName] = dicts;
	appCache.setObject('dict_' + dictName, dicts);
}

function loadDict(dictName) {
	var dicts;
	var dicts = appCache.getObject('dict_' + dictName);
	if (dicts) {
	Dicts[dictName] = dicts;
	}
}

angular.module('DictServices', [])
.factory('DictService', ['CommonService', function (CommonService) {

    return {
        getDicts: function (reload) {
        	loadDict('SEX');
        	loadDict('STATUS');
        	loadDict('TM_USER_ROLE');

        	if (reload || !dictLoaded) {
	        	CommonService.getAll('dict/STATUS,SEX,TM_USER_ROLE', '', function(data){
	        		parseDict(data, 'SEX');
	        		parseDict(data, 'STATUS');
	        		parseDict(data, 'TM_USER_ROLE');
	        		dictLoaded = true;
				}, function(){
					console.log('dict error');
				})
        	}
        	return Dicts;
        },
        getDict: function (name, reload) {
        	if (reload || !Dicts[name]) {
	        	CommonService.getAll('dict/' + name, '', function(data){
	        		Dicts[name] = 'pppp';
				}, function(){
					console.log('dict error');
	        		Dicts[name] = 'failed';
				})
			}
        	return Dicts;
        }
    }
}]);

