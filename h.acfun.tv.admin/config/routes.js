/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    // 首页
    '/': {
        controller: 'HomepageController',
        action: 'index'
    },

    /**
     * 内容
     */

    // 版块
    '/content/forum': {
        controller: 'ForumController',
        action: 'index'
    },

    '/content/forum/create': {
        controller: 'ForumController',
        action: 'create'
    },

    '/content/forum/:id/update': {
        controller: 'ForumController',
        action: 'update'
    },

    '/content/forum/remove': {
        controller: 'ForumController',
        action: 'remove'
    },

    '/content/forum/:id/remove': {
        controller: 'ForumController',
        action: 'remove'
    },

    '/content/forum/:id/set': {
        controller: 'ForumController',
        action: 'set'
    },

    // 贴子
    '/content/threads': {
        controller: 'ThreadsController',
        action: 'index'
    },

    '/content/threads/create': {
        controller: 'ThreadsController',
        action: 'create'
    },

    '/content/threads/:id/update': {
        controller: 'ThreadsController',
        action: 'update'
    },

    '/content/threads/:id/remove': {
        controller: 'ThreadsController',
        action: 'remove'
    },

    '/content/threads/remove': {
        controller: 'ThreadsController',
        action: 'remove'
    },

    '/content/threads/:id/removeImages': {
        controller: 'ThreadsController',
        action: 'remove'
    },

    '/content/threads/:id/set': {
        controller: 'ThreadsController',
        action: 'set'
    },

    /**
     * 系统
     */
    // 系统配置
    '/system/setting': {
        controller: 'SettingController',
        action: 'index'
    },

    '/system/setting/update': {
        controller: 'SettingController',
        action: 'update'
    },

    // 过滤配置
    '/system/filter': {
        controller: 'FilterController',
        action: 'index'
    },

    '/system/filter/create': {
        controller: 'FilterController',
        action: 'create'
    },

    '/system/filter/remove': {
        controller: 'FilterController',
        action: 'remove'
    },

    // 缓存配置
    '/system/cache': {
        controller: 'CacheController',
        action: 'index'
    },

    '/system/cache/flush': {
        controller: 'CacheController',
        action: 'flushCache'
    },

    // FTP管理
    '/system/ftp': {
        controller: 'FtpController',
        action: 'index'
    },

    '/system/ftp/put': {
        controller: 'FtpController',
        action: 'put'
    },

    '/system/ftp/remove': {
        controller: 'FtpController',
        action: 'remove'
    },

    '/system/ftp/mkdir': {
        controller: 'FtpController',
        action: 'mkdir'
    },


    // 用户
    '/user': {
        controller: 'UserController',
        action: 'index'
    },

    '/user/create': {
        controller: 'UserController',
        action: 'create'
    },

    '/user/:id/update': {
        controller: 'UserController',
        action: 'update'
    },

    '/user/:id/remove': {
        controller: 'UserController',
        action: 'remove'
    },

    '/user/remove': {
        controller: 'UserController',
        action: 'remove'
    }


};
