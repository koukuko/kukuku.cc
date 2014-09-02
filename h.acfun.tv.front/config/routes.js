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
    '/':'HomepageController.index',
    '/homepage/menu.:format?':'HomepageController.menu',
    '/homepage/ref.:format?':'ThreadsController.ref',

    /**
     * 版块
     */
    '/:forum.:format?':'ForumController.index',
    '/:forum/create.:format?':'ThreadsController.create',

    /**
     * 串
     */
    '/t/:tid.:format?':'ThreadsController.index',
    '/t/:tid/create.:format?':'ThreadsController.create'

};
