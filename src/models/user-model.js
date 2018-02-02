const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')
const config = require('../../config')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const SALT_WORK_FACTORY = 10; // 计算强度

const UserSchema = new Schema({
    username: {
        type: String,
        unique: false,
        require: false
    },
    password: {
        type: String,
        unique: false,
        require: true
    },
    phone: {
        type: String,
        unique: false,
        require: false
    },
    email: {
        type: String,
        unique: false,
        require: false
    },
    secret: {
        type: String,
        default: getDefaultHmac()
    },
    created_at: {
        type: Date,
        unique: false,
        require: false
    },
    updated_at: {
        type: Date,
        unique: false,
        require: false,
        default: Date.now()
    }
});
UserSchema.pre('save', function (next) {
    let user = this;
    // 当密码没有修改时不进行重复加密
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTORY, (err, salt) => {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        })
    })
});

function getDefaultHmac() {
    const hamc = crypto.createHmac('sha256', config.secret)
    hamc.update(Date.now().toString())
    return hamc.digest('hex')
};

UserSchema.methods.comparePW = async function (candidatePW) {
    try {
        let that = this;
        let isMatch = await bcrypt.compare(candidatePW, that.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

UserSchema.statics.signToken = async function (id) {
    try {
        const secret = getDefaultHmac();
        let _user = await this.findOneAndUpdate({_id: id}, {secret: secret});
        if (_user) {
            let token = jwt.sign({id: id, secret: secret}, config.secret, {expiresIn: 3600});
            let payload = jwt.verify(token, config.secret)
            return token;
        } else {
            throw new Error({code: 0, msg: 'token 未通过验证'})
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

UserSchema.statics.checkToken = async function (token) {
    try {
        let payload = jwt.verify(token, config.secret)
        let _user = await this.findOne({_id: payload.id});
        if (_user && _user.secret === payload.secret) {
            return _user;
        } else {
            throw new Error({code: 0, msg: 'token 未通过验证'})
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
    
};
module.exports = mongoose.model('User', UserSchema);