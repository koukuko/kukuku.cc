/**
 * Threads.js
 *
 * @description :: 贴子
 */
var fs = require('fs'),
    path = require('path'),
    gm = require('gm').subClass({ imageMagick: true });

module.exports = {

    autoUpdatedAt: false,

    attributes: {
        uid: {
            type: 'string',
            required: true
        },
        name: {
            type: 'string',
            defaultsTo: ''
        },
        email: {
            type: 'string',
            defaultsTo: ''
        },
        title: {
            type: 'string',
            defaultsTo: ''
        },
        content: {
            type: 'string'
        },
        image: {
            type: 'string',
            defaultsTo: ''
        },
        thumb: {
            type: 'string',
            defaultsTo: ''
        },
        lock: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        sage: {
            type: 'boolean',
            required: true,
            defaultsTo: false
        },
        ip: {
            type: 'string',
            required: true
        },
        forum: {
            type: 'string',
            required: true
        },
        parent: {
            type: 'string',
            defaultsTo: 0
        },
        replyCount: {
            type: 'int',
            defaultsTo: 0
        },
        recentReply: {
            type: 'array',
            defaultsTo: []
        },
        updatedAt: {
            type: 'datetime'
        }

    },

    /**
     * 普通翻页
     * @param {int} forumId 版块ID
     * @param {int} page=1 页数
     */
    list: function (forumId, page) {

        var deferred = Q.defer();

        // 页数
        page = Math.ceil(page);

        sails.models.threads.find()
            .where({ forum: forumId})
            .where({ parent: 0 })
            .sort('updatedAt DESC')
            .paginate(({ page: page, limit: 10 }))
            .then(function (threads) {

                var result = {};
                result.threads = threads;
                result.replys = {};
                var replyIds = [];

                for (var i in threads) {
                    var item = threads[i];
                    if (item.recentReply && item.recentReply.length > 0) {
                        replyIds = replyIds.concat(item.recentReply);
                    }
                }

                if (replyIds && replyIds.length > 0) {

                    // 将所有id转为字符串
                    for(var i in replyIds){
                        replyIds[i] = replyIds[i].toString();
                    }

                    sails.models.threads.find()
                        .where({
                            id: replyIds
                        })
                        .then(function (replys) {
                            for (var i in replys) {
                                result.replys['t' + replys[i].id] = replys[i];
                            }
                            deferred.resolve(result);
                        })
                        .fail(function(err){
                            deferred.reject(err);
                        });
                } else {
                    deferred.resolve(result);
                }
            })
            .fail(function(err){
                deferred.reject(err);
            });

        return deferred.promise;
    },

    /**
     * 获取回复列表
     * @param {int} threadsId 贴子ID
     * @param {int} page=1 页数
     */
    getReply: function (threadsId, page) {

        var deferred = Q.defer();

        // 页数
        page = Math.ceil(page);

        sails.models.threads.find()
            .where({ parent: threadsId})
            .sort('updatedAt ASC')
            .paginate(({ page: page, limit: 20 }))
            .then(function (threads) {
                deferred.resolve(threads);
            })
            .fail(function(err){
                deferred.reject(err);
            });

        return deferred.promise;
    }
};

