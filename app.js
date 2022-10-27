const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("home");
});

app.all("*", (req, res) => {
  console.log("hey");
});

app.listen(5000);
