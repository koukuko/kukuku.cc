/**
 * SettingController
 *
 * @module      :: Controller
 * @description    :: 系统配置
 */

var async = require('async');

module.exports = {


    _config: {},

    index: function (req, res) {
        res.view('system/setting/index',{
            page:{
                name:'系统配置',
                desc:'System Settings'
            }
        });
    },

    update: function (req, res) {

        var map = [];
        for(var key in req.body){
            var value = req.body[key];
            if(typeof H.settings[key] == 'undefined'){
                map.push({
                    action:'create',
                    key:key,
                    value:value
                })
            } else if(H.settings[key] != value) {
                map.push({
                    action:'update',
                    key:key,
                    value:value
                });
            }
        }

        // 处理参数
        var handle = function(item,callback){
            if(item.action == 'create'){
                sails.models.setting.create({
                    key:item.key,
                    value:item.value
                }).exec(callback);
            } else if(item.action == 'update'){
                sails.models.setting.update({
                    key:item.key
                },{
                    value:item.value
                }).exec(callback);
            } else {
                callback();
            }
        };

        async.map(map, handle, function(err, results){

            if(err){
                return res.serverError(err);
            }

            return res.redirect('/system/setting');

        });


    }


};
