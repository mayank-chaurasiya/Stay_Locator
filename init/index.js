require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./newData.js");
const Listing = require("../models/listing.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/staylocator";
const MONGO_URL = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connection successful With database!!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "68ce6d76c4ce67f54a58e5a4",
  }));
  await Listing.insertMany(initData.data);
  console.log("Data was initialized.");
};

initDB();
