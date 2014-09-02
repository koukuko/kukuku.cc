/**
 * Forum.js
 *
 * @description :: 版块
 */

module.exports = {

    attributes: {
        name: {
            type: 'string',
            required: true
        },
        header: {
            type: 'string',
            required: true
        },
        lock: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        cooldown: {
            type: 'int',
            required: true,
            defaultsTo: 30
        }
    },

    /**
     * 初始化版块列表
     */
    initialize: function () {

        var deferred = Q.defer();

        sails.models.forum.find()
            .exec(function (err, rawForums) {
                if (err) {
                    deferred.reject(err);
                } else {

                    var handledForum = {};
                    var handledForumId = {};
                    var forumSelectList = [
                        {
                            key: '未选择',
                            value: ''
                        }
                    ];

                    for (var i in rawForums) {

                        var forum = rawForums[i];

                        if (forum) {
                            forum.version = _.random(100, 999);
                            handledForum[forum.name] = forum;
                            handledForumId[forum.id] = forum.name;
                            forumSelectList.push({
                                key: forum.name,
                                value: forum.id
                            })
                        }
                    }

                    sails.models.threads.query("select forum,count(forum) as `count` from threads group by forum", function (err, threadsCounts) {
                        if (err || !threadsCounts) {
                            deferred.reject(err);
                        } else {
                            for (var i in threadsCounts) {
                                var threadsCount = threadsCounts[i];
                                if (handledForum[handledForumId[threadsCount.forum]])
                                    handledForum[handledForumId[threadsCount.forum]]['topicCount'] = threadsCount.count;
                            }
                        }

                        sails.models.forum.list = handledForum;
                        sails.models.forum.idList = handledForumId;
                        sails.models.forum.selectList = forumSelectList;
                        deferred.resolve(handledForum);
                    });
                }
            });

        return deferred.promise;
    },

    findForumById: function (id) {
        return sails.models.forum.list[sails.models.forum.idList[id]];
    },

    findForumByName: function (name) {
        return sails.models.forum.list[name];
    }



};

