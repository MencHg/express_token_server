const 
    express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    mongoUri = require('./utils/key').mongoUri,
    app = express();
mongoose
    .connect(mongoUri,{ useNewUrlParser: true,useUnifiedTopology: true })
    .then(()=>console.log('mongodb ok...'))
    .catch(err=>console.log('mongodb ng...',err));
require('./utils/passport')(passport); 
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('*', (req, res, next) => {  //设置跨域访问
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    res.header("Content-Type","text/html","application/json;charset=utf-8");
    next();
});
//路由
app.use('/jsonk',require('./src/api/api_user'));
app.use('/jsonk',require('./src/api/api_article'));
app.use('/jsonk',require('./src/api/api_verify'));
app.use('/qqxs',require('./src/api/qqxs/qqxs_api'));
app.listen(9926,()=>console.log('服务启动成功..9926'));
