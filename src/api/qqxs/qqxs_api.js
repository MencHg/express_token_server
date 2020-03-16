const router = require('express').Router();
const {JSDOM} = require('jsdom');
const transcode = require('../../../utils/transcode');
let url = "https://www.qqxs.cc/";

router.get('/home',(req,res)=>{ //首页资源
    async function start(){
        let data = await transcode.request('https://www.qqxs.cc/');
        try {
            let root_ = new JSDOM(data);
            let eles_Head = root_.window.document.querySelectorAll('#hotcontent div.l .item'),
                eles_top = root_.window.document.querySelectorAll('#main .novelslist ul li');
            let banner = [],list = [];
            eles_Head.forEach(item => {
                let o_ = {
                    cover_image:item.querySelector('.image a img').src,
                    link:item.querySelector('.image a').href.slice(23),
                    title:item.querySelector('dl dt a').textContent,
                    desc:item.querySelector('dl dd').textContent,
                }
                banner.push(o_);
            });
            eles_top.forEach(item=>{
                let o_ = {
                    link:item.querySelector('a').href.slice(23),
                    title:item.textContent
                }
                list.push(o_);
            });
            res.json({
                message:"find ok",
                code:1,
                result:{
                    banner,
                    list
                }
            })
        } catch (error) {
            res.json({
                message:"id is not undefined",
                code:2,
                result:error
            })
        }
    } 
    start()
})
router.get('/chaplist',(req,res)=>{ //文章章节列表以及介绍
    function getlist(eles,arr) {
        eles.forEach(item=>{
            let obj_ = {
                link:item.href,        
                title:item.textContent
            };
            arr.push(obj_);
        });
    };
    async function start(){
        let data = await transcode.request(url+"xs/"+req.query.id);
        let dom_ = new JSDOM(data);
        try {
            let introEle = dom_.window.document.querySelector('#webhtml #maininfo'),
                recommentEle = dom_.window.document.querySelectorAll('#webhtml .box_con .tjlist a'),
                listEle = dom_.window.document.querySelectorAll('#webhtml .box_con #list dd a');
            let articleList = {
                cover_image:introEle.querySelector('#fmimg img').src,
                article_title:introEle.querySelector('#info h1').textContent,
                author:introEle.querySelector('#info p a').textContent,
                article_intro:introEle.querySelector('#info .introtxt').textContent.replace(/\s+/g,""),
                article_status:introEle.querySelectorAll('#info p')[1].textContent,
                recomment:[],
                article_list:[],
            };
            getlist(recommentEle,articleList.recomment);
            getlist(listEle,articleList.article_list);
            res.json({
                message:"find ok",
                code:1,
                articleList
            });
        } catch (error) {
            res({
                message:"id is not undefined",
                code:2,
                result:error
            })
        }
    } 
    start()
})
router.get('/detail',(req,res)=>{ //文章阅读
    async function start(){
        let data = await transcode.request(url+"xs/"+req.query.id);
        let dom_ = new JSDOM(data);
        let eles = dom_.window.document.getElementById('contentBody');
        try {
            let article = {
                title:eles.querySelector('.zhangjieming h1').textContent,
                content:eles.querySelector('#contentBody .zhangjieTXT').innerHTML.replace(/&nbsp;|\s+/g,"").split("<br>").splice(1),
                article_next:eles.querySelectorAll('#contentBody .bottem a')[3].href.slice(23),
                article_prev:eles.querySelectorAll('#contentBody .bottem a')[1].href.slice(23)
            };
            res.json({
                message:"find ok",
                code:1,
                result:article
            })
        } catch (error) {
            res.json({
                message:"id is not undefined",
                code:2,
                result:error
            })
        }
    } 
    start()
})
router.get('/category',(req,res)=>{ //分类以及分页
    let type = req.query.type || "fenlei1/"
    let page = req.query.page || 1
    async function start(){
        let data = await transcode.request(url+type+page);
        let dom_ = new JSDOM(data);
        try {
            let elemens = dom_.window.document.querySelectorAll('#main #alist #alistbox');
            let page_number = dom_.window.document.querySelector('.articlepage #pagelink .last').textContent / 1;
            let list = [];
            elemens.forEach(item => {
                let obj_ = {
                    cover_image: item.querySelector('.pic a img').src,
                    title: item.querySelector('.info h2 a').textContent,
                    link: item.querySelector('.info h2 a').href.slice(23),
                    author: item.querySelector('.info .title span').textContent,
                    desc: item.querySelector('.info .intro').textContent.replace(/\s+/g,""),
                    article_count: item.querySelector('.info .sys a').textContent,
                }
                list.push(obj_);
            });
            res.json({
                message:"find ok",
                code:1,
                result:{
                    page_number,
                    list
                }
            })
        } catch (error) {
            res.json({
                message:"id is not undefined",
                code:2,
                result:error
            })
        }
    } 
    start()
})
router.get('/comment',(req,res)=>{
    
})
module.exports = router;