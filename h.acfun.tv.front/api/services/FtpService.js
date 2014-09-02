/**
* FtpService
*
* @description :: 文件上传通用包
*
* - put(buffer) 上传文件
* - list(path) 显示对应路径列表
* - mkdir(path) 创建文件夹
* - exist(path) 对应文件/文件夹是否存在
* - unlink(path) 删除对应文件
*/

var ftp = require('ftp');

var FtpService = (function () {

    function FtpService() {
        this.FtpClient = new ftp();
    }

    FtpService.prototype.initialize = function () {
        var deferred = Q.defer();

        this.ftpClient.on('ready', function () {
            deferred.resolve(this.ftpClient);
        });

        this.ftpClient.on('error', function (err) {
            sails.log.error(err);
            this.ftpClient.end();
        });

        this.ftpClient.connect(H.ftpOptions);

        return deferred.promise;
    };

    FtpService.prototype.put = function () {
    };

    return FtpService;

})();


module.exports = FtpService;