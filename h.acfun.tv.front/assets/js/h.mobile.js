/**
 * Created by yuxing on 2014/10/14.
 */
var h;

$(document).ready(function () {

    // 1. 检查url上是否有r=***;
    var wantReply = /r\=(\d+)/.exec(location.href);
    wantReply = wantReply ? wantReply[1] : null;

    if (wantReply) {
        $('#h-post-form').removeClass('uk-hidden');

        if ($('textarea[name=content]')) {
            $('textarea[name=content]').val(">>" + wantReply + "\r\n")
        }
    }

    // 2. 添加颜文字
    if ($('#h-emot-select')) {
        var emotList = ["|∀ﾟ", "(´ﾟДﾟ`)", "(;´Д`)", "(｀･ω･)", "(=ﾟωﾟ)=", "| ω・´)", "|-` )", "|д` )", "|ー` )", "|∀` )", "(つд⊂)", "(ﾟДﾟ≡ﾟДﾟ)", "(＾o＾)ﾉ", "(|||ﾟДﾟ)", "( ﾟ∀ﾟ)", "( ´∀`)", "(*´∀`)", "(*ﾟ∇ﾟ)", "(*ﾟーﾟ)", "(　ﾟ 3ﾟ)", "( ´ー`)", "( ・_ゝ・)", "( ´_ゝ`)", "(*´д`)", "(・ー・)", "(・∀・)", "(ゝ∀･)", "(〃∀〃)", "(*ﾟ∀ﾟ*)", "( ﾟ∀。)", "( `д´)", "(`ε´ )", "(`ヮ´ )", "σ`∀´)", " ﾟ∀ﾟ)σ", "ﾟ ∀ﾟ)ノ", "(╬ﾟдﾟ)", "(|||ﾟдﾟ)", "( ﾟдﾟ)", "Σ( ﾟдﾟ)", "( ;ﾟдﾟ)", "( ;´д`)", "(　д ) ﾟ ﾟ", "( ☉д⊙)", "(((　ﾟдﾟ)))", "( ` ・´)", "( ´д`)", "( -д-)", "(>д<)", "･ﾟ( ﾉд`ﾟ)", "( TдT)", "(￣∇￣)", "(￣3￣)", "(￣ｰ￣)", "(￣ . ￣)", "(￣皿￣)", "(￣艸￣)", "(￣︿￣)", "(￣︶￣)", "ヾ(´ωﾟ｀)", "(*´ω`*)", "(・ω・)", "( ´・ω)", "(｀・ω)", "(´・ω・`)", "(`・ω・´)", "( `_っ´)", "( `ー´)", "( ´_っ`)", "( ´ρ`)", "( ﾟωﾟ)", "(oﾟωﾟo)", "(　^ω^)", "(｡◕∀◕｡)", "/( ◕‿‿◕ )\\", "ヾ(´ε`ヾ)", "(ノﾟ∀ﾟ)ノ", "(σﾟдﾟ)σ", "(σﾟ∀ﾟ)σ", "|дﾟ )", "┃電柱┃", "ﾟ(つд`ﾟ)", "ﾟÅﾟ )　", "⊂彡☆))д`)", "⊂彡☆))д´)", "⊂彡☆))∀`)", "(´∀((☆ミつ"];
        var html = '<option value="">颜文字</option>';
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

    // 3. 提示
    function attachTooltip(elem) {

        if (elem.attr('data-title')) {
            return showTooltip(elem, true);
        } else {

            var id = /(\d+)/.exec(elem.text());
            id = id ? id[1] : null;

            if (!id) {
                elem.attr('data-title', '');
                return false;
            }

            $.get('/homepage/ref.mobile?tid=' + id)
                .done(function (html) {
                    elem.attr('data-title', html);
                    return showTooltip(elem, true);
                });
        }
    }

    function showTooltip(elem, retry) {

        var html = elem.attr('data-title');

        if (typeof html == 'undefined') {
            if (!retry) {
                return attachTooltip(elem);
            }
        } else if (html == '') {
            return false;
        }

        if ($('.uk-tooltip').length == 0) {
            $('body').append('<div class="uk-tooltip h-tooltip" style="visibility: visible;display: none;"><div class="uk-tooltip-inner"></div>')
        }

        var tooltip = $('.uk-tooltip .uk-tooltip-inner').html(html);
        $('.uk-tooltip').css({
            top:elem.offset().top + elem.height(),
            left:elem.offset().left + elem.width() / 2,
            width: $(window).width() - elem.width() / 2 - 70
        }).fadeIn(100);
        // debugger;

    }

    $('font[color=#789922]').on('mouseenter', function () {

        console.log('mouseenter')

        showTooltip($(this));

        $(this).one('mouseleave', function () {
            $('.uk-tooltip').fadeOut(100);
        });

    });


});

