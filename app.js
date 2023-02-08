if(process.env.NODE_ENV!=="production"){
  require('dotenv').config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

// login part
const passport = require('passport');
const LocalStrategy = require('passport-local')
const session = require("express-session");
const User = require('./models/user');

 
//routes
const carRoutes = require('./routes/carstuffs');
const reviewsRoutes = require('./routes/reviewCar');
const contactRoutes = require('./routes/contact');
const usersRoutes = require('./routes/Users')

// mongo connection 
const mongo = "mongodb://0.0.0.0:27017/car";
mongoose.set("strictQuery", false);
mongoose.connect(mongo, (err) => {
  if (err) {
    console.log(`Mongo connection error ${err}`);
  } else {
    console.log("connectection successfull...");
  }
})





const app = express();
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname), "views");
// we should use below line when we are using app.post
app.use(express.urlencoded({ extended: true }));
// this is use for running static files other than EJS which are located in the public folder
app.use(express.static(path.join(__dirname, 'public')));
// we use method overrriding when we are updating in the database
app.use(methodOverride("_method"));

const sessionConfig = {
  secret : 'thisshouldbebettersecret',
  resave : false,
  saveUninitialized : true,
  cookie: {
    httpOnly : true,
    // below is the expiry of the cookie 
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge : 1000 * 60 * 60 * 24 * 7,
  }
}
app.use(session(sessionConfig));



// this is for login (above part must be before below part (passport.session))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next) => {
  res.locals.currentUser = req.user;
  next();
})



app.get("/", (req, res) => {
    res.render("./views/home");
  });
// app.get("/register", (req, res) => {
//   res.render("./views/user/register.ejs");
// });



app.use('/car/',carRoutes);
app.use('/car/:id/reviews',reviewsRoutes)
app.use('/contact',contactRoutes);
app.use('/',usersRoutes);







app.listen(2000, () => {
    console.log("serving on port 2000");
  });
  
  