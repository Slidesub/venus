let User = require('../models/user-model');

class UserCtrl {
    static async signin(ctx, next) {
        let result = {
            code: -1,
            msg: '认证失败'
        };
        const data = ctx.request.body;
        let _user = await User.findOne({phone: data.phone});
        if (_user) {
            let isMatch = await _user.comparePW(data.password);
            if (isMatch) {
                let token = await User.signToken(_user.id);
                if (token) {
                    result.code = 1;
                    result.msg='认证成功';
                    result.token = token;
                }
            } 
        }
        ctx.body = result;
    }
    static async signup(ctx) {
        const data = ctx.request.body
        let _user = new User({phone: data.phone, password: data.password})
        await _user.save().then(doc => {
            ctx.body = {
                code: 1,
                msg: '注册成功'
            }
        }).then(err => {
            if (err) {
                throw err;
            }
        })
    }
    static async updatePassword(ctx) {
        let result = {
            code: -1,
            msg: '更新失败'
        };
        const token = ctx.state.user || ctx.header.authorization;
        if (token) {
            const _user = await User.checkToken(token);
            if (_user) {
                const data = ctx.request.body;
                _user.password = data.password;
                if (await _user.save()) {
                    result.code = 1;
                    result.msg = '更新成功';
                }
            }
        }

        actx.body = result;
    }
    static async deleteUser(ctx) {
    
    }
}

module.exports = UserCtrl;