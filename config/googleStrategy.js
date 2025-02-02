const GoogleStrategy = require('passport-google-oauth2').Strategy;

const configureGoogleStrategy = (passport, options) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: options.googleClientID,
        clientSecret: options.googleClientSecret,
        callbackURL: options.googleCallbackURL,
        passReqToCallback: true,
      },
      function (request, accessToken, refreshToken, profile, done) {
        // console.log(profile);
        return done(null, profile);
      }
    )
  );
};

module.exports = configureGoogleStrategy;
