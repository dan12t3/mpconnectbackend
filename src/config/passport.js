const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config.js');
const console = require('console');

module.exports = (passport) => {

  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = config.JWTsecret;
  //opts.issuer = config.host;
  //opts.audience = config.front;

  passport.use(new JwtStrategy(opts,(jwtPayload, done) => {
     const user = {}
     console.log("pay",jwtPayload);
     user.id = jwtPayload.id;

     return done(null, user);


  }));

}
