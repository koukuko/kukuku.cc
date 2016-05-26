/**
 * 403 (Forbidden) Handler
 *
 * Usage:
 * return res.forbidden();
 * return res.forbidden(err);
 * return res.forbidden(err, 'some/specific/forbidden/view');
 *
 * e.g.:
 * ```
 * return res.forbidden('Access denied.');
 * ```
 */

module.exports = function forbidden(data) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    req.wantType = sails.services.utility.checkWantType(req.params.format);

    // Set status code
    res.status(403);

    // Log error to console
    if (data !== undefined) {
        sails.log.verbose('Sending 403 ("Forbidden") response: \n', data);
    }
    else sails.log.verbose('Sending 403 ("Forbidden") response');

    var data = {
        data: data,
        msg:data,
        success: false,
        code: 403
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
            res.render('mobile/code/403', data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                res.send(200, html);
            });
            break;

        case 'desktop':
        default :
            res.render('desktop/code/403', data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                res.send(200, html);
            });
            break;
    }

};

