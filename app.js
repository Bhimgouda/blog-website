const express = require("express");
const path = require("path");
const app = express();
const articleRouter = require("./routes/article");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const CustomError = require("./utils/cutomError");

// ----------------------- MIDDLEWARES ---------------------------//

// Body parser
app.use(express.urlencoded({ extended: true }));

// To Serve static Assets
app.use(express.static(path.join(__dirname, "public")));

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);

// Method Override
app.use(methodOverride("_method"));

// ----------------------- App Routes -------------------------------//

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/articles", articleRouter);

app.all("*", (req, res, next) => {
  next(new CustomError("Page Not Found", 404));
});

// ----------------------- Error Handling Middleware ------------------//

app.use((err, req, res, next) => {
  console.log(err.message);
  const { statusCode = 500, message = "Oh no Something went Wrong!!" } = err;
  res.send(message);
});

// ----------------------- Basic Integrations -----------------------//

// Connecting to DB
mongoose
  .connect("mongodb://localhost:27017/blog-website")
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(e));

// Starting the server
const PORT = 5000;
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
