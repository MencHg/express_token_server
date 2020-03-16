const crypto = require('crypto');
module.exports = {
    initTime(time){
        let timer_ = new Date(time)
            let timeStr = timer_.toString().split(' ');
            return `${timeStr[3]}-${('0'+(timer_.getMonth()+1)).slice(-2)}-${timeStr[2]} ${timeStr[4]} ${'周'+'日一二三四五六'.charAt(timer_.getDay())}`
    },
    cryptoKit(opts) {
        let newData = crypto.createHash('sha256').update(opts).digest('hex');
        return newData
    },
    rewriteData(keywords,data){
        let update_obj = {}
        for(let [key,value] of Object.entries(data)){
            if(value){
                update_obj[keywords+"."+key] = value
            }
        }
        return update_obj;
    }
};