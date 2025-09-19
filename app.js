const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const sessionOptions = {
  secret: "secrettt",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//------------ HOME ROUTE ----------------------------------------
app.get("/", (req, res) => {
  res.send("hii I am working!!");
});

app.use(session(sessionOptions));
app.use(flash());

//------------ MIDDLEWARE TO FLASH MESSAGE -----------------------
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//------------- ROUTES --------------------------------------------
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

let PORT = 8000;

//-------------- CONNECTING DATABASE (MONGOOSE) ------------------
const MONGO_URL = "mongodb://127.0.0.1:27017/staylocator";

main()
  .then(() => {
    console.log("connection successful With database!!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}
//----------------------------------------------------------------

//------------ RANDOM PAGES ---------------------------------
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page not found!!!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("Error.ejs", { message });
});

app.listen(PORT, () => {
  console.log(`app is listenning to ${PORT}`);
});
