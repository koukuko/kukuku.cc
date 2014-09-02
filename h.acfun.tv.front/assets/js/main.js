/**
 * Created by koukuko on 2014/8/2.
 */

var marmottajax=function(a){return marmottajax.get(a)};marmottajax.n=function(a){return a?"string"==typeof a?{url:a}:a:!1},marmottajax.json=function(a){return(a=marmottajax.n(a))?(a.json=!0,new marmottajax.r(a)):void 0},marmottajax.get=function(a){return new marmottajax.r(a)},marmottajax.post=function(a){return(a=marmottajax.n(a))?(a.method="POST",new marmottajax.r(a)):void 0},marmottajax.r=function(a){if(!a)return!1;if("string"==typeof a&&(a={url:a}),"POST"===a.method){var b="?";for(var c in a.options)b+=a.options.hasOwnProperty(c)?"&"+c+"="+a.options[c]:""}else{a.method="GET",a.url+=a.url.indexOf("?")<0?"?":"";for(var c in a.options)a.url+=a.options.hasOwnProperty(c)?"&"+c+"="+a.options[c]:""}this.x=window.XMLHttpRequest?new XMLHttpRequest:new ActiveXObject("Microsoft.XMLHTTP"),this.x.o=a,this.x.c={t:[],e:[]},this.then=function(a){return this.x.c.t.push(a),this},this.error=function(a){return this.x.c.e.push(a),this},this.x.l=function(a,b){for(var c=0;c<this.c[a].length;c++)"function"==typeof this.c[a][c]&&this.c[a][c](b)},this.x.y=function(a){this.l("t",a)},this.x.z=function(a){this.l("e",a)},this.x.onreadystatechange=function(){if(4===this.readyState&&200==this.status){var a=this.responseText;if(this.o.json)try{a=JSON.parse(a)}catch(b){return this.z("invalid json"),!1}this.y(a)}else 4===this.readyState&&404==this.status?this.z("404"):4===this.readyState&&this.z("unknow")},this.x.open(a.method,a.url,!0),this.x.setRequestHeader("Content-type","application/x-www-form-urlencoded"),this.x.send("undefined"!=typeof b?b:null)};

function parseTime(time) {
    var trans;

    trans = function (t) {
        var dayAgo, dt, dtNow, hrAgo, hrMin, longAgo, longLongAgo, minAgo, secAgo, ts, tsDistance, tsNow;
        dt = new Date(t);
        ts = dt.getTime();
        dtNow = new Date;
        tsNow = dtNow.getTime();
        tsDistance = tsNow - ts;
        hrMin = dt.getHours() + ":" + (dt.getMinutes() < 10 ? "0" : "") + dt.getMinutes() + ":" + (dt.getSeconds() < 10 ? "0" : "") + dt.getSeconds();
        longAgo = dt.getMonth() + 1 + "/" + dt.getDate() + " " + hrMin;
        longLongAgo = dt.getFullYear() + "/" + longAgo;
        return longLongAgo;
        if (tsDistance < 0) {
            return"刚刚"
        } else {
            if (tsDistance / 1e3 / 60 / 60 / 24 / 365 | 0 > 0) {
                return longLongAgo
            } else {
                if ((dayAgo = tsDistance / 1e3 / 60 / 60 / 24) > 3) {
                    return longLongAgo
                } else {
                    if ((dayAgo = (dtNow.getDay() - dt.getDay() + 7) % 7) > 2) {
                        return longAgo
                    } else {
                        if (dayAgo > 1) {
                            return"前天 " + hrMin
                        } else {
                            if ((hrAgo = tsDistance / 1e3 / 60 / 60) > 12) {
                                return(dt.getDay() !== dtNow.getDay() ? "昨天 " : "今天 ") + hrMin
                            } else {
                                if ((hrAgo = tsDistance / 1e3 / 60 / 60 % 60 | 0) > 0) {
                                    return hrAgo + "小时前"
                                } else {
                                    if ((minAgo = tsDistance / 1e3 / 60 % 60 | 0) > 0) {
                                        return minAgo + "分钟前"
                                    } else {
                                        if ((secAgo = tsDistance / 1e3 % 60 | 0) > 0) {
                                            return secAgo + "秒前"
                                        } else {
                                            return"刚刚"
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };

    return trans(new Date(time).getTime());

}

function dom(id) {
    return document.getElementById(id);
}


var faceList = ["|∀ﾟ", "(´ﾟДﾟ`)", "(;´Д`)", "(｀･ω･)", "(=ﾟωﾟ)=", "| ω・´)", "|-` )", "|д` )", "|ー` )", "|∀` )", "(つд⊂)", "(ﾟДﾟ≡ﾟДﾟ)", "(＾o＾)ﾉ", "(|||ﾟДﾟ)", "( ﾟ∀ﾟ)", "( ´∀`)", "(*´∀`)", "(*ﾟ∇ﾟ)", "(*ﾟーﾟ)", "(　ﾟ 3ﾟ)", "( ´ー`)", "( ・_ゝ・)", "( ´_ゝ`)", "(*´д`)", "(・ー・)", "(・∀・)", "(ゝ∀･)", "(〃∀〃)", "(*ﾟ∀ﾟ*)", "( ﾟ∀。)", "( `д´)", "(`ε´ )", "(`ヮ´ )", "σ`∀´)", " ﾟ∀ﾟ)σ", "ﾟ ∀ﾟ)ノ", "(╬ﾟдﾟ)", "(|||ﾟдﾟ)", "( ﾟдﾟ)", "Σ( ﾟдﾟ)", "( ;ﾟдﾟ)", "( ;´д`)", "(　д ) ﾟ ﾟ", "( ☉д⊙)", "(((　ﾟдﾟ)))", "( ` ・´)", "( ´д`)", "( -д-)", "(>д<)", "･ﾟ( ﾉд`ﾟ)", "( TдT)", "(￣∇￣)", "(￣3￣)", "(￣ｰ￣)", "(￣ . ￣)", "(￣皿￣)", "(￣艸￣)", "(￣︿￣)", "(￣︶￣)", "ヾ(´ωﾟ｀)", "(*´ω`*)", "(・ω・)", "( ´・ω)", "(｀・ω)", "(´・ω・`)", "(`・ω・´)", "( `_っ´)", "( `ー´)", "( ´_っ`)", "( ´ρ`)", "( ﾟωﾟ)", "(oﾟωﾟo)", "(　^ω^)", "(｡◕∀◕｡)", "/( ◕‿‿◕ )\\", "ヾ(´ε`ヾ)", "(ノﾟ∀ﾟ)ノ", "(σﾟдﾟ)σ", "(σﾟ∀ﾟ)σ", "|дﾟ )", "┃電柱┃", "ﾟ(つд`ﾟ)", "ﾟÅﾟ )　", "⊂彡☆))д`)", "⊂彡☆))д´)", "⊂彡☆))∀`)", "(´∀((☆ミつ"];
var content = dom("content");
if(dom("emotion") && content){
    if(location.href.match(/r\=(\d+)/g)){
        var r = /r\=(\d+)/g.exec(location.href);
        if(r[1]){
            content.value = '>>No.'+r[1]+"\r\n";
        }
    }
    var optionsList = dom("emotion").options;
    for (var i = 0; i < faceList.length; i++) {
        optionsList[1 + i] = new Option(faceList[i], faceList[i]);
    }
    dom("emotion").onchange = function (i) {
        if (this.selectedIndex != 0) {
            content.value += this.value;
            var l = content.value.length;
            content.focus();
            content.setSelectionRange(l, l);
        }
    };
}



var posttimes = document.getElementsByClassName('posttime');
for(var i in posttimes){
    var posttime = posttimes[i];
    posttime.innerText = parseTime(posttime.innerText);
}

marmottajax.json("/homepage/isManager").then(function(data) {
    if(data && data.success){
        var adminTools = document.getElementsByClassName('adminTool');
        for(var i in adminTools){
            var adminTool = adminTools[i];
            if(adminTool.style)
                adminTool.style.display = 'inline';
        }
    }
}).error(function(message) {
    console.error(message);
});

window.onresize = reset = function () { document.getElementById("menu").style.height = (document.documentElement.clientHeight - 60) + "px"; }
$(document).ready(function () {
    $("font[color='#789922']").filter(function () { return /^((>>No\.)|(>))\d+$/.test($(this).text()); }).mouseenter(function (e) {
        var _this = this;
        $.ajax({
            url: "/homepage/ref",
            data: { tid: /\d+/.exec($(this).text())[0] },
            success: function (h) {
                $(_this).parent().append($("#refView").empty().append(h).show());
            }
        });
    });
    $("blockquote").mouseleave(function () { $("#refView").hide(); });
    reset();
    $('input[name=sendbtn]').click(function(){
        checkForm();
    });
});
function checkForm(){

    $('#postform_main').submit();
    return false;
}
