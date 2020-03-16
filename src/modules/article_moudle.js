const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;
const articleSechema = new mongoose.Schema({
    article_title:{
        type:String,
        required:true
    },
    article_intro:{
        type:String,
        required:true,
    },
    article_contnet:{
        type:String,
        required:true,
    },
    tags:{
        type:String,
        required:true,
        default:""
    },
    category:{
        type:String,
        default:""
    },
    author:{
        type:ObjectId,
        ref:'users'
    },
    cover_image:{
        type:String,
        default:""
    },
    creationtime:{
        type:Date,
        default:new Date()
    },
    
    star_count:{
        type:Number,
        default:0
    },
    look_count:{
        type:Number,
        default:0
    },
});
module.exports = mongoose.model('articles',articleSechema);