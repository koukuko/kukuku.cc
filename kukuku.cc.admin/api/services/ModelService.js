/**
* ModelServices
*
* @description :: 对Sails的ORM进行的二次抽象
*/

var ModelServices = (function () {

    // 通过sails自带的model扩展
    function ModelServices(modelName) {

        this.modelName = modelName;
        this.model = sails.models[modelName];

        this.default = {
            page:1,
            pagesize:20
        }

    }

    /**
     * 生成列表对象
     * @param {Object} query 检索条件
     *      {
     *          key:value,
     *
     *          key[type]:value,
     *
     *          or[key[,key,key..]]:{string},
     *          or[key[,key,key..]][type]:{string},
     *
     *          page:{int}  (defaultTo:1)
     *          pagesize:{int}  (defaultTo:20)
     *
     *          order:{enmu desc/asc}
     *          by:{string}
     *
     *      }
     *
     *      - type 匹配条件: '<' / 'lessThan'
     *                      '<=' / 'lessThanOrEqual'
     *                       '>' / 'greaterThan'
     *                       '>=' / 'greaterThanOrEqual'
     *                       '!' / 'not'
     *                       'like'
     *                       'contains'
     *                       'startsWith'
     *                       'endsWith'
     *      - or 多个字段为同一个值 多个字段的数组 用,分隔
     *
     *      - page 页数
     *      - pagesize 页容量
     *
     *      - order 倒序正序
     *      - by 根据什么字段
     */
    ModelServices.prototype.list = function (query) {

        var deferred = Q.defer();

        var model = this.model.find();

        // 避免在undefined的情况下取prototype
        var query = query || {};

        // 页数
        var page = _.parseInt(query.page) || this.default.page;
        var pagesize = _.parseInt(query.pagesize) || this.default.pagesize;

        delete query.page;
        delete query.pagesize;

        // 排序
        var order = query.order;
        var by = query.by;

        delete query.order;
        delete query.by;

        // 过滤
        var map = {};
        for(var attr in query){

            // 多个字段
            if(attr == 'or'){

                var keys = query[attr];

                map.or = [];

                // 多个字段不同匹配规则
                if(_.isArray(keys)){
                    for(var i in keys){

                        
                    }

                    continue;
                }

                // 多个字段同一匹配规则
                if(_.isEmpty(keys.key) || _.isEmpty(keys.value)){
                    delete map.or;
                    continue;
                }


                var pair = {};

                // 对值进行二次处理
                var value = keys.value.toString();

                if(value && value[0] == '!'){
                    value = value.substr(1)
                } else if(value.indexOf(',') > 0) {
                    value.split(',');
                }

                // 判断是否有衍生类型
                if(!_.isEmpty(keys.type)){
                    pair[keys.type] = value;
                } else {
                    pair = value;
                }

                // 进行组合
                keys = keys.split(',');

                for(var i in keys){

                    var key = keys[i];

                    var rule = {};
                    rule[key] = value;
                    map.or.push(rule);

                }


                continue;

            }

        }

      return deferred.promise;

    };

    ModelServices.prototype.create = function (body) {
    };

    ModelServices.prototype.update = function (query, body) {
    };

    ModelServices.prototype.set = function (query, body) {
    };

    ModelServices.prototype.remove = function (query) {
    };
    return ModelServices;
})();


module.exports = ModelServices;