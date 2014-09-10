/**
 * ForumController
 *
 * @description :: 版块
 */

module.exports = {

    // 首页
    index: function (req, res) {

        var map = {};
        var sort = {};

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

        sails.models.forum.find()
            .sort(sort)
            .then(function(forums){
                return res.view('content/forum/index', {
                    page: {
                        name: '版块管理',
                        desc: '版块'
                    },
                    data: forums
                });
            })
            .fail(function(err){
                return res.serverError(err);
            });
    },

    create: function(req,res){

        var data = req.body || {};

        if(req.method != 'POST'){
            return res.view('content/forum/edit', {
                page: {
                    name: '创建版块',
                    desc: '创建新的版块'
                },
                data: data
            });
        }

        req.flash('info', data);

        sails.models.forum
            .create({
                name:data.name,
                header:data.header,
                cooldown:data.cooldown,
                lock:data.lock
            })
                .then(function(forum){
                req.flash('success', '创建成功。');
                return res.redirect('/content/forum');
            })
            .fail(function(err){
                req.flash('danger', err);
                return res.redirect('back');
            });

    },

    // 编辑
    update: function(req,res){

        sails.models.forum.findOneById(req.params.id)
            .then(function(forum){

                if(!forum){
                    return res.notFound();
                }

                var data = req.body || forum || {};

                if(req.method != 'POST'){
                    return res.view('content/forum/edit', {
                        page: {
                            name: '编辑版块',
                            desc: '编辑版块的版头和冷却时间'
                        },
                        data: data
                    });
                }

                req.flash('info', data);

                sails.models.forum
                    .update({
                        id:forum.id
                    },{
                        name:data.name,
                        header:data.header,
                        cooldown:data.cooldown,
                        lock:data.lock
                    })
                    .then(function(){
                        req.flash('success', '修改成功');
                        return res.redirect('/content/forum');
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

    // 移除
    remove: function(req,res){

        var map = {};

        if(req.params.id){
            map['id'] =  req.params.id;
        } else if(req.query.ids){
            map['id'] = req.query.ids;
        } else {
            return res.notFound();
        }

        sails.models.forum
            .destroy(map)
            .then(function () {
                req.flash('success', '删除版块 ['+map['id']+'] 成功');
                return res.redirect('/content/forum');
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

        sails.models.forum
            .update({
                id: req.params.id
            }, map)
            .then(function(){
                req.flash('success', '修改成功');
                return res.redirect('/content/forum');
            })
            .fail(function(err){
                req.flash('danger', err);
                return res.redirect('back');
            })
    }

};