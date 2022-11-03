if (process.env.NODE_ENV !== "production") require("dotenv").config();

const express = require("express");
const path = require("path");
const app = express();
const articleRouter = require("./routes/article");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const CustomError = require("./utils/cutomError");
const session = require("express-session");
const AuthorRouter = require("./routes/author");
const Author = require("./models/author");

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

// res.locals and adding req.author to request if the author_id is present

app.use(async (req, res, next) => {
  if (req.session.author_id) {
    const { email, firstName, lastName, _id } = await Author.findById(
      req.session.author_id
    );
    req.author = { email, firstName, lastName, _id };
  }
  res.locals.currentAuthor = req.author;
  next();
});
// ----------------------- App Routes -------------------------------//

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/articles", articleRouter);
app.use("/author", AuthorRouter);

// app.all("*", (req, res, next) => {
//   next(new CustomError("Page Not Found", 404));
// });

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
