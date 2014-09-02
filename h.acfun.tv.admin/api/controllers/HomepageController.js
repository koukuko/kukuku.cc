/**
 * HomepageController
 *
 * @description :: 首页
 */

module.exports = {

    /**
     * 首页
     */
    index:function(req,res){
        return res.view('homepage/index',{
           page:{
               name: '首页',
               desc: '顺猴者昌，逆猴者亡'
           }
        });
    }

};

