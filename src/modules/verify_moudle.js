const mongose = require('mongoose');
const verifyScheme = new mongose.Schema({
    email:{
        type:String,
        required:true
    },
    code:{
        type:String,
        required:true
    },
    creationtime:{
        type:Number,
        required:true
    }
});
module.exports = mongose.model('verifys',verifyScheme);