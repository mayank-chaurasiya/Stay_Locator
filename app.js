const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

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

//------------ HOME ROUTE ----------------------------------------
app.get("/", (req, res) => {
  res.send("hii I am working!!");
});

//----------- VALIDATION AS MIDDLEWARE --------------------------
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(400, errMsg);
  }
};

//------------ GET ALL LISTINGS ---------------------------------
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/all-listings.ejs", { allListings });
  })
);

//---------- NEW ROUTE -----------------------------------------
app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new-listing.ejs");
  })
);

//---------- CREATE ROUTE --------------------------------------
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listingData = req.body.listing;
    listingData.image = { url: listingData.image };
    let newListing = new Listing(listingData);
    await newListing.save();
    res.redirect("/listings");
  })
);

//--------- EDIT ROUTE -----------------------------------------
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit-listing.ejs", { listing });
  })
);

//--------- UPDATE ROUTE ---------------------------------------
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = { ...req.body.listing };
    updatedListing.image = { url: req.body.listing.image };
    await Listing.findByIdAndUpdate(id, updatedListing);
    res.redirect(`/listings/${id}`);
  })
);

//----------- DELETE ROUTE ---------------------------------------
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

//----------- SHOW ROUTE ---------------------------------------
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show-listing.ejs", { listing });
  })
);

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successfule testing");
// });

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
