const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const methodOverride = require("method-override");
require("dotenv").config();

const connectDB = require("./config/database");
const { User } = require("./models");

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const messageRouter = require("./routes/messageRouter");

const app = express();

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// passport config
passport.use(
  new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) return done(null, false, { message: "Incorrect email" });

      const match = await bcrypt.compare(password, user.password);

      if (!match) return done(null, false, { message: "Incorrect password" });

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

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

// make user available in views
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// routes
app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/messages", messageRouter);

// connect DB and start server
connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
  });
});