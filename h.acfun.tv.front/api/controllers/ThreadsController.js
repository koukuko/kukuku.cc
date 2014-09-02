/**
 * ThreadsController
 *
 * @module      :: Controller
 * @description    :: 贴子
 */

var gm = require('gm')
    , fs = require('fs')
    , path = require('path')
    , imageMagick = gm.subClass({ imageMagick: true });

module.exports = {

    /**
     * 获取单个帖子列表
     */
    index: function (req, res) {

        // ThreadsId 有效性
        var threadsId = Number(req.params.tid);
        if (isNaN(threadsId)) {
            return res.forbidden('贴子ID不合法');
        }

        // 翻页
        var pageIndex = Number(req.query.page);
        if (!pageIndex || isNaN(pageIndex) || pageIndex < 0) {
            pageIndex = 1;
        }

        // 缓存key
        var key = 'threads:' + threadsId + ':' + pageIndex;

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

                // 首先通过threadsID获得主串信息
                sails.models.threads.findOneById(threadsId)
                    .then(function(threads){

                        if(!threads){
                           return res.notFound();
                       }

                        var forum = sails.models.forum.findForumById(threads.forum);

                        sails.models.threads.count()
                            .where({parent:threadsId})
                            .then(function(replyCount){

                                var pageCount = Math.ceil(replyCount / 20);
                                pageCount = (!pageCount) ? 1 : pageCount;

                                // 获取回复信息
                                sails.models.threads.getReply(threadsId, pageIndex)
                                    .then(function (replys) {
                                        var output = {
                                            threads: threads,
                                            replys: replys,
                                            forum: forum,
                                            page: {
                                                title: 'No.' + threads.id,
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

                                            if (threads) {
                                                delete threads['ip'];
                                                threads['createdAt'] = (threads['createdAt']) ? new Date(threads['createdAt']).getTime() : null;
                                                threads['updatedAt'] = (threads['updatedAt']) ? new Date(threads['updatedAt']).getTime() : null;
                                            }


                                            for (var i in replys) {
                                                if (replys[i]) {
                                                    delete replys[i]['ip'];
                                                    delete replys[i]['parent'];
                                                    delete replys[i]['recentReply'];
                                                    replys[i]['createdAt'] = (replys[i]['createdAt']) ? new Date(replys[i]['createdAt']).getTime() : null;
                                                    replys[i]['updatedAt'] = (replys[i]['updatedAt']) ? new Date(replys[i]['updatedAt']).getTime() : null;
                                                }
                                            }

                                            sails.services.cache.set(key, output);
                                            return res.json(output);

                                        }

                                        return res.render('threads/index', output, function (err, html) {
                                            if (err) {
                                                return res.serverError(err);
                                            } else {
                                                sails.services.cache.set(key, html);
                                                res.send(200, html);
                                            }
                                        });

                                    }).fail(function (err) {
                                        return res.serverError(err);
                                    });
                            });
                    })
                    .fail(function(err){
                        return res.serverError(err);
                    });

            });

    }
}
