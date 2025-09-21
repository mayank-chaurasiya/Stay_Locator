const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

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
  isLoggedIn,
  wrapAsync(async (req, res) => {
    console.log(req.user);
    res.render("listings/new-listing.ejs");
  })
);

//---------- CREATE ROUTE --------------------------------------
router.post(
  "/",
  isLoggedIn,
  validateListing,
  wrapAsync(async (req, res, next) => {
    let listingData = req.body.listing;
    listingData.image = { url: listingData.image };
    let newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect("/listings");
  })
);

//--------- EDIT ROUTE -----------------------------------------
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit-listing.ejs", { listing });
  })
);

//--------- UPDATE ROUTE ---------------------------------------
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
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
  isLoggedIn,
  isOwner,
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
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing not found !!");
      return res.redirect("/listings");
    }
    res.render("listings/show-listing.ejs", { listing });
  })
);

module.exports = router;
