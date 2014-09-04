/**
 * userAuth
 *
 * @module      :: Policy
 * @description :: 用户有效性检查
 *
 */
module.exports = function (req, res, next) {

    // 1. 是否有饼干
    if (req.signedCookies && req.signedCookies.userId) {

        // 饼干续费
        res.cookie('userId', req.signedCookies.userId, { maxAge: H.settings.cookieExpires, signed: true });

    } else if (H.settings.cookieSignup == 'true' || (req.signedCookies && req.signedCookies.managerId)) {

        // 生成饼干
        var char = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
        var seed = new Date().getTime();
        var userId = "";
        for (var i = 0; i < 8; i++) {
            userId += char.charAt(Math.ceil(Math.random() * seed) % char.length);
        }

        res.cookie('userId', userId, { maxAge: H.settings.cookieExpires, signed: true });
        req.signedCookies.userId = userId;

    } else {

        // 没有饼干
        return res.forbidden('没有饼干');

    }

    // 2. userId/IP 是否被封禁
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress ||
        '0.0.0.0';

    if(sails.models.filter.test.ip(ip) || sails.models.filter.test.userId(req.signedCookies.userId)){

        // 自动注销饼干
        res.clearCookie('userId');

        return res.forbidden('没有权限');
    }

    return next();

};
