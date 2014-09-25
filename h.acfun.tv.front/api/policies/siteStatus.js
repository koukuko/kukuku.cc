/**
 * siteStatus
 *
 * @module      :: Policy
 * @description :: 用户有效性检查
 *
 */
module.exports = function (req, res, next) {

    // 1. 是否有饼干
    if(H.settings.siteClose && H.settings.siteClose == 'true'){
        return res.forbidden(H.settings.siteCloseMessage || '网站维护中');
    }

    return next();

};
