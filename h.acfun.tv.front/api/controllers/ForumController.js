/**
 * ForumController
 *
 * @module      :: Controller
 * @description    :: 版块
 */

module.exports = {

    index: function (req, res) {

        var forum = sails.models.forum.findForumByName(req.params.forum);

        // 版块有效性
        if (!forum) {
            return res.notFound();
        }

        // 翻页
        var pageIndex = Number(req.query.page) || 1;

        var pageCount = Math.ceil(sails.models.forum.list[forum.name]['topicCount'] / 10);

        // 缓存key
        var key = 'forum:' + forum.id + ':' + pageIndex;

        // API
        var isAPI = (req.params.format) ? true : false;

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
                sails.models.threads.list(forum.id, pageIndex)
                    .then(function (data) {

                        var output = {
                            forum: forum,
                            data: data,
                            page: {
                                title: forum.name,
                                size: pageCount,
                                page: pageIndex,
                                isAPI: isAPI
                            }
                        };

                        if (isAPI) {

                            output['success'] = true;

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

                            sails.services.cache.set(key, output);

                            return res.json(output);

                        }

                        return res.render('forum/index', output, function (err, html) {
                            if (err) {
                                return res.serverError(err);
                            }
                            sails.services.cache.set(key, html);
                            return res.send(200, html);
                        });
                    })
                    .fail(function (err) {
                        return res.serverError(err);
                    });
            });


    }
};
