Date.prototype.format = function (fmt) {
    var o = {
        "M{1,2}": this.getMonth() + 1, //月份
        "d{1,2}": this.getDate(), //日
        "h{1,2}": this.getHours(), //小时
        "m{1,2}": this.getMinutes(), //分
        "s{1,2}": this.getSeconds(), //秒
        "q{1,2}": Math.floor((this.getMonth() + 3) / 3), //季度
        "S{1,3}": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) {
            var v = o[k] + '';
            while (v.length < RegExp.$1.length) {
                v = '0' + v;
            }
            fmt = fmt.replace(RegExp.$1, v);
            /*fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1)
             ? (o[k])
             : (("00" + o[k]).substr(("" + o[k]).length)));*/
        }
    return fmt;
};
/**
 * 获取浏览器唯一标识(依赖canvas)
 * @param domain
 */
function browserId() {
    var txt          = window.location.host + window.location.pathname;
    var canvas       = document.createElement('canvas');
    var ctx          = canvas.getContext("2d");
    var bin2hex      = function (s) {
        var i, l, o = '',
            n;
        s += '';
        for (i = 0, l = s.length; i < l; i++) {
            n = s.charCodeAt(i)
                .toString(16);
            o += n.length < 2 ? '0' + n : n;
        }
        return o;
    }
    ctx.textBaseline = "top";
    ctx.font         = "14px 'Arial'";
    ctx.textBaseline = "tencent";
    ctx.fillStyle    = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText(txt, 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText(txt, 4, 17);

    var b64 = canvas.toDataURL().replace("data:image/png;base64,", "");
    var bin = atob(b64);
    var crc = bin2hex(bin.slice(-16, -12));
    return crc;
}

/* 浏览器信息 */
function browserInfo() {
    return {
        versions: function () {
            var u = navigator.userAgent;
            app = navigator.appVersion;//浏览器版本
            return {
                //移动终端浏览器版本信息
                trident  : u.indexOf('Trident') > -1, //IE内核
                presto   : u.indexOf('Presto') > -1, //opera内核
                webKit   : u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                gecko    : u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                mobile   : !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                ios      : !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                android  : u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                iPhone   : u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                iPad     : u.indexOf('iPad') > -1, //是否iPad
                webApp   : u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
                weChat   : u.indexOf('MicroMessenger') > -1,//是否是微信浏览器
                QQ       : /\sQQ/.test(u) || u.indexOf('MQQBrowserQQ') > -1, //是否QQ内置前者ISO后者Android
                QQBrowser: u.indexOf('MQQBrowserQQ') == -1 && u.indexOf('MQQBrowser') > -1//QQ浏览器

            };
        }(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase()//语言
    };
}
