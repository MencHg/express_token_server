const 
    iconv = require('iconv-lite'),
    axios = require('axios');
module .exports = {
    url:"",
    request(url) {
        this.url = url;
        return  new Promise((resolve,reject)=>{
            axios({
                url:this.url,
                responseType: 'stream',
            }).then((result) => {
                console.log("axios:请求成功了,返回stream");
                this.transcode(result.data).then(html_data=>{
                    console.log("转码成功");
                    resolve(html_data);
                }).catch(err=>{
                    console.log("转码失败",err);
                })
            }).catch((err) => {
                console.log("stream:请求失败了"); //,url+tags[4].type+page+"/"
                reject(err);
            });
        });
    },
    transcode(html){
        return new Promise((resolve,reject)=>{
            console.log("transcode:解析stream");
            let stream_str = [],
                html_data = null;
            html.on('data', stream => {
                stream_str.push(stream);
                console.log("data");
            });
            html.on("error", error => {
                console.log(error);
                reject(error);
            });
            html.on('end', () => {
                console.log("iconv:开始转码");
                let buffer_str = Buffer.concat(stream_str);
                html_data = iconv.decode(buffer_str, 'gbk');
                console.log('gbk_html转码成功')
                resolve(html_data);
            });
        });
    }
};