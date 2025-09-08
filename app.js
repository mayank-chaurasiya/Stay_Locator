const express = require("express");
const mongoose = require("mongoose");

const app = express();

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

app.listen(PORT, () => {
  console.log(`app is listenning to ${PORT}`);
});
