const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userModel");
const crypto = require("crypto");

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: (process.env.GOOGLE_CALLBACK_URL || 'http://localhost:8000/api/auth/google/callback').replace(/\/$/, ''),
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ email: profile.emails[0].value });

          if (!user) {
            const oauthPassword = crypto
              .randomBytes(12)
              .toString("base64")
              .replace(/[^a-zA-Z0-9]/g, "")
              .slice(0, 8);

            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: oauthPassword,
              avatar: profile.photos?.[0]?.value || "",
            });
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );
} else {
  console.warn("[passport] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set — Google OAuth disabled.");
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

module.exports = passport;