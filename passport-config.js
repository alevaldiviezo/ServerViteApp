// server/passport-config.js
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

const initialize = (passport) => {
    const authenticateUser = (username, password, done) => {
        User.authenticate()(username, password, (err, user, info) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'No user with that username' });
            }
            return done(null, user);
        });
    };

    passport.use(new LocalStrategy(authenticateUser));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
};

module.exports = initialize;