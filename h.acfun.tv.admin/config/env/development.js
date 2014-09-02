/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

    session: {
        host: '10.232.0.13'
    },

    models: {
        migrate: 'safe'
    },

    connections: {
        mysqlServer: {
            adapter: 'sails-mysql',
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'h.acfun.tv'
        }
    },

    bootstrap: function(cb){

        sails.log('h.acfun.tv - When i wish upon a star');

        // Promise大法好 网搜九评回调 有真相
        global.Q = require("q");
        global.md5 = require('MD5');

        // Redis 初始化
        var redis = require("redis"),
            client = redis.createClient(6379,'10.232.0.13');

        client.select(7, function() {

            global.redis = client;

            // 程序初始化
            global.H = {};

            // Ftp 配置
            // Localhost
            H.ftpOptions = {
                host: '127.0.0.1',
                port: 21,
                user: 'root',
                password: '123456'
            };

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
