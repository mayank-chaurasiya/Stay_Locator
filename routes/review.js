const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

//----------- VALIDATION AS MIDDLEWARE --------------------------
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((element) => element.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//----------- REVIEWS POST ROUTE -----------------------------------
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created !!");
    res.redirect(`/listings/${listing._id}`);
  })
);

//---------- DELETING REVIEWS ------------------------------
router.delete(
  "/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    let deletedReview = await Review.findByIdAndDelete(reviewId);
    console.log(deletedReview);
    req.flash("error", "Review Deleted !");
    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;
