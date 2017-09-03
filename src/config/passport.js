const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config.js');

module.exports = (passport) => {

  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secret = config.JWTSecret;

  passport.use(new JwtStrategy(opts,(jwtPayload, done) => {

    done();

  }));

}
