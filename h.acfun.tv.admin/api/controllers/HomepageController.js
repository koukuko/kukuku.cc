/**
 * HomepageController
 *
 * @description :: 首页
 */

module.exports = {

    /**
     * 首页
     */
    index: function (req, res) {
        return res.view('homepage/index', {
            page: {
                name: '首页',
                desc: '顺猴者昌，逆猴者亡'
            }
        });
    },

    /**
     * 登陆
     */
    signin: function (req, res) {

        if (req.method != 'POST') {
            return res.view('homepage/signin', {
                page: {
                    name: '登陆',
                    desc: '权限者认证'
                }
            });
        }

        var body = req.body;

        var geetest = require('geetest')('72916f7b6bf09e0ef58bef869816f1bf');

        geetest.validate({
            challenge: body.geetest_challenge,
            validate: body.geetest_validate,
            seccode: body.geetest_seccode
        }, function (result) {
            if (result) {
                // 验证大成功
                sails.models.user.findOneByName(body.name).
                    then(function (user) {

                        if (!user) {
                            return res.badRequest('登陆失败');
                        }

                        var typedPassword = md5(user.salt + body.password);

                        if (user.password == typedPassword) {
                            res.cookie('managerId', user.name, { maxAge: H.settings.cookieExpires, signed: true });
                            return res.redirect('/');
                        } else {
                            return res.forbidden('登陆失败');
                        }
                    })
                    .fail(function(err){
                        return res.serverError(err);
                    });
            }
            else {
                res.badRequest('验证码输入失败！');
            }
        })

    },

    /**
     * 登出
     */
    signout:function(req,res){

        res.clearCookie('managerId');
        return res.redirect('/');

    }

};

