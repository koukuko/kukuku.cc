/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest();
 * return res.badRequest(data);
 * return res.badRequest(data, 'some/specific/badRequest/view');
 *
 * e.g.:
 * ```
 * return res.badRequest(
 *   'Please choose a valid `password` (6-12 characters)',
 *   'trial/signup'
 * );
 * ```
 */

module.exports = function badRequest(data) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    req.wantType = sails.services.utility.checkWantType(req.params.format);

    // Set status code
    res.status(400);

    // Log error to console
    if (data !== undefined) {
        sails.log.verbose('Sending 400 ("Bad Request") response: \n', data);
    }
    else sails.log.verbose('Sending 400 ("Bad Request") response');

    var data = {
        data: data,
        msg:data,
        success: false,
        code: 400
    };

    switch (req.wantType.param) {

        case 'xml':
            var html = json2xml(data);
            console.log(html);
            html = '<?xml version="1.0" encoding="UTF-8"?><root>' + html + '</root>';
            res.set('Content-Type', 'text/xml');
            res.send(200, html);
            break;

        case 'json':
            sails.services.cache.set(req.cacheKey, data);
            sails.config.jsonp ? res.jsonp(data) : res.json(data);
            break;

        case 'mobile':
            res.render('mobile/code/400', data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                res.send(200, html);
            });
            break;

        case 'desktop':
        default :
            res.render('desktop/code/400', data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                res.send(200, html);
            });
            break;
    }

};

