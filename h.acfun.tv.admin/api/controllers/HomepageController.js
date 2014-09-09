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
    },

    /**
     * 登陆
     */
    signin:function(req,res){

        //console.log(req,res);

        if(req.method != 'POST'){
            return res.view('homepage/signin',{
                page:{
                    name: '登陆',
                    desc: '权限者认证'
                }
            });
        }



    }

};

