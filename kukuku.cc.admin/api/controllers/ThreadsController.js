/**
 * ThreadsController
 *
 * @description :: 贴子
 */

var querystring = require('querystring');

module.exports = {

    // 首页
    index: function (req, res) {

        var page = req.query.page || 1;
        var pagesize = req.query.pagesize || 20;

        var map = {};
        var sort = {};

        if (req.query.keyword) {
            map['or'] = [
                {name: {
                    'contains': req.query.keyword
                }},
                {title: {
                    'contains': req.query.keyword
                }},
                {content: {
                    'contains': req.query.keyword
                }},
                {uid:req.query.keyword}
            ];
        }

        if (req.query.forum) {
            map['forum'] = req.query.forum;
        }

        if (req.query.ip) {
            map['ip'] = {
                'contains': req.query.ip
            };
        }

        if (req.query.parent) {
            map['parent'] = req.query.parent;
        }

        if (req.query.lock) {
            map['lock'] = true;
        }

        if (req.query.sage) {
            map['sage'] = true;
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

        sails.models.threads
            .count(map)
            .then(function (count) {
                sails.models.threads
                    .find()
                    .where(map)
                    .sort(sort)
                    .paginate({ page: page, limit: pagesize })
                    .then(function (threads) {
                        if (req.query.parent) {
                            sails.models.threads.findOneById(req.query.parent)
                                .then(function (parentThreads) {
                                    return res.view('content/threads/index', {
                                        page: {
                                            name: '贴子管理',
                                            desc: '串',
                                            count: count
                                        },
                                        parent: parentThreads,
                                        data: threads
                                    });
                                })
                                .fail(function (err) {
                                    return res.serverError(err);
                                })
                        } else {
                            return res.view('content/threads/index', {
                                page: {
                                    name: '贴子管理',
                                    desc: '全站通用式内容管理',
                                    count: count
                                },
                                data: threads
                            });
                        }

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

        var data = req.body || {};

        var output = {
            page: {
                name: '创建贴子',
                desc: '创建一个新帖'
            },
            data: data
        };

        if (req.method != 'POST') {
            return res.view('content/threads/edit', output);
        }

        req.flash('info', data);

        // Skipper临时解决方案
        if(req._fileparser.form.bytesExpected > 4194304){
            return res.badRequest('文件大小不能超过4M (4,194,304 Byte)');
        }

        req.file('file').upload(function (uploadError, uploadedFiles) {

            // 1. 附件处理
            sails.models.threads.uploadAttachment(uploadError, uploadedFiles)
                .then(function (uploadedFilesPath) {

                    if (uploadedFilesPath && uploadedFilesPath.image && uploadedFilesPath.thumb) {
                        data.image = uploadedFilesPath.image;
                        data.thumb = uploadedFilesPath.thumb;
                    }

                    sails.models.threads.checkParentThreads(data.parent)
                        .then(function (parentThreads) {

                            // ip
                            data.ip = req.headers['x-forwarded-for'] ||
                                req.connection.remoteAddress ||
                                req.socket.remoteAddress ||
                                req.connection.socket.remoteAddress ||
                                '0.0.0.0';

//                            if (sails.models.filter.test.word(data.content) || sails.models.filter.test.word(data.name) || sails.models.filter.test.word(data.title)) {
//                                req.flash('danger', '含有敏感词');
//                                return res.redirect('back');
//                            }
                            data.content = data.content || '';
                            data.content = data.content
                                .replace(/<[^>]+>/gi, '')
                                .replace(/\r\n/g, "\n")
                                .replace(/\r/g, "\n")
                                .replace(/\n/g, "<br>")
                                .replace(/(\>\>No\.\d+)/g, "<font color=\"#789922\">$1</font>")
                                .replace(/(\>\>\d+)/g, "<font color=\"#789922\">$1</font>");

                            if (parentThreads && parentThreads.forum) {
                                data.forum = parentThreads.forum
                            }

                            var forum = sails.models.forum.findForumById(data.forum);

                            if (!forum) {
                                req.flash('danger', '版块不存在');
                                return res.redirect('back');
                            }

                            if (forum.lock) {
                                req.flash('danger', '版块已经被锁定');
                                return res.redirect('back');
                            }

                            sails.models.threads
                                .create({
                                    uid: data.uid || '',
                                    name: data.name || '',
                                    email: data.email || '',
                                    title: data.title || '',
                                    content: data.content || '',
                                    image: data.image || '',
                                    thumb: data.thumb || '',
                                    lock: data.lock || false,
                                    sage: data.sage || false,
                                    ip: data.ip || '0.0.0.0',
                                    forum: data.forum,
                                    parent: data.parent || '0',
                                    updatedAt: new Date()
                                })
                                .then(function(newThreads){
                                    sails.models.threads.handleParentThreads(parentThreads,newThreads)
                                        .then(function(){
                                            req.flash('success', '发帖成功');
                                            return res.redirect('/content/threads');
                                        })
                                        .fail(function(err){
                                            req.flash('danger', err);
                                            // 事务回滚 删除之前创建的内容
                                            sails.models.threads.destroy({id:newThreads.id}).exec(function(){});
                                            return res.redirect('back');
                                        })
                                }).fail(function(err){
                                    req.flash('danger', err);
                                    return res.redirect('back');
                                });

                        })
                        .fail(function (replyThreadsError) {
                            req.flash('danger', replyThreadsError.toString());
                            return res.redirect('back');
                        });
                })
                .fail(function (uploadAttachmentError) {
                    req.flash('danger', uploadAttachmentError.toString());
                    return res.redirect('back');
                });
        });
    },

    // 编辑
    update: function(req,res){
        sails.models.threads.findOneById(req.params.id)
            .then(function(threads){

                if(!threads){
                    return res.notFound();
                }

                var data = req.body || threads || {};

                if(req.method != 'POST'){
                    return res.view('content/threads/edit', {
                        page: {
                            name: '编辑串',
                            desc: '编辑一个串'
                        },
                        data: data
                    });
                }

                req.flash('info', data);

                req.file('file').upload(function (uploadError, uploadedFiles) {

                    // 1. 附件处理
                    sails.models.threads.uploadAttachment(uploadError, uploadedFiles)
                        .then(function (uploadedFilesPath) {

                            if (uploadedFilesPath && uploadedFilesPath.image && uploadedFilesPath.thumb) {
                                data.image = uploadedFilesPath.image;
                                data.thumb = uploadedFilesPath.thumb;
                            }

                            sails.models.threads.checkParentThreads(data.parent)
                                .then(function (parentThreads) {

                                    if (parentThreads && parentThreads.forum) {
                                        data.forum = parentThreads.forum
                                    }

                                    var forum = sails.models.forum.findForumById(data.forum);

                                    if (!forum) {
                                        req.flash('danger', '版块不存在');
                                        return res.redirect('back');
                                    }

                                    if (forum.lock) {
                                        req.flash('danger', '版块已经被锁定');
                                        return res.redirect('back');
                                    }
                                    sails.models.threads
                                        .update({
                                            id: threads.id
                                        },{
                                            uid: data.uid || '',
                                            name: data.name || '',
                                            email: data.email || '',
                                            title: data.title || '',
                                            content: data.content || '',
                                            image: data.image || '',
                                            thumb: data.thumb || '',
                                            lock: data.lock || false,
                                            sage: data.sage || false,
                                            forum: data.forum,
                                            updatedAt: new Date()
                                        })
                                        .then(function(){
                                            req.flash('success', '修改成功');
                                            return res.redirect('back');
                                        }).fail(function(err){
                                            console.log(err);
                                            req.flash('danger', err);
                                            return res.redirect('back');
                                        });

                                })
                                .fail(function (replyThreadsError) {
                                    req.flash('danger', replyThreadsError.toString());
                                    return res.redirect('back');
                                });
                        })
                        .fail(function (uploadAttachmentError) {
                            req.flash('danger', uploadAttachmentError.toString());
                            return res.redirect('back');
                        });
                });

            })
            .fail(function(err){
                return res.serverError(err);
            });
    },

    // 移除
    remove: function(req,res){

        var map = {};

        if(req.params.id){
            map['id'] =  req.params.id;
        } else if(req.query.ids){
            map['id'] = req.query.ids;
        } else if(req.query.ip) {
            map['ip'] = req.query.ip;
        } else if(req.query.uid) {
            map['uid'] = req.query.uid;
        } else {
            return res.notFound();
        }

        sails.models.threads
            .destroy(map)
            .then(function () {
                req.flash('success', '删除串 '+JSON.stringify(map)+' 成功');

                // 暂时让删除单个链接的先通知搜索
                if(req.params.id){
                    request.get('http://182.18.54.35:5001/Shaymin/del?id='+map['id']);
                }

                return res.redirect('back');
            })
            .fail(function(err){
                req.flash('danger', err);
                return res.redirect('back');
            })
    },

    // 配置
    set: function(req,res){

        var map = {};
        map[req.query.key] = req.query.value;

        req.flash('info',map);

        sails.models.threads
            .update({
                id: req.params.id
            }, map)
            .then(function(){
                req.flash('success', '修改成功');
                return res.redirect('back');
            })
            .fail(function(err){
                req.flash('danger', err);
                return res.redirect('back');
            })
    },

    // 删图
    removeImages:function(req,res){

        var map = {};
        map['image'] = '';
        map['thumb'] = '';

        req.flash('info',map);

        sails.models.threads
            .update({
                id: req.params.id
            }, map)
            .then(function(){
                req.flash('success', '修改成功');
                return res.redirect('back');
            })
            .fail(function(err){
                req.flash('danger', err);
                return res.redirect('back');
            })

    }
};

