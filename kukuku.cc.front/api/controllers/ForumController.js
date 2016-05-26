/**
 * ForumController
 *
 * @module      :: Controller
 * @description    :: 版块
 */

module.exports = {

    index: function (req, res) {

        // 版块
        var forum = sails.models.forum.findForumByName(req.params.forum);
        if (!forum) {
            return res.notFound();
        }

        // 翻页
        var pageIndex = Number(req.query.page) || 1;
        var pageCount = Math.ceil(sails.models.forum.list[forum.name]['topicCount'] / 10);

        req.wantType = sails.services.utility.checkWantType(req.params.format);
        req.cacheKey = 'forum:' + forum.id + ':' + pageIndex + ':' + req.wantType.suffix;

        sails.services.cache.get(req.cacheKey)
            .then(function (cache) {

                if (wantType.param == 'json') {
                    return sails.config.jsonp ? res.jsonp(JSON.parse(cache)) : res.json(JSON.parse(cache));
                } else if (req.wantType.param == 'xml') {
                    res.set('Content-Type', 'text/xml');
                }

                res.send(200, cache);

            })
            .fail(function () {
                sails.models.threads.list(forum.id, pageIndex)
                    .then(function (data) {

                        var output = {
                            forum: forum,
                            data: data,
                            page: {
                                title: forum.name,
                                size: pageCount,
                                page: pageIndex
                            },
                            code: 200,
                            success: true
                        };

                        // 删除不需要的数据 & 转换时间戳
                        if (forum) {
                            forum['createdAt'] = (forum['createdAt']) ? new Date(forum['createdAt']).getTime() : null;
                            forum['updatedAt'] = (forum['updatedAt']) ? new Date(forum['updatedAt']).getTime() : null;
                        }

                        for (var i in output['data']['threads']) {
                            if (output['data']['threads'][i]) {
                                var data = output['data']['threads'][i];
                                delete data['ip'];
                                delete data['parent'];
                                data['createdAt'] = (data['createdAt']) ? new Date(data['createdAt']).getTime() : null;
                                data['updatedAt'] = (data['updatedAt']) ? new Date(data['updatedAt']).getTime() : null;
                            }
                        }

                        for (var i in output['data']['replys']) {
                            if (output['data']['replys'][i]) {
                                var data = output['data']['replys'][i];
                                delete data['ip'];
                                delete data['parent'];
                                delete data['recentReply'];
                                data['createdAt'] = (data['createdAt']) ? new Date(data['createdAt']).getTime() : null;
                                data['updatedAt'] = (data['updatedAt']) ? new Date(data['updatedAt']).getTime() : null;
                            }
                        }

                        return res.generateResult(output, {
                            desktopView: 'desktop/forum/index',
                            mobileView: 'mobile/forum/index'
                        });

                    })
                    .fail(function (err) {
                        return res.serverError(err);
                    });
            });


    }
};
