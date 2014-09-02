/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

    sails.log.info('h.acfun.tv - When i wish upon a star');

    // 将常用依赖导入全局
    global.Q = require("q");
    global.md5 = require('MD5');
    global.ipm2 = require('pm2-interface')();

    global.H = {};

    // Redis 初始化
    var redis = require("redis"),
        client = redis.createClient(sails.config.connections.redisServer.port, sails.config.connections.redisServer.host);

    client.select(sails.config.connections.redisServer.database, function () {

        global.redis = client;

        // 配置与缓存初次同步
        syncSetting();
        syncFilter();

        // 版块列表同步
        sails.models.forum.initialize()
            .then(function(){
                // PM2 进程间RPC通讯初始化
                if (process.send) {
                    ipm2.on('ready', function () {

                        ipm2.bus.on('h:update:setting', function (data) {
                            syncSetting();
                        });

                        ipm2.bus.on('h:update:filter', function (data) {
                            syncFilter();
                        });

                        cb();

                    });
                } else {
                    sails.log.info('没有通过PM2启动程序，如果采用了多进程启动方式，那么数据缓存和配置可能不会同步生效。');
                    cb();
                }
            })
            .fail(function(){
                sails.log.error(err);
            });
    });

};


// 同步配置
function syncSetting() {
    sails.models.setting.exportToGlobal()
        .then(function (settings) {
            H.settings = settings;
        })
        .fail(function (err) {
            sails.log.error(err);
        });
}

// 同步过滤器
function syncFilter() {
    sails.models.setting.exportToGlobal()
        .fail(function (err) {
            sails.log.error(err);
        });
}