/**
* User.js
*
* @description :: 用户
*/

module.exports = {

    // 字段
    attributes: {

        // 权限
        access: {
            type: 'array',
            defaultsTo: ['manager']
        },

        // 用户名
        name: {
            type: 'string',
            max: 50,
            required: true
        },

        // 密码
        password: {
            type: 'string',
            required: true
        },

        // 盐
        salt: {
            type: 'string',
            required: true
        }

    }
};

