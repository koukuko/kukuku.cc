/**
 * FeedController
 *
 * @description :: 订阅
 */

module.exports = {

    index: function (req, res) {

        var isAPI = (req.params.format) ? true : false;

        var page = parseInt(req.query.page) || 1;
        var pagesize = parseInt(req.query.pagesize) || 20;

        if(req.query.deviceToken && req.query.deviceToken.length < 8){
            return res.badRequest('参数错误:自定义令牌至少得9个字符');
        }

        var deviceToken = req.query.deviceToken || req.signedCookies.userId;

        if (!deviceToken) {
            return res.badRequest('缺少签名参数:没有饼干或者没有令牌');
        }
        sails.models.feed
            .query(
            "select feed.`id` as `feedId`, feed.`threadsId` as `threadsId`, threads.`uid` as `uid`, threads.`name` as `name`, threads.`email` as `email`, threads.`title` as `title`, threads.`content` as `content`, threads.`image` as `image`, threads.`thumb` as `thumb`, threads.`lock` as `lock`, threads.`sage` as `sage`, threads.`forum` as `forum`, threads.`parent` as `parent`, threads.`replyCount` as `replyCount`, threads.`createdAt` as `createdAt`, threads.`updatedAt` as `updatedAt` from feed left join threads on feed.`threadsId` = threads.`id` where feed.`deviceToken` = ? order by `updatedAt` desc limit ?,?",
            [
                deviceToken,
                    (page - 1) * pagesize,
                pagesize
            ],
            function (err, feedThreads) {

                if (err) {
                    return res.serverError(err);
                }

                sails.models.feed.count()
                    .where({
                        deviceToken: deviceToken
                    })
                    .then(function(count){

                        if(isAPI){

                            // 对订阅进行处理
                            for (var i in feedThreads) {
                                var data = feedThreads[i];
                                data['createdAt'] = (data['createdAt']) ? new Date(data['createdAt']).getTime() : null;
                                data['updatedAt'] = (data['updatedAt']) ? new Date(data['updatedAt']).getTime() : null;
                            }

                            return res.json({
                                code:200,
                                success:true,
                                threads:feedThreads,
                                total:count
                            });
                        } else {
                            return res.view(
                                'feed/index',
                                {
                                    threads:feedThreads,
                                    page: {
                                        title: '订阅列表',
                                        size: Math.ceil(count / pagesize),
                                        page: page,
                                        isAPI: isAPI
                                    }
                                }
                            )
                        }

                    })
                    .fail(function(){
                        return res.serverError(err);
                    });


            }
        );

    },

    create: function (req, res) {

        var deviceToken = req.query.deviceToken || req.signedCookies.userId;

        if (!deviceToken) {
            return res.badRequest('缺少签名参数:没有饼干或者没有令牌');
        }

        var threadsId = req.query.threadsId;

        if (!threadsId) {
            return res.badRequest('缺少必填项:串ID');
        }

        sails.models.feed
            .findOrCreate({
                deviceToken: deviceToken,
                threadsId: threadsId
            },
            {
                deviceToken: deviceToken,
                threadsId: threadsId
            })
            .then(function (data) {
                return res.ok('订阅成功');
            })
            .fail(function (err) {
                return res.serverError(err);
            });

    },

    remove: function (req, res) {

        var map = {};
        var deviceToken = req.query.deviceToken || req.signedCookies.userId;

        if (!deviceToken) {
            return res.badRequest('缺少签名参数:没有饼干或者没有令牌');
        }

        map['deviceToken'] = deviceToken;

        var threadsId = req.query.threadsId;
        var id = req.query.id;

        if (threadsId) {
            map['threadsId'] = threadsId;
        } else if(id){
            map['id'] = id;
        } else {
            return res.badRequest('缺少必填项:串ID');
        }

        sails.models.feed
            .destroy(map)
            .then(function () {
                return res.ok('取消订阅成功:' + (threadsId || id));
            })
            .fail(function (err) {
                return res.serverError(err);
            })

    }

};

