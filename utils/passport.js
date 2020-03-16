const passportJwt = require('passport-jwt');
const userDataBase = require('../src/modules/user_module'); 
let JwtStrategy = passportJwt.Strategy,
    ExtractJwt = passportJwt.ExtractJwt;
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'secret';
module.exports = passpost => {
    passpost.use(new JwtStrategy(opts,(jwt_payload,done)=>{
        userDataBase.findById(jwt_payload.id_)
            .then(user_=>{
                if(user_){
                    return done(null,user_)
                }else{
                    return done(null,false)
                }
            })
            .catch(err=>{res.json(err);})
    }))
}