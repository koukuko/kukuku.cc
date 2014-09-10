/**
 * Setting
 *
 * @module      :: Model
 * @description :: 系统配置
 */

module.exports = {

    attributes: {
        key: {
            type: 'string',
            required: true,
            max: 50
        },
        value: {
            type: 'string'
        },
        name: {
            type: 'string',
            max: 50
        },
        description: {
            type: 'string',
            max: 255
        }
    },

    /**
     * 从数据库同步到全局变量
     */
    exportToGlobal: function () {

        var deferred = Q.defer();

        sails.models.setting.find().exec(function (err, rawSettings) {
            if (err) {
                deferred.reject(err);
            } else {

                // 对配置进行处理
                var handledSettings = {};

                for (var i in rawSettings) {
                    var item = rawSettings[i];
                    handledSettings[item.key] = item.value;
                }

                deferred.resolve(handledSettings);

            }
        });
        return deferred.promise;
    },

    /**
     * 通知集群版块已更新
     */
    afterUpdate: function(updatedRecord, cb) {

        if(process.send){
            process.send({type:"h:update:setting"})
        }

        cb();
    }


};
