const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                console.log("Google profile:", profile);

                const email = profile.emails?.[0]?.value;
                const fullname = profile.displayName;

                // Hozircha keyingi bosqichda PostgreSQL bilan ulaymiz
                return done(null, {
                    email,
                    fullname,
                    googleId: profile.id,
                });

            } catch (error) {
                return done(error, null);
            }
        }
    )
);

module.exports = passport;