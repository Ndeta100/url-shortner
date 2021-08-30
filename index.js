
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
var MemoryStore = require('memorystore')(expressSession)

const flash = require('connect-flash');

const app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use('/static',express.static(`${__dirname}/static`))
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res)=>{
    res.render('index')
})
const mongoURI = require('./config/monkoKEY');
// mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true, },).then(() => console.log("Connected !"),);
const connectDB=async ()=>{
    try {
        const  conn= await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useCreateIndex:true,
            useFindAndModify:false,
            useUnifiedTopology: true 
        })
        console.log('Mongodb connected')
    } catch (error) {
        
        console.log('mongo disconnected')
    }
  
   
   }
   connectDB()
app.use(cookieParser('random'));

app.use(expressSession({
    secret: "random",
    resave: true,
    saveUninitialized: true,
    // setting the max age to longer duration
    maxAge: 24 * 60 * 60 * 1000,
    store: new MemoryStore(),
}));



app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_messages = req.flash('success_messages');
    res.locals.error_messages = req.flash('error_messages');
    res.locals.error = req.flash('error');
    next();
});

app.use(require('./controller/routes.js'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log("Server Started At " + PORT));