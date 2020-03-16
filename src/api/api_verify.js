const 
    verifyDb = require('../modules/verify_moudle'),
    userDb = require('../modules/user_module'),
    sendmail = require('../../utils/sendmail'),
    Router = require('express').Router();
Router.post('/verify/add',(req,res)=>{
    async function verify() {
        let user = await userDb.findOne({email:req.body.email})
        if (user) {
            let codeStatus = await verifyDb.deleteMany({email:req.body.email})
            let code = Math.random().toString().slice(-6);
            let verifyCode = await sendmail(user.email,code)
            if(verifyCode === "250 OK: queued as."){
                let verify_ = await verifyDb.create({
                    email:req.body.email,
                    code,
                    creationtime:Date.now()
                });
                res.json({
                    message:{
                        tips:"验证码邮件已经发送至您的邮箱!!!",
                        code:1
                    },
                    more:verify_.creationtime
                }) 
            }else{
                res.json({
                    message:{
                        tips:"验证码邮件发送失败!!!,可能时您的邮箱设置不正确所致~!",
                        code:2
                    },
                    err:verifyCode
                }) 
            }
        }else{
            res.json({
                message:{
                    tips:"该邮箱账号尚未注册,验证码邮件发送失败~!",
                    code:2
                },
                err:user
            })
        }
    }
    verify()
});
Router.post('/verify/match',(req,res)=>{
    async function match() {
        let match_ = await verifyDb.findOne({email:req.body.email})
        if(match_.code/1 === req.body.code/1){
            let timeline_ = Date.now()
            if(timeline_ - match_.creationtime > 3*60*1000){
                res.json({
                    message:{
                        tips:"验证码过期~!",
                        code:2
                    },
                    more:match_.creationtime
                }) 
            }else{
                let codeStatus = await verifyDb.deleteMany({email:req.body.email})
                res.json({
                    message:{
                        tips:"验证码通过~!",
                        code:1
                    },
                    more:null
                }) 
            }
        }else{
            res.json({
                message:{
                    tips:"验证码错误~!",
                    code:2
                },
                more:match_.creationtime
            })  
        }
    }
    match()
});
module.exports = Router;