/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    session: {
        host: '127.0.0.1'
    },

    models: {
        migrate: 'safe'
    },

    connections: {
        mysqlServer: {
            adapter: 'sails-mysql',
            host: 'localhost',
            user: 'hisland',
            password: 'hi_to_ri_de_i_you',
            database: 'h_acfun_tv'
        }
    },


    bootstrap: function (cb) {

        sails.log('h.acfun.tv - When i wish upon a star');


        // Promise大法好 网搜九评回调 有真相
        global.Q = require("q");
        global.md5 = require('MD5');

        // Redis 初始化
        var redis = require("redis"),
            client = redis.createClient(6379);

        client.select(7, function () {

            global.redis = client;

            // 程序初始化
            global.H = {};

            // Ftp 配置
            // Localhost
            H.ftpOptions = {
                host: '192.168.233.5',
                port: 21,
                user: 'h',
                password: 'h@acfun@tv'
            };

            // 1. 导入配置

            sails.models.setting.findAll()
                .then(function(settings){

                    H.settings = settings;

                    sails.log.debug('配置', H);

                    sails.models.filter.init()
                        .then(function() {
                            sails.models.forum.init()
                                .then(function(handledForum) {
                                    sails.log(handledForum);
                                    cb();
                                })
                                .fail(function(err){
                                    sails.log.error(err);
                                });
                        })
                        .fail(function(err){
                            sails.log.error(err);
                        });
                })
                .fail(function(err){
                    sails.log.error(err);
                });

        });
    }

};
