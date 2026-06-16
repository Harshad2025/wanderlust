if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:");
    console.error(err.stack);
});

const port = process.env.PORT || 8080;
const express = require('express');
const app = express();
const monogoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodoverride = require('method-override');
const ejsmate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');
const { listingSchema , reviewSchema} = require('./schema');
const Review = require('./models/review');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const listingRoutes = require('./routers/listing');
const riviewRoutes = require('./routers/review');
const userRoutes = require('./routers/user');

//const mango_url="mongodb://127.0.0.1:27017/wnaderlust";
const dbUrl=process.env.ATLASDB_URL ;

main().then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err);
});


async function main() {
    await monogoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method')); 
app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, 'public')));


// const store = MongoStore.create({
//     mongoUrl: dbUrl,
//     crypto: {
//         secret: process.env.SECRET
//     },
//     touchAfter: 24 * 3600
// });


const sessionConfig = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,  
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }  
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// app.get('/', (req, res) => {
//     res.send('Hello World');
// });



app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});

  app.use("/listings", listingRoutes);
app.use("/listings/:id/reviews", riviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
    res.redirect("/listings");
});
app.use((req, res, next) => {
    next(new ExpressError(404, 'Page Not Found'));
});
app.use((err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message });
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});