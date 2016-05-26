/**
 * AC匿名版 - 桌面Web - Javascript
 *
 * @author Akino Mizuho.Koukuko
 */
var h;
(function (h) {

    /**
     * 配置
     */
    var settings = (function () {
        
        function settings(){
            this.key = 'h_desktop_settings';
            this.localSettings = {};
            this.defaultSettings =  {

                theme: 'default',                       // {enum} 主题

                style: {
                    contentAlign: 'left',               // {enum} 内容对齐模式
                    limitPageWidth: true,               // {bool} 限制页面宽度
                    hidePostForm: false,                // {bool} 默认隐藏发帖框
                    autoHideLeftNav: false,             // {bool} 自动隐藏左侧菜单
                    autoHideBottomNav: false            // {bool} 允许关闭底部菜单
                },
                background: {
                    enable: false,                      // {bool} 是否启用
                    url: '',                            // {string(url)} 背景图片
                    align: 'top',                       // {enum} 对齐方式
                    repeat: 'no'                          // {enum} 平铺
                },
                content: {
                    size: 16,                           // {int} 字号
                    showThumb: true,                    // {bool} 默认显示图片缩略图
                    clickImage: 'zoom',                 // {enum} 点击图片默认操作 (jump:跳转 zoom:缩放 slideshow:幻灯片)
                    clickAcFunId: 'jump',               // {enum} 点击引用AcfunId的操作 (jump:跳转 play:直接播放)
                    quickReply: true,                   // {book} 点击No.号码启动快速回复
                    formatPostTime: 'default'           // {enmu} 格式化发帖时间 (default:默认 countdown:倒计时)
                },
                post: {
                    autoFeed: false,                    // {bool} 发串后自动订阅
                    backto: 'lastpage'                  // {bool} 发串结束后跳转到 (lastpage:最后一页 forumindex:版块首页)
                },
                filter: {                               // 过滤
                    keyword: [],                        // 关键词
                    userId: []                          // 饼干ID
                },
                lab: {
                    colorfullId: false,                  // {bool} 给所有人的ID上色，依次来辨别串内人物
                    allowOnlyShowPosterThreads: false    // {bool} 显示只看po主按钮
                }
            }
        }

        settings.prototype.load = function(){

        }

        settings.prototype.save = function(){

        }

        return settings;

    })();

})(h || (h = {}));
