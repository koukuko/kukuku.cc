/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 * return res.ok(data, 'auth/login');
 *
 * @param  {Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 */

module.exports = function sendOK(data, options) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    sails.log.silly('res.ok() :: Sending 200 ("OK") response');

    // Set status code
    res.status(200);

    // If appropriate, serve data as JSON(P)
    if (req.wantsJSON || (req.params.format && req.params.format == 'json')) {
        return res.jsonx({success:true,code:200,msg:data});
    }

    // If second argument is a string, we take that to mean it refers to a view.
    // If it was omitted, use an empty object (`{}`)
    options = (typeof options === 'string') ? { view: options } : options || {};

    // If a view was provided in options, serve it.
    // Otherwise try to guess an appropriate view, or if that doesn't
    // work, just send JSON.
    if (options.view) {
        return res.view(options.view, { data: data });
    }

    else return res.view('200', { data: data }, function (err, html) {

        // If a view error occured, fall back to JSON(P).
        if (err) {
            //
            // Additionally:
            // • If the view was missing, ignore the error but provide a verbose log.
            if (err.code === 'E_VIEW_FAILED') {
                sails.log.verbose('res.ok() :: Could not locate view for error page (sending JSON instead).  Details: ',err);
            }
            // Otherwise, if this was a more serious error, log to the console with the details.
            else {
                sails.log.warn('res.ok() :: When attempting to render error page view, an error occured (sending JSON instead).  Details: ', err);
            }
            return res.jsonx(data);
        }

        return res.send(html);
    });

    // If no second argument provided, try to serve the implied view,
    // but fall back to sending JSON(P) if no view can be inferred.
//    else return res.guessView({ data: data }, function couldNotGuessView() {
//        return res.jsonx(data);
//    });

};
