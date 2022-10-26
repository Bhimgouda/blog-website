const express = require("express");
const path = require("path");
const app = express();
const articleRouter = require("./routes/article");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

// ----------------------- MIDDLEWARES ---------------------------//

// Body parser
app.use(express.urlencoded({ extended: true }));

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Method Override
app.use(methodOverride("_method"));

// App Routes
app.use("/articles", articleRouter);

// ----------------------- Basic Integrations -----------------------//
app.get("/", (req, res) => {
  res.render("home");
});

// Connecting to DB
mongoose
  .connect("mongodb://localhost:27017/blog-website")
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(e));

// Starting the server
const PORT = 3000;
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
