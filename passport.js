var localStrat = require('passport-local').Strategy;
var bcrypt = require('bcrypt');


function initializePassport(passport, getUserByEmail){
    async function authenticateUser(email, password, done){
        let user = getUserByEmail(email);
        if(user == null){
            return done(null, false, {message: 'No user with that email'});
        }
    
        try{
            if(await bcrypt.compare(password, user.password)){
                return done(null, user);
            }
            else{
                return done(null, false, {message: 'Invalid password'});
            }
        }
        catch (error){
            return done(error);
        }
    }
    passport.use(new localStrat({usernameField: 'email'}, authenticateUser));
    passport.serializeUser(function (user, done){return done(null, user.email)});
    passport.deserializeUser(function(email, done){return done(null, getUserByEmail(email))})
}

module.exports = initializePassport;