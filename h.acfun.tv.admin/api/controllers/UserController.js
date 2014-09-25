/**
 * UserController
 *
 * @description :: 用户
 */

module.exports = {

    // 首页
    index: function (req, res) {

        var page = req.query.page || 1;
        var pagesize = req.query.pagesize || 20;

        var map = {};
        var sort = {};

        if (req.query.name) {
            map['name'] = {
                'contains': req.query.name
            };
        }

        if (req.query.order) {
            if (req.query.sort == 'desc') {
                sort[req.query.order] = 'desc';
            } else {
                sort[req.query.order] = 'asc';
            }
        } else {
            sort['id'] = 'desc';
        }

        sails.models.user
            .count(map)
            .then(function (count) {
                sails.models.user
                    .find()
                    .where(map)
                    .sort(sort)
                    .paginate({ page: page, limit: pagesize })
                    .then(function (filters) {
                        return res.view('user/index', {
                            page: {
                                name: '用户管理',
                                desc: '权限狗列表',
                                count: count
                            },
                            data: filters
                        });
                    })
                    .fail(function (err) {
                        return res.serverError(err);
                    });
            })
            .fail(function (err) {
                res.serverError(err);
            });

    },

    // 创建
    create: function (req, res) {

        var body = req.body || {};

        if (req.method != 'POST') {
            return res.view('user/edit', {
                data: body,
                page: {
                    name: '添加用户',
                    desc : '创建一个新用户'
                }
            });
        }

        var salt = new Date().getTime() + '_' + new Date().getFullYear();
        body.salt = salt;
        body.password = md5(salt + body.password);
        body.access = body.access ? body.access.split(',') : [];

        var map = {
            name: body.name,
            password: body.password,
            salt: body.salt,
            access: body.access
        };

        req.flash('info', map);

        sails.models.user
            .create(map)
            .then(function () {
                req.flash('success', '创建成功。');
                return res.redirect('/user');
            })
            .fail(function (err) {
                req.flash('danger', err);
                return res.redirect('back');
            })
            .fin(function () {

            })

    },

    // 编辑
    update: function(req,res){

        sails.models.user.findOneById(req.params.id)
            .then(function(user){

                if(!user){
                    return res.notFound();
                }

                var body  = req.body || {};
                var data  = user || {};

                if(req.method != 'POST'){

                    data.access = data.access.join();
                    delete data.password;

                    return res.view('user/edit', {
                        page: {
                            name: '编辑用户',
                            desc: '修改一个用户的信息'
                        },
                        data: data
                    });
                }

                body.salt = data.salt;
                body.access = body.access.split(',');

                var map = {
                    name: body.name,
                    access: body.access
                };

                if(body.password){
                    map.password = md5(data.salt + body.password);
                }

                req.flash('info', map);

                sails.models.user
                    .update({
                        id:data.id
                    },map)
                    .then(function(){
                        req.flash('success', '修改成功');
                        return res.redirect('/user');
                    })
                    .fail(function(err){
                        req.flash('danger', err);
                        return res.redirect('back');
                    })

            })
            .fail(function(err){
                return res.serverError(err);
            });

    },

    // 删除
    remove: function (req, res) {

        var map = {};

        if (req.query.ids) {

            map['id'] = req.query.ids;

            req.flash('info', req.query);

            sails.models.user
                .destroy(map)
                .then(function () {
                    req.flash('success', '删除成功。');
                })
                .fail(function (err) {
                    req.flash('danger', err);
                })
                .fin(function () {
                    return res.redirect('/user');
                });

        } else {

            req.flash('danger', '必须指定至少一个对象。');
            return res.redirect('/user');

        }

    }

};

