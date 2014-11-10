/**
 * FilterController
 *
 * @description :: 过滤器
 */

module.exports = {

    // 首页
    index: function (req, res) {

        var page = req.query.page || 1;
        var pagesize = req.query.pagesize || 20;

        var map = {};
        var sort = {};

        if (req.query.type) {
            map['type'] = req.query.type;
        }

        if (req.query.rule) {
            map['rule'] = {
                'contains': req.query.rule
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

        sails.models.filter
            .count(map)
            .then(function (count) {
                sails.models.filter
                    .find()
                    .where(map)
                    .sort(sort)
                    .paginate({ page: page, limit: pagesize })
                    .then(function (filters) {
                        return res.view('system/filter/index', {
                            page: {
                                name: '过滤器',
                                desc: '全站通用式内容过滤器',
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

        if (req.method != 'POST') {
            return res.notFound();
        }

        var expires = req.body.expires;
        var handledExpires = new Date().getTime();


        if (/\d+s/.test(expires)) {
            var c = /(\d+)s/.exec(expires)[1];
            handledExpires += 1e3 * Number(c)
        }
        if (/\d+i/.test(expires)) {
            var c = /(\d+)i/.exec(expires)[1];
            handledExpires += 6e5 * Number(c)
        }
        if (/\d+h/.test(expires)) {
            var c = /(\d+)h/.exec(expires)[1];
            handledExpires += 3.6e6 * Number(c)
        }
        if (/\d+d/.test(expires)) {
            var c = /(\d+)d/.exec(expires)[1];
            handledExpires += 8.64e7 * Number(c)
        }
        if (/\d+m/.test(expires)) {
            var c = /(\d+)m/.exec(expires)[1];
            handledExpires += 2.592e9 * Number(c)
        }
        if (/\d+y/.test(expires)) {
            var c = /(\d+)y/.exec(expires)[1];
            handledExpires += 3.1536e10 * Number(c)
        }
        if (expires == 0) {
            handledExpires = 4102329600000;
        }

        var map = {
            type: req.body.type,
            rule: req.body.rule,
            expires: new Date(handledExpires)
        };

        req.flash('info', map);

        sails.models.filter
            .create(map)
            .then(function (rule) {
                req.flash('success', '创建成功。');
                return res.redirect('/system/filter');
            })
            .fail(function (err) {
                req.flash('danger', err);
                return res.redirect('/system/filter');
            });

    },

    // 删除
    remove: function (req, res) {

        var map = {};

        if (req.query.ids) {

            map['id'] = req.query.ids;

            req.flash('info', req.query);

            sails.models.filter
                .destroy(map)
                .then(function () {
                    req.flash('success', '删除成功。');
                })
                .fail(function (err) {
                    req.flash('danger', err);
                })
                .fin(function () {
                    return res.redirect('/system/filter');
                });

        } else {

            req.flash('danger', '必须指定至少一个对象。');
            return res.redirect('/system/filter');

        }

    }

};

