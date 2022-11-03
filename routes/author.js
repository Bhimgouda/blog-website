const express = require("express");
const session = require("express-session");
const router = express.Router();
const Author = require("../models/author");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/cutomError");
const bcrypt = require("bcrypt");

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
    console.log(req.session.returnTo);
    const redirectUrl = req.session.returnTo || "/articles";
    res.redirect(redirectUrl);
  })
);

router.get("/register", (req, res) => {
  res.render("author/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    const { password, email, firstName, lastName } = req.body;
    const registeredAuthor = await Author.findOne({ email });
    if (registeredAuthor)
      throw new CustomError("Author Already registered With us", 403);
    const author = new Author({ email, password, firstName, lastName });
    await author.save();
    req.session.author_id = author._id;
    const redirectUrl = req.session.returnTo || "/articles";
    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res) => {
  req.session.author_id = null;
  res.redirect("/author/login");
});

module.exports = router;
