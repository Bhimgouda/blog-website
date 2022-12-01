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
const MongoStore = require("connect-mongo")

const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/blog-website";

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

const secret = process.env.SECRET;

// Mongo Store initialization
const store = new MongoStore({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

const sessionConfig = {
  store,
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
  .connect(dbUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((e) => console.log(e));

// Starting the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
