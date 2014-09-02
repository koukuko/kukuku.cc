/**
 * Log.js
 *
 * @description :: 日志
 */

module.exports = {

    migrate: 'alter', // WARN: DEV ONLY!

    attributes: {
        controllers: 'string',
        action: 'string',
        param: 'string',
        user: 'string',
        ip: 'string'
    },

    create: function (controllers, action, param, user, req) {

        if(req){
            var ip = req.headers['x-forwarded-for'] ||
                req.connection.remoteAddress ||
                req.socket.remoteAddress ||
                req.connection.socket.remoteAddress ||
                '0.0.0.0';
        } else {
            var ip = '0.0.0.0';
        }

        sails.models.log
            .create({
                controllers: controllers,
                action: action,
                param: param,
                user: user,
                ip: ip
            })
            .exec(function (err,log) {

            });
    }
};

