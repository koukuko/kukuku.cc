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

    /**
     * 首页
     */
    '/': 'HomepageController.index',
    '/signin': 'HomepageController.signin',
    '/signout': 'HomepageController.signout',

    /**
     * 版块
     */
    '/content/forum': 'ForumController.index',
    '/content/forum/create': 'ForumController.create',
    '/content/forum/:id/update': 'ForumController.update',
    '/content/forum/remove': 'ForumController.remove',
    '/content/forum/:id/remove': 'ForumController.remove',
    '/content/forum/:id/set': 'ForumController.set',

    /**
     * 帖子
     */
    '/content/threads':'ThreadsController.index',
    '/content/threads/create':'ThreadsController.create',
    '/content/threads/:id/update':'ThreadsController.update',
    '/content/threads/remove':'ThreadsController.remove',
    '/content/threads/:id/remove':'ThreadsController.remove',
    '/content/threads/:id/removeImages':'ThreadsController.removeImages',
    '/content/threads/:id/set':'ThreadsController.set',

    /**
     * 系统配置
     */
    '/system/setting': 'SettingController.index',
    '/system/setting/update': 'SettingController.update',

    /**
     * 过滤配置
     */
    '/system/filter': 'FilterController.index',
    '/system/filter/create': 'FilterController.create',
    '/system/filter/remove': 'FilterController.remove',

    /**
     * 缓存配置
     */
    '/system/cache':'CacheController.index',
    '/system/cache/flush':'CacheController.flushCache',

    /**
     * FTP
     */
    '/system/ftp': 'FtpController.index',
    '/system/ftp/put':'FtpController.put',
    '/system/ftp/remove':'FtpController.remove',
    '/system/ftp/mkdir':'FtpController.mkdir',

    /**
     * 用户
     */
    '/user':'UserController.index',
    '/user/create':'UserController.create',
    '/user/:id/update':'UserController.update',
    '/user/:id/remove':'UserController.remove',
    '/user/remove':'UserController.remove'

};
