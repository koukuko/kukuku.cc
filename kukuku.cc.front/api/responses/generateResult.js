/**
 * 200 (OK) Response - Generate Result , Include html & json etc.
 *
 * Usage:
 * return res.generateResult(data,wantType,cacheKey);
 *
 * @param  {Object} data
 * @param  {Object} option
 *              {
 *                  wantType: {enum} desktop/mobile/json/xml
 *                  desktopView: {string}
 *                  cacheKey: {string}
 *              }
 */

module.exports = function generateResult(data, option) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    sails.log.silly('res.ok() :: Sending 200 ("OK") response');

    // Set status code
    res.status(200);

    if(!option || !_.isObject(option)){
        return res.serverError('结果生成初始化失败:预期外参数');
    }

    switch (req.wantType.param) {

//        case 'xml':
//            var html = json2xml(data);
//            html = '<?xml version="1.0" encoding="UTF-8"?><root>' + html + '</root>';
//            sails.services.cache.set(req.cacheKey, html);
//            res.set('Content-Type','text/xml');
//            res.send(200, html);
//            break;

        case 'json':
            sails.services.cache.set(req.cacheKey, data);
            sails.config.jsonp ? res.jsonp(data) : res.json(data);
            break;

        case 'mobile':
            res.render(option.mobileView, data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                sails.services.cache.set(req.cacheKey, html);
                res.send(200, html);
            });
            break;

        case 'desktop':
        default :
            res.render(option.desktopView, data, function (err, html) {
                if (err) {
                    return res.serverError(err);
                }
                sails.services.cache.set(req.cacheKey, html);
                res.send(200, html);
            });
            break;
    }

};
