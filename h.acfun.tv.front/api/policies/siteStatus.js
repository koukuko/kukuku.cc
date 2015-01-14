/**
 * siteStatus
 *
 * @module      :: Policy
 * @description :: 用户有效性检查
 *
 */
module.exports = function (req, res, next) {

    if(H.settings.siteClose && H.settings.siteClose == 'true'){
        if(req.params.format && req.params.format == 'json'){
            return next();
        } else {
            return res.forbidden(H.settings.siteCloseMessage || '网站维护中');
        }
    }

    return next();

};
