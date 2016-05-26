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
        ftpServer:{
            host:'10.232.0.38',
            port:21,
            user:'root',
            password:'123456'
        },
        mysqlServer: {
            adapter: 'sails-mysql',
            host: '10.232.0.38',
            user: 'root',
            password: '',
            database: 'h.acfun.tv'
        },
        redisServer: {
            host: '10.232.0.13',
            port: 6379,
            database: 7
        }
    }

};
