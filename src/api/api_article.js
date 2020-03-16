const 
    articleDb = require('../modules/article_moudle'),
    Router = require('express').Router(),
    passport = require('passport');
Router.get('/article/list',(req,res)=>{ //分页路由
    let count = req.query.count || 30;
    articleDb
        .find()
        .sort({_id:-1})
        .limit(count)
        .skip(count*req.query.page)
        .then(result=>{
            res.json({
                message:{
                    tips:"find ok~!",
                    code:1
                },
                list:result,
                more:''
            })
        })
        .catch(err=>{
            res.json({
                message:{
                    tips:"数据获取失败~!",
                    code:2
                },
                list:[],
                more:err
            })
        })

})
Router.get('/article/detail',(req,res)=>{ //阅读文章的路由
    articleDb
        .findById(req.query.id)
        .populate({
            path:'author',
            select:'_id nickname avatarUrl'
        })
        .then(result=>{
            res.json({
                message:{
                    tips:"find ok~!",
                    code:1
                },
                article:result,
                more:''
            })
        }).catch(err=>{
            res.json({
                message:{
                    tips:"数据获取失败~!",
                    code:2
                },
                list:[],
                more:err
            }) 
        })

})
//以下三个是需要验证用户身份的路由
Router.post('/article/write',passport.authenticate("jwt", { session: false }),(req,res)=>{  //发布文章
    articleDb.create({
        article_title:req.body.title,
        article_intro:req.body.intro,
        article_contnet:req.body.contnet,
        tags:req.body.tags,
        category:req.body.category,
        author:req.user._id,
        cover_image:req.body.cover_image,
    }).then(result=>{
        res.json({
            message:{
                tips:"恭喜你!文章发布成功~!",
                code:1
            },
            more:result.creationtime
        })
    }).catch(err=>{
        res.json({
            message:{
                tips:"未知错误~!请稍后再试...",
                code:2
            },
            err
        })
    })
})
// articleDb.find().then(data=>console.log(data)).catch()
Router.put('/article/rewrite',passport.authenticate("jwt", { session: false }),(req,res)=>{ //修改文章
    async function rewrite() {
        let article_ = await articleDb.findById(req.body.id)
        if(article_.author == req.user.id){
            let update_ = await articleDb.updateOne({_id:req.body.id},{$set:{
                article_title:req.body.title,
                article_intro:req.body.intro,
                article_contnet:req.body.contnet,
                tags:req.body.tags,
                category:req.body.category,
                author:req.user._id,
                cover_image:req.body.cover_image,
            }})
            res.json({
                message:{
                    tips:"操作成功!!!,目标文章已修改~!",
                    code:1
                },
                more:article_.creationtime
            })
        }else{
            res.json({
                message:{
                    tips:"操作失败!!!,你不是该文章的作者~!",
                    code:2
                },
                err:article_.author
            })
        }
    }   
    rewrite()
})
Router.delete('/article/remove',passport.authenticate("jwt", { session: false }),(req,res)=>{ //删除文章
    async function remove() {
        let article_ = await articleDb.findById(req.body.id)
        if(article_.author == req.user.id){
            let clear_ = await articleDb.deleteOne({_id:req.body.id})
            res.json({
                message:{
                    tips:"操作成功!!!,目标文章已被清除~!",
                    code:1
                },
                clear_
            })
        }else{
            res.json({
                message:{
                    tips:"操作失败!!!,你不是该文章的作者~!",
                    code:2
                },
                err:article_.author
            })
        }
    }   
    remove()
})
module.exports = Router;