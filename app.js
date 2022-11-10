if (process.env.NODE_ENV !== "production") require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const app = express();
const articleRouter = require("./routes/article");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const authorRouter = require("./routes/author");
const Author = require("./models/author");
const categoryRouter = require("./routes/category");
const flash = require("connect-flash")

// pending: I need to query the database in a effecient manner after learning some mongodb querying concepts
// pending: I have to only get required data from the db instead of loading the full content of the articles sometimes
// pending: I have to validate new and edit routes req.body before adding anything to db both client and server
// pending: I have to flash messages using flash module  // half done
// pending: I have to add a add a category page(if possible on publishing page) // done
// pending: The text-editor should have an option to add alt text for the image
// pending: If i can include yoast seo somehow by making api calls or something
// pending: Create an author Box after article

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

// ------------------------ SESSION ---------------------------------//

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const sessionConfig = {
  name: "session",
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash())

// res.locals and adding req.author to request if the author_id is present

app.use(async (req, res, next) => {
  if (req.session.author_id) {
    const { email, name, _id } = await Author.findById(req.session.author_id);
    req.author = { email, name, _id };
  }
  res.locals.currentAuthor = req.author;
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  next();
});
// ----------------------- App Routes -------------------------------//

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/articles", articleRouter);
app.use("/author", authorRouter);
app.use("/categories", categoryRouter);

// app.all("*", (req, res, next) => {
//   next(new CustomError("Page Not Found", 404));
// });

// ----------------------- Error Handling Middleware ------------------//

app.use((err, req, res, next) => {
  console.log(err.stack);
  const { statusCode = 500, message = "Oh no Something went Wrong!!" } = err;
  req.flash("error",message)
  res.status(statusCode).redirect(req.originalUrl)
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
