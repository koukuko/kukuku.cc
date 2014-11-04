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

    cache: true,

    jsonp: true,

    session: {
        host: '127.0.0.1'
    },

    models: {
        migrate: 'safe'
    },

    connections: {
        ftpServer:{
            host: '192.168.241.35',
            port: 21,
            user: 'h',
            password: 'h@acfun@tv'
        },
        mysqlServer: {
            adapter: 'sails-mysql',
            host: '192.168.241.40',
            user: 'hisland',
            password: 'hi_to_ri_de_i_you',
            database: 'h_acfun_tv'
        },
        redisServer: {
            host: '127.0.0.1',
            port: 6379,
            database: 7
        }
    },

    http:{
        middleware:{
            poweredBy: function xPoweredBy(req, res, next) {
                res.header('X-Powered-By', 'Akino Mizuho.Koukuko <koukuko.com>');
                next();
            }
        }
    }
};
