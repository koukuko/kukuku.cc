/**
 * AcFun 匿名版 - 实用工具库
 */

module.exports = {

    /**
     * 检查需要类型并输出
     * @param param
     */
    checkWantType: function (param) {

        var result = {
            param: param || '',
            isMobile: false,
            isXml: false,
            isJson: false,
            suffix: ''
        };

        switch (result.param) {
            case 'json':
                result.isJson = true;
                result.suffix = ':json';
                break;
            case 'mobile':
                result.isMobile = true;
                result.suffix = ':mobile';
                break;
            case 'xml':
                result.isXml = true;
                result.suffix = ':xml';
                break;
            case 'desktop':
            default:
                result.suffix = ':desktop';
                break;
        }

        return result;

    },

    unix_to_datetime: function (time) {
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

};