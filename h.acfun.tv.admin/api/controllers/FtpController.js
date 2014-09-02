/**
 * FtpController
 *
 * @description :: Server-side logic for managing ftps
 * @help        :: See http://links.sailsjs.org/docs/controllers
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

        ftpClient.connect(H.ftpOptions);

        return deferred.promise;
    },

    // 浏览
    index: function (req, res) {

        var remoptePath = req.query.path || '/';

        sails.controllers.ftp.ready()
            .then(function (ftpClient) {
                ftpClient.list(remoptePath, function (err, data) {

                    ftpClient.end();

                    if (err) {
                        req.flash('danger', err.toString());
                        return res.redirect('back');
                    }

                    return res.view('system/ftp/index', {
                        page: {
                            name: 'FTP管理',
                            desc: 'CDN及静态文件管理，主要是静态文件管理。'
                        },
                        path: remoptePath,
                        breadcrumb: remoptePath.split('/'),
                        data: data
                    });

                });
            })
            .fail(function (err) {
                req.flash('danger', err.toString());
                return res.redirect('back');
            });
    },

    // 上传
    put: function (req, res) {

        if (req.method != 'POST') {
            return res.notFound();
        }

        var nowPath = req.body.path || '/';
        nowPath = path.normalize(nowPath);

        req.file('files').upload(
            {
                maxBytes: 200*1024*1024
            },
            function (err, uploadedFiles) {

                if (err) {
                    req.flash('danger', err.toString());
                    return res.redirect('back');
                }

                if (uploadedFiles.length < 1) {
                    req.flash('danger', '没有上传文件');
                    return res.redirect('back');
                }

                if (uploadedFiles[0].size > 200*1024*1024){
                    req.flash('danger', '文件大小被限制在200M以内');
                    return res.redirect('back');
                }

                var localPath = path.normalize(uploadedFiles[0].fd);
                var remotePath = path.normalize(nowPath + '/' + uploadedFiles[0].filename);

                sails.controllers.ftp.ready()
                    .then(function (ftpClient) {

                        ftpClient.put(localPath, remotePath, function (err) {

                            ftpClient.end();

                            if (err) {
                                req.flash('danger', err.toString());
                                return res.redirect('back');
                            }

                            req.flash('success', {
                                message: uploadedFiles.length + ' file(s) uploaded successfully!',
                                files: uploadedFiles
                            });

                            fs.unlink(localPath, function (fsErr) {
                                if (fsErr) sails.log.error(fsErr);
                            });

                            return res.redirect('back');

                        });
                    })
                    .fail(function (err) {

                        fs.unlink(localPath, function (fsErr) {
                            if (fsErr) sails.log.error(fsErr);
                        });

                        req.flash('danger', err.toString());

                        return res.redirect('back');
                    });
            });

    },

    // 创建文件夹
    mkdir: function (req, res) {

        if (req.method != 'POST') {
            return res.notFound();
        }

        var nowPath = req.body.path || '/';
        nowPath = path.normalize(nowPath);

        var dirName = req.body.dirName;

        if (!dirName) {
            return res.notFound();
        }

        var dirPath = nowPath + '/' + dirName;
        dirPath = path.normalize(dirPath);

        sails.controllers.ftp.ready()
            .then(function (ftpClient) {

                ftpClient.mkdir(dirPath, true, function (err) {

                    ftpClient.end();

                    if (err) {
                        req.flash('danger', err.toString());
                        return res.redirect('back');
                    }

                    req.flash('success', '创建文件夹 ' + dirPath + ' 成功');

                    return res.redirect('back');

                });
            })
            .fail(function (err) {

                req.flash('danger', err.toString());

                return res.redirect('back');
            });

    },

    // 删除文件
    remove: function(req,res){

        var files = req.body.files || [];
        var withParent = req.body.withParent;

        if(!files || files == '' || files.length == 0){
            res.notFound();
        }

        if(typeof files == 'string')
            files = [files];

        var handledFiles = files;

        if(withParent && withParent == 'true'){

            for(var i in files){
                var file = files[i];
                if(file.indexOf('/image/')==0){
                    handledFiles.push(file.replace('/image/','/thumb/'));
                } else if(file.indexOf('/thumb/')==0){
                    handledFiles.push(file.replace('/thumb/','/image/'));
                } else if(file.indexOf('/h/upload/th/')==0){
                    handledFiles.push(file.replace('/h/upload/th/','/h/upload/'));
                } else if(file.indexOf('/h/upload2/th/')==0){
                    handledFiles.push(file.replace('/h/upload2/th/','/h/upload2/images/'));
                } else if(file.indexOf('/h/upload2/images/')==0){
                    handledFiles.push(file.replace('/h/upload2/images/','/h/upload2/th/'));
                } if(file.indexOf('/h/upload/')==0){
                    handledFiles.push(file.replace('/h/upload/','/h/upload/th/'));
                }
            }
        }


        req.flash('info', handledFiles);

        sails.controllers.ftp.ready()
            .then(function (ftpClient) {

                function delFiles (remotePath,cb){
                    ftpClient.delete(remotePath, cb);
                }

                async.map(handledFiles,delFiles,function(err,result){
                    if(err){
                        req.flash('danger', err.toString());
                    }

                    req.flash('success', result);

                    return res.redirect('back');

                })
            })
            .fail(function (err) {
                req.flash('danger', err.toString());
                return res.redirect('back');
            });


    }


};

