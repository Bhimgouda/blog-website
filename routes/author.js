const express = require("express");
const session = require("express-session");
const router = express.Router();
const Author = require("../models/author");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/cutomError");

// router.get("/register", (req, res) => {
//   res.render("author/register");
// });

// router.post(
//   "/register",
//   catchAsync(async (req, res, next) => {
//     const { password, email, name } = req.body;
//     const registeredAuthor = await Author.findOne({ email });
//     if (registeredAuthor)
//       throw new CustomError("User Already registered, Please Login", 403);
//     const author = new Author({ email, password, name });
//     await author.save();
//     req.session.author_id = author._id;
//     req.flash('success',"You have been successfully registered with Us")
//     const redirectUrl = req.session.returnTo || "/articles";
//     res.redirect(redirectUrl);
//   })
// );

router.get("/login", (req, res) => {
  res.render("author/login");
});

router.post(
  "/login",
  catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const author = await Author.authenticate(email, password);
    if (!author) throw new CustomError("Invalid email or password");
    req.session.author_id = author._id;
    req.flash("success", `Welcome Back ${author.name.split(' ')[0]}`);
    const redirectUrl = req.session.returnTo || "/articles";
    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res) => {
  req.session.author_id = null;
  req.flash("success","You have been Logged out Successfully");
  res.redirect("/author/login");
});

//------------------------- Author About Page -------------------//

// router.get(
//   "/:id",
//   catchAsync(async (req, res) => {
//     const { id } = req.params;
//     const author = await Author.findById(id).populate("articles");
//     author.password = null;
//     res.render("author/about", { author });
//   })
// );

module.exports = router;
