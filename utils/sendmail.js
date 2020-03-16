const
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    wellknown = require("nodemailer-wellknown");
let transporter, config = wellknown("QQ");
config.auth = {
    user: 'your email', 
    pass: 'your password'
}
transporter = nodemailer.createTransport(smtpTransport(config));
function sendMail(mail, code) {
    let mailOptions = {
        from: "前端明辉<webmingh@qq.com>",
        to: `${mail}`,
        subject: "网站账号验证",
        text: "一封来自前端明辉网站验证邮件",
        html: `
            <section>
            嘿，亲爱的 ${mail}！
            <br/>
            你正在尝试修改密码,如果本次不是您本人操作,请忽略此邮件.
            <br/><br/>
            您本次的验证码:${code} 祝您生活愉快.
            <br/><br/>
            谢谢使用本站服务，
            <br/>
            来自前端明辉.
            </section>
        `
    };
    // send mail with defined transport object
    return new Promise((resolve,reject)=>{
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(error);
                return ;
            };
            resolve(info.response);
        });
    });
};
module.exports = sendMail;