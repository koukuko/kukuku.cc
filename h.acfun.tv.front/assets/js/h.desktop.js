/**
 * Created by koukuko on 2014/10/14.
 */
var h;
var system = {tv:{}}; // 辣鸡 真辣鸡

function initLeftMenu(){
    // 1. 检查侧边栏
    if ($('#h-menu').length > 0) {
        // 1.1 框架高宽自适应
        $(window).resize(function () {
            $('#h-menu').height($(window).height() - $('#h-bottom-nav').height());
        });
        $(window).resize();
        // 1.3 对激活状态的版块active
        if (typeof forum == 'object' && forum.name) {
            $('#h-menu-content a[href="/' + encodeURI(forum.name) + '"]').parent().addClass('h-active');
            $('#h-menu-content .uk-parent').each(function () {
                $(this).find('.h-active').length > 0 ? $(this).find('.h-nav-parent-header').click() : '';
            })
        } else {
            $('.h-nav-parent-header').click();
        }
    }
}

function initPostForm(){
    // 2. 发帖框
    if ($('#h-post-form').length > 0) {
        //2.1 颜文字注册
        if ($('#h-emot-select')) {
            var emotList = ["|∀ﾟ", "(´ﾟДﾟ`)", "(;´Д`)", "(｀･ω･)", "(=ﾟωﾟ)=", "| ω・´)", "|-` )", "|д` )", "|ー` )", "|∀` )", "(つд⊂)", "(ﾟДﾟ≡ﾟДﾟ)", "(＾o＾)ﾉ", "(|||ﾟДﾟ)", "( ﾟ∀ﾟ)", "( ´∀`)", "(*´∀`)", "(*ﾟ∇ﾟ)", "(*ﾟーﾟ)", "(　ﾟ 3ﾟ)", "( ´ー`)", "( ・_ゝ・)", "( ´_ゝ`)", "(*´д`)", "(・ー・)", "(・∀・)", "(ゝ∀･)", "(〃∀〃)", "(*ﾟ∀ﾟ*)", "( ﾟ∀。)", "( `д´)", "(`ε´ )", "(`ヮ´ )", "σ`∀´)", " ﾟ∀ﾟ)σ", "ﾟ ∀ﾟ)ノ", "(╬ﾟдﾟ)", "(|||ﾟдﾟ)", "( ﾟдﾟ)", "Σ( ﾟдﾟ)", "( ;ﾟдﾟ)", "( ;´д`)", "(　д ) ﾟ ﾟ", "( ☉д⊙)", "(((　ﾟдﾟ)))", "( ` ・´)", "( ´д`)", "( -д-)", "(>д<)", "･ﾟ( ﾉд`ﾟ)", "( TдT)", "(￣∇￣)", "(￣3￣)", "(￣ｰ￣)", "(￣ . ￣)", "(￣皿￣)", "(￣艸￣)", "(￣︿￣)", "(￣︶￣)", "ヾ(´ωﾟ｀)", "(*´ω`*)", "(・ω・)", "( ´・ω)", "(｀・ω)", "(´・ω・`)", "(`・ω・´)", "( `_っ´)", "( `ー´)", "( ´_っ`)", "( ´ρ`)", "( ﾟωﾟ)", "(oﾟωﾟo)", "(　^ω^)", "(｡◕∀◕｡)", "/( ◕‿‿◕ )\\", "ヾ(´ε`ヾ)", "(ノﾟ∀ﾟ)ノ", "(σﾟдﾟ)σ", "(σﾟ∀ﾟ)σ", "|дﾟ )", "┃電柱┃", "ﾟ(つд`ﾟ)", "ﾟÅﾟ )　", "⊂彡☆))д`)", "⊂彡☆))д´)", "⊂彡☆))∀`)", "(´∀((☆ミつ"];
            var html = '<option value="">无</option>';
            for (var i in emotList) {
                html += '<option value="' + emotList[i] + '">' + emotList[i] + '</option>';
            }
            $('#h-emot-select')
                .on('change', function () {
                    console.log(this.value);
                    $('textarea[name=content]').val($('textarea[name=content]').val() + this.value).focus();
                })
                .html(html);
        }

        if(location.href.match(/r\=(\d+)/g)){
            var r = /r\=(\d+)/g.exec(location.href);
            if(r[1]){
                $('#h-post-form textarea').val('>>No.'+r[1]+"\r\n");
            }
        }
    }


}

function initImageBox(){
    // 3. 图片处理
    var rotateArray = [
        'matrix(1, 0, 0, 1, 0, 0)',
        'matrix(0, 1, -1, 0, 0, 0)',
        'matrix(-1, 0, 0, -1, 0, 0)',
        'matrix(0, -1, 1, 0, 0, 0)'
    ];

    if ($('.h-threads-img-box').length > 0) {
        $('.h-threads-img-box').each(function () {
            var self = this;
            var imgElement = $(self).find('.h-threads-img');
            var imgAElement = $(self).find('.h-threads-img-a');
            var imgBoxElement = $(self);

            imgAElement.on('click', function () {
                if (imgBoxElement.hasClass('h-active')) {
                    imgElement
                        .attr('src', imgElement.attr('data-src'))
                        .css({
                            transform:'',
                            top: 0,
                            left: 0
                        })
                        .data('rotate-index',0);
                    imgBoxElement
                        .removeClass('h-active');
                } else {
                    imgBoxElement.addClass('h-active');
                    imgElement
                        .attr('src', imgAElement.attr('href'));

                    window.setTimeout(function(){
                        imgElement.resize();
                    },100);
                }
                return false;
            });

            imgElement.on('resize', function () {

                var rotateIndex = $(this).data('rotate-index') || 0;

                var width = $(this).width();
                var height = $(this).height();

                if (rotateIndex == 1 || rotateIndex == 3) {
                    var offset = (width - height) / 2;
                    imgElement.css({
                        top: offset + 'px',
                        left: -offset + 'px'
                    });
                    imgAElement.height(width);

                } else {
                    $(this).css({
                        top: 0,
                        left: 0
                    });
                    imgAElement.height(height);
                }

            });

            $(self).find('.h-threads-img-tool-small').on('click', function () {
                imgAElement.click();
            });

            $(self).find('.h-threads-img-tool-left').on('click', function () {
                var rotateIndex = imgElement.data('rotate-index') || 0;

                if (typeof rotateIndex == 'undefined' || !rotateArray.length) {
                    return false;
                }

                var rotateIndexTarget = rotateIndex - 1;
                if (rotateIndexTarget < 0) rotateIndexTarget = rotateArray.length - 1;

                imgElement.data('rotate-index', rotateIndexTarget);
                imgElement.css('transform', rotateArray[rotateIndexTarget]).resize();
            });

            $(self).find('.h-threads-img-tool-right').on('click', function () {
                var rotateIndex = imgElement.data('rotate-index') || 0;

                if (typeof rotateIndex == 'undefined' || !rotateArray.length) {
                    return false;
                }

                var rotateIndexTarget = rotateIndex + 1;
                if (rotateIndexTarget == rotateArray.length) rotateIndexTarget = 0;

                imgElement.data('rotate-index', rotateIndexTarget);
                imgElement.css('transform', rotateArray[rotateIndexTarget]).resize();
            });

        });

    }
}


function initContent(){
    // 4.绿色引用串显示
    $("font[color='#789922']")
        .filter(function () {
            return /^((>>No\.)|(>>)|(>))\d+$/.test($(this).text());
        })
        .on('mouseenter', function (e) {
            var self = this;
            var tid = /\d+/.exec($(this).text())[0];
            $.get('/homepage/ref?tid='+tid)
                .done(function(data){

                    if(data.indexOf('<!DOCTYPE html><html><head>')>=0){
                        return false;
                    }

                    $("#h-ref-view").off().html(data).css({
                        top:$(self).offset().top,
                        left:$(self).offset().left
                    }).fadeIn(100).one('mouseleave',function(){
                        $(this).fadeOut(100);
                    })
                });
        });

    // 5.主站视频引用
    $('.h-threads-content').each(function(){
        var html = $(this).html();
        var contentIdRegExp = /ac(\d{2,8})/g;
        var codeRegExp = /```\<br\>(.*?)```/g;
        var hideenRegExp = /\[h\](.*?)\[\/h\]/g;
        var isChanged = false;

        if(contentIdRegExp.test(html)){
            isChanged = true;
            html = html.replace(contentIdRegExp,'<a href="http://www.acfun.tv/v/ac$1" data-acfun-contentId="$1" target="_blank">ac$1</a>');
        }

        if(codeRegExp.test(html)  && typeof forum == 'object' && ['技术宅'].indexOf(forum.name) >= 0){
            isChanged = true;
            html = html.replace(codeRegExp,'<code>$1</code>');
        }

        if(hideenRegExp.test(html) && typeof forum == 'object' && ['动画','漫画'].indexOf(forum.name) >= 0){
            isChanged = true;
            html = html.replace(hideenRegExp,'<span class="h-hidden-text">$1</span>');
        }

        if(isChanged){
            $(this).html(html);
        }
    });

    $('a[data-acfun-contentid]').on({

        'mouseenter': function(e){
            var self = this;
            $.getScript('http://api.acfun.tv/apiserver/content/info?cd=1&contentId='+$(this).attr('data-acfun-contentid'))
                .done(function(){

                    if(system.tv.status != 200){
                        return false;
                    }

                    var data = system.tv.data.fullContent;

                    $('.h-acfun-preview-cover').attr('src',data.cover);
                    $('.h-acfun-preview-title').text(data.title).attr('href','http://www.acfun.tv/v/ac'+data.contentId);
                    $('.h-acfun-preview-desc').text(data.description);
                    $('.h-acfun-preivew-user').text(data.user.username).attr('href','http://www.acfun.tv/u/'+data.user.userId+'.aspx');
                    $('.h-acfun-preview-href').text('http://www.acfun.tv/v/ac'+data.contentId).attr('href','http://www.acfun.tv/v/ac'+data.contentId);

                    $("#h-acfun-preview").off().css({
                        top:$(self).offset().top,
                        left:$(self).offset().left
                    }).fadeIn(100).one('mouseleave',function(){
                        $(this).fadeOut(100);
                    })
                });
        }
    });
}
function initAll(){

    initLeftMenu();

    initPostForm();

    initImageBox();

    initContent();

    $.get('/homepage/isManager')
        .done(function(data){
            if(data && typeof data == 'object' && data.success){
                $('.h-admin-tool').fadeIn(100);
            }
        });


}

$(document).ready(function () {
    initAll();
});

