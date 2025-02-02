const configureGoogleStrategy = require("./googleStrategy.js")

const configurePassport = ({passport, ...options}) => {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser(async (user, done) => {
    done(null, user);
  });

  configureGoogleStrategy(passport, options)

};

module.exports = configurePassport;