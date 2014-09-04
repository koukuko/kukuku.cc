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
var path = require('path');
var ftp = require('ftp');
var fs = require('fs');

module.exports = {

    ready: function () {

        var deferred = Q.defer();

        // Ftp 初始化
        var ftpClient = new ftp();

        ftpClient.on('ready', function () {
            deferred.resolve(ftpClient);
        });

        ftpClient.on('error', function (err) {
            sails.log.error(err);
            ftpClient.end();
        });

        ftpClient.connect(sails.config.connections.ftpServer);

        return deferred.promise;
    }
};

