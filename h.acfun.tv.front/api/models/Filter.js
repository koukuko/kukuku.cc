/**
 * Filter.js
 *
 * @description :: 过滤器
 */

module.exports = {

    attributes: {
        type: {
            type: 'string',
            required: true
        },
        rule: {
            type: 'string',
            required: true
        },
        expires: {
            type: 'datetime',
            required: true
        }
    },

    rulesList: {},

    /**
     * 初始化过滤器
     */
    exportToGlobal:function(){

        var deferred = Q.defer();

        sails.models.filter.find()
            .exec(function(err,rules){
                if (err) {
                    deferred.reject(err);
                } else {

                    var rulesList = {};

                    for(var i in rules){
                        var rule = rules[i];

                        if(rulesList[rule.type]){
                            rulesList[rule.type].push(rule.rule);
                        } else {
                            rulesList[rule.type] = [rule.rule];
                        }

                    }

                    sails.models.filter.rulesList = rulesList;

                    deferred.resolve(rulesList);
                }
            });

        return deferred.promise;
    },

    /**
     * 检查是否被过滤
     */
    test:{
        ip:function(data){

            var ruleList = sails.models.filter.rulesList.ip;

            if(!data){
                return false;
            }

            var data = data.toString();

            if(!ruleList){
                return false;
            }

            for(var i in ruleList){

                var rule = ruleList[i];
                rule = RegExp(rule.replace(/\./g,'\\.').replace(/\*/g,'\\d+'));

                if(rule.test(data)){
                    return true;
                }

            }

            return false;
        },
        userId: function(data){

            var ruleList = sails.models.filter.rulesList.userId;

            if(!data){
                return false;
            }

            var data = data.toString();

            if(!ruleList){
                return false;
            }

            for(var i in ruleList){

                var rule = ruleList[i];
                if(data == rule){
                    return true;
                }

            }

            return false;
        },
        word: function(data){

            var ruleList = sails.models.filter.rulesList.word;

            if(!data){
                return false;
            }

            var data = data.toString().replace(/\s/g, "");

            if(!ruleList){
                return false;
            }

            for(var i in ruleList){

                var rule = ruleList[i];

                if(data.indexOf(rule) >= 0){
                    return true;
                }

            }

            return false;

        },
        location: function(data){
            return false;
        },
        imagemd5: function(data){

            var ruleList = sails.models.filter.rulesList.imagemd5;

            if(!data){
                return false;
            }

            var data = data.toString();

            if(!ruleList){
                return false;
            }

            for(var i in ruleList){

                var rule = ruleList[i];
                if(data == rule){
                    return true;
                }

            }

            return false;
        }
    }
};

