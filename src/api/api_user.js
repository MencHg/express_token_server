const
    Router = require('express').Router(),
    userDb = require('../modules/user_module'),
    verifyDb = require('../modules/verify_moudle'),
    jwt = require('jsonwebtoken'),
    cryptoKit = require('../../utils/kit').cryptoKit,
    passport = require('passport'),
    sendMail = require('../../utils/sendmail')
    ;

Router.post('/user/register', (req, res) => {
    async function register() {
        let findStatus = await userDb.findOne({ email: req.body.email });
        if (findStatus === null && req.body.email) {
            let createStatus = userDb.create({
                email: req.body.email,
                password: req.body.password,
                userinfo: { nickname: req.body.nickname }
            });
            if (createStatus) {
                res.json({
                    message: {
                        tips: "恭喜注册成功~!",
                        code: 1,
                    },
                    token: null
                });
            } else {
                res.json({
                    message: {
                        tips: "创建账号时出错~!",
                        code: 2,
                    },
                    err: createStatus
                });
            }
        } else {
            res.json({
                message: {
                    tips: "该账号被抢先注册~!",
                    code: 2,
                },
            });
        };
    };
    register();
});
Router.post('/user/login', (req, res) => {
    async function login() {
        let isUser = await userDb.findOne({ email: req.body.email });
        if (isUser !== null) {
            if (cryptoKit(req.body.password) === isUser.password) {
                const rule_ = { id_: isUser._id, nickname: isUser.userinfo.nickname, email: isUser.email };
                jwt.sign(rule_, "secret", { expiresIn: 3600 * 24 * 7 }, (err, token) => {
                    if (err) {
                        res.json({ errMsg: "未知错误" })
                    } else {
                        res.json({
                            msg: 'login ok',
                            token: "Bearer " + token,
                            userinfo: isUser.userinfo
                        })
                    }
                });
            } else {
                res.json({ errMsg: "账号密码不匹配~请重试" })
            }
        } else {
            res.json({
                code: "0",
                errMsg: "未找到该账号相关信息，可能是服务器出错，请稍后再试~",
                err
            });
        }
    }
    login()
});
Router.get('/user/userinfo', passport.authenticate("jwt", { session: false }), (req, res) => {
    res.json({
        id: req.user._id,
        userinfo: req.user.userinfo,
        message: {
            tips: "find ok",
            code: 1
        }
    })
});
Router.put('/user/userinfo/rewrite', passport.authenticate("jwt", { session: false }), (req, res) => { //修改用户信息
    async function update() {
        let newData = require('../../utils/kit').rewriteData("userinfo", req.body)
        let update_ = await userDb.updateOne({ _id: req.user._id }, { $set: newData })
        if(update_.ok){
            let user_ = await userDb.findById(req.user._id)
            const rule_ = { id_: user_._id, nickname: user_.userinfo.nickname, email:user_.email};
                jwt.sign(rule_, "secret", { expiresIn: 3600 * 24 * 7 }, (err, token) => {
                    if (err) {
                        res.json({ errMsg: "未知错误" })
                    } else {
                        res.json({
                            message:{
                                tips:"修改成功",
                                code:2
                            },
                            token: "Bearer " + token,
                            more: {
                                id:user_._id,
                                userinfo:user_.userinfo
                            }
                        })
                    }
                });
        }else{
            res.json({
                message:{
                    tips:"修改成功",
                    code:2
                },
                err:update_
            })
        }
        
    }
    update()
});
Router.put('/user/password/rewrite', (req, res) => {
    async function update() {
        let update_ = await userDb.updateOne({ email: req.user.email }, { $set: { password:cryptoKit(req.body.password)} })
        if(update_.ok){
            let user_ = await userDb.findById(req.user._id)
            const rule_ = { id_: user_._id, nickname: user_.userinfo.nickname, email:user_.email};
                jwt.sign(rule_, "secret", { expiresIn: 3600 * 24 * 7 }, (err, token) => {
                    if (err) {
                        res.json({ errMsg: "未知错误" })
                    } else {
                        res.json({
                            message:{
                                tips:"修改成功",
                                code:2
                            },
                            token: "Bearer " + token,
                            more: {
                                id:user_._id,
                                userinfo:user_.userinfo
                            }
                        })
                    }
                });
        }else{
            res.json({
                message:{
                    tips:"修改失败",
                    code:2
                },
                err:update_
            })
        }
        
    }
    update()
});
module.exports = Router;