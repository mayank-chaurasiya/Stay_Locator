const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Listing = require("./models/listing.js");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

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

//------------ GET ALL LISTINGS ---------------------------------
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/all-listings.ejs", { allListings });
});

//----------- SHOW ROUTE ---------------------------------------
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show-listing.ejs", { listing });
});

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

app.listen(PORT, () => {
  console.log(`app is listenning to ${PORT}`);
});
