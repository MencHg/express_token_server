const mongoose = require('mongoose');
const cryptoKit = require('../../utils/kit').cryptoKit
const userSechema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        match: /^\w+@[a-z0-9]+\.[a-z]+$/i
    },
    password:{
        type:String,
        required:true,
    },
    userinfo:{
        nickname:{
            type:String,
            default:"未设置昵称"
        },
        avatarUrl:{
            type:String,
            default:"https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3552689717,4084494534&fm=26&gp=0.jpg"
        },
        intro:String,
        grend:String,
        city:String,
        phone: {
            type: String,
            match: /^1[3-9]\d{9}$/,
        },
        creationtime:{
            type:Date,
            default:new Date(),
        }
    },
});
userSechema.pre('save',function(next){
    let pwd_ = cryptoKit(this.password);
    this.password = pwd_;
    next();
});
module.exports = mongoose.model('users',userSechema);