const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

//----------- VALIDATION AS MIDDLEWARE --------------------------
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//------------ GET ALL LISTINGS ---------------------------------
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/all-listings.ejs", { allListings });
  })
);

//---------- NEW ROUTE -----------------------------------------
router.get(
  "/new",
  wrapAsync(async (req, res) => {
    res.render("listings/new-listing.ejs");
  })
);

//---------- CREATE ROUTE --------------------------------------
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listingData = req.body.listing;
    listingData.image = { url: listingData.image };
    let newListing = new Listing(listingData);
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

//--------- EDIT ROUTE -----------------------------------------
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit-listing.ejs", { listing });
  })
);

//--------- UPDATE ROUTE ---------------------------------------
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let updatedListing = { ...req.body.listing };
    updatedListing.image = { url: req.body.listing.image };
    await Listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success", "Listing Updated Successfully !!");
    res.redirect(`/listings/${id}`);
  })
);

//----------- DELETE ROUTE ---------------------------------------
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("error", "Listing Deleted successfully !!");
    res.redirect("/listings");
  })
);

//----------- SHOW ROUTE ---------------------------------------
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if (!listing) {
      req.flash("error", "Listing not found !!");
      return res.redirect("/listings");
    }
    res.render("listings/show-listing.ejs", { listing });
  })
);

module.exports = router;
