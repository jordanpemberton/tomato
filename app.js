var express = require('express');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('express-flash');
var session = require('express-session');

var initializePassport = require('./passport');
initializePassport(passport, function(email){
    return users.find(user => user.email === email)
});

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());
app.use(session({
    secret: 'secretTomato',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/static', express.static('public'));
app.set('views', 'views');
app.engine('html', require('ejs').renderFile);

const users = [];

app.get('/', function (req, res){
    res.render('signin.html');
})

app.get('/signup', function(req, res){
    res.render('signup.html');
})

app.get('/tasks', function(req, res){
    res.render('tasks.html');
})

app.get('/timer', function(req, res){
    res.render('timer.html');
})

app.post('/', passport.authenticate('local', {
    successRedirect: '/tasks',
    failureRedirect: '/',
    failureFlash: true 
}))

app.post('/signup', async function(req,res){
    try{
        let encryptedPassword = await bcrypt.hash(req.body.password, 10);
        users.push({
            email: req.body.email,
            password: encryptedPassword
        })
        res.redirect('/');
    }
    catch{
        res.redirect('/signup');
    }
    console.log(users);
})


app.listen(3000);