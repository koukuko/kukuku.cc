/**
 * 404 (Not Found) Handler
 *
 * Usage:
 * return res.notFound();
 * return res.notFound(err);
 * return res.notFound(err, 'some/specific/notfound/view');
 *
 * e.g.:
 * ```
 * return res.notFound();
 * ```
 *
 * NOTE:
 * If a request doesn't match any explicit routes (i.e. `config/routes.js`)
 * or route blueprints (i.e. "shadow routes", Sails will call `res.notFound()`
 * automatically.
 */

module.exports = function notFound(data) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    req.wantType = sails.services.utility.checkWantType(req.params.format);

    // Set status code
    res.status(404);

    // Log error to console
    if (data !== undefined) {
        sails.log.verbose('Sending 404 ("Not Found") response: \n', data);
    }
    else sails.log.verbose('Sending 404 ("Not Found") response');

    var data = {
        data: data,
        msg:data,
        success: false,
        code: 404
    };

    switch (req.wantType.param) {

//        case 'xml':
//            var html = json2xml(data);
//            html = '<?xml version="1.0" encoding="UTF-8"?><root>' + html + '</root>';
//            res.set('Content-Type', 'text/xml');
//            res.send(200, html);
//            break;

        case 'json':
            sails.services.cache.set(req.cacheKey, data);
            sails.config.jsonp ? res.jsonp(data) : res.json(data);
            break;

        case 'mobile':
            res.render('mobile/code/404', data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                res.send(200, html);
            });
            break;

        case 'desktop':
        default :
            res.render('desktop/code/404', data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                res.send(200, html);
            });
            break;
    }

};

