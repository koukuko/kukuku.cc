/**
 * CacheController
 *
 * @description :: 缓存控制器
 */

module.exports = {


    // 首页
    index: function (req, res) {

        // 获取所有键
        redis.dbsize( function (err, count) {
            if (err) {
                return res.serverError(err);
            }

            return res.view('system/cache/index', {
                page: {
                    name: '缓存管理',
                    desc: '全站通用缓存管理'
                },
                count:count
            });

        });

    },

    /**
     * 清除缓存
     */
    flush: function (key) {

        var deferred = Q.defer();

        if (!key) {
            deferred.reject('ILLEGAL KEY');
        } else {
            if (key.indexOf('*') > 0) {
                redis.eval("return redis.call('del', unpack(redis.call('keys', ARGV[1])))", 0, key, function (err, reply) {
                    if (err) {
                        deferred.reject(err.toString());
                    } else {
                        deferred.resolve(reply);
                    }
                });
            } else {
                redis.del(key, function (err, reply) {
                    if (err) {
                        deferred.reject(err.toString());
                    } else {
                        deferred.resolve(reply);
                    }
                });
            }
        }

        return deferred.promise;

    },

    flushCache: function (req, res) {

        var key = req.query.key;

        req.flash('info', key);

        sails.controllers.cache.flush(key)
            .then(function(){
                req.flash('success', '删除成功。');
            })
            .fail(function(err){
                req.flash('danger', err);
            })
            .fin(function(){
                return res.redirect('/system/cache');
            });

    }
};