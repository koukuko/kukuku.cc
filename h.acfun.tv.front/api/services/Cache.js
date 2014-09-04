/**
 * 缓存控制
 *
 * @key type:value:format:version
 *
 */

module.exports = {


    /**
     * 获取缓存
     */
    get: function (key) {

        var deferred = Q.defer();

        sails.services.cache.version(key)
            .then(function (version) {

                if (!version || version == null) {
                    deferred.reject(null);
                } else {
                    // 获取最新缓存
                    redis.get(key + ':' + version, function (err, cache) {
                        if (err) {
                            deferred.reject(err);
                        } else if (cache == null) {
                            deferred.reject(null);
                        } else {
                            deferred.resolve(cache);
                        }
                    });
                }
            })
            .fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;


    },

    /**
     * 设置缓存
     */
    set: function (key, value) {

        var deferred = Q.defer();

        sails.services.cache.version(key)
            .then(function (version) {

                if(!version){
                    version = 1;
                }

                if (_.isObject(value)) {
                    value = JSON.stringify(value);
                }

                redis.set(key + ':' + version, value);
                redis.expire(key + ':' + version, 600);

            })
            .fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;

    },

    /**
     * 刷新缓存
     */
    flush: function (key) {

        var deferred = Q.defer();

        if (key.indexOf('*') > 0) {
            redis.eval("return redis.call('del', unpack(redis.call('keys', ARGV[1])))", 0, key, function (err, reply) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(reply);
                }
            });
        } else {
            redis.del(key, function (err, reply) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve(reply);
                }
            });
        }

        return deferred.promise;

    },

    /**
     * 预处理
     * @param key
     * @returns {*}
     */
    prehandleKey:function(rawKey){
        // 如果是 forum: 或者 threads: 先去除页数
        if (rawKey && (rawKey.indexOf('forum:') >= 0 || rawKey.indexOf('threads:') >= 0)) {
            handledKey = /((threads|forum)\:\d+)/g.exec(rawKey);
            if (handledKey != null) {
                return handledKey[1]
            } else {
                return rawKey;
            }
        }

        return rawKey;
    },

    /**
     * 获取版本
     */
    version: function (key) {

        var deferred = Q.defer();

        key = sails.services.cache.prehandleKey(key);

        // 获取最新版本号
        redis.get(key + ':version', function (err, version) {

            if (err) {
                deferred.reject(err);
            } else if (version == null) {
                deferred.resolve(null);
            } else {
                deferred.resolve(version);
            }

        });

        return deferred.promise;
    },

    /**
     * 更新版本
     */
    update: function (key) {

        var deferred = Q.defer();

        key = sails.services.cache.prehandleKey(key);

        sails.services.cache.version(key)
            .then(function (version) {
                if (!version || version == null) {
                    version = 1;
                } else {
                    version = Number(version) + 1;
                }

                redis.set(key + ':version', version);

                deferred.resolve(null);

            })
            .fail(function (err) {
                deferred.reject(err);
            });

        return deferred.promise;
    }

};