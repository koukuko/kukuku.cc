/**
 * HomepageController
 *
 * @module      :: Controller
 * @description    :: 首页
 */

//var signature = require('cookie-signature');

module.exports = {

    /**
     * 首页
     * @key homepage:index:{$format}
     */
    index: function (req, res) {

        req.wantType = sails.services.utility.checkWantType(req.params.format);
        req.cacheKey ='homepage:index:' + req.wantType.suffix;

        // 0.1 确认是否需要跳转

        if(req.query.switch){
            if(req.query.switch == 'true'){
                req.session.wantMobile = 'true';
                return res.redirect('/.mobile');
            } else if(req.query.switch == 'false'){
                req.session.wantMobile = 'false';
            }
        }

        // 提前判断mobile/desktop
        if(
            req.wantType.isDesktop &&
            sails.services.utility.isMobile(req.headers['user-agent']) &&
            typeof req.session.wantMobile == 'undefined'
        ){
            if(req.session.wantMobile == 'true'){
                return res.redirect('/.mobile');
            } else {
                return res.redirect('/homepage/switchType');
            }
        }

        sails.services.cache.get(req.cacheKey)
            .then(function (cache) {

                if(req.wantType.param == 'json'){
                    return sails.config.jsonp ? res.jsonp(JSON.parse(cache)) : res.json(JSON.parse(cache));
                } else if(req.wantType.param == 'xml'){
                    res.set('Content-Type','text/xml');
                }

                res.send(200, cache);

            })
            .fail(function () {

                var data = {
                    page: {
                        title: '首页'
                    },
                    code: 200,
                    success: true
                };

                return res.generateResult(data,{
                    desktopView: 'desktop/homepage/index',
                    mobileView: 'mobile/homepage/index'
                });

            });
    },

    /**
     * 切换版本
     * @param req
     * @param res
     */
    switchType: function(req,res) {


        return res.render('mobile/homepage/switch', {
            page:{
                title:'切换'
            }
        }, function (err, html) {
            if (err) {
                return res.serverError(err);
            }
            res.send(200, html);
        });

    },

    /**
     * 版块列表
     * TODO：需要修改
     */
    menu: function (req, res) {

        var key = 'homepage:menu';

        // API
        var isAPI = (req.params.format && req.params.format == 'json') ? true : false;

        if (isAPI) {
            key += ':api';
        }

        sails.services.cache.get(key)
            .then(function (cache) {

                if(isAPI){
                    return res.json(JSON.parse(cache));
                }

                res.send(200, cache);

            })
            .fail(function () {

                if(isAPI){

                    var output = {
                        success:true,
                        forum:{}
                    };

                    sails.models.forum.find()
                        .then(function(rawForums){

                            for (var i in rawForums){
                                rawForums[i]['createdAt'] = (rawForums[i]['createdAt']) ? new Date(rawForums[i]['createdAt']).getTime() : null;
                                rawForums[i]['updatedAt'] = (rawForums[i]['updatedAt']) ? new Date(rawForums[i]['updatedAt']).getTime() : null;
                            }

                            output.forum = rawForums;

                            sails.services.cache.set(key, output);
                            return res.json(output);

                        })
                        .fail(function(err){
                            return res.serverError(err);
                        });

                } else {
                    res.render('homepage/menu', {
                        page: {
                            title: '版块列表'
                        }
                    }, function (err, html) {

                        if (err) {
                            return res.serverError(err);
                        }

                        sails.services.cache.set(key, html);
                        res.send(200, html);
                    });
                }

            });
    },

    /**
     * /homepage/isManager
     */
    isManager:function(req,res){

        var result = {
            success: false
        };

        if (req.signedCookies.managerId) {
            result.success= true;
        }

        res.json(result);

    },

    /**
     * 搜索
     */
    search:function(req,res){


        req.wantType = sails.services.utility.checkWantType(req.params.format);
        req.cacheKey ='homepage:search:' + req.wantType.suffix;

        return res.generateResult({},{
            desktopView: 'desktop/homepage/search',
            mobileView: 'mobile/homepage/search'
        });

    }

    /**
     * 生成饼干
     */
//    generateUserId: function(req,res){
//        if (H.settings.cookieSignup == 'true' || (req.signedCookies && req.signedCookies.managerId)) {
//
//            // 生成饼干
//            var char = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM";
//            var seed = new Date().getTime();
//            var userId = "";
//            for (var i = 0; i < 8; i++) {
//                userId += char.charAt(Math.ceil(Math.random() * seed) % char.length);
//            }
//            userId = 's:' + signature.sign(userId,req.secret);
//            res.cookie('userId', userId, { maxAge: Number(H.settings.cookieExpires), signed: true });
//            return res.json({code:200,success:true,userId:userId});
//
//
//        } else {
//
//            // 没有饼干
//            return res.json({code:403,success:false});
//
//        }
//    }

};
