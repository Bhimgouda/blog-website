const express = require("express");
const Article = require("../models/article");
const catchAsync = require("../utils/catchAsync");
const CustomError = require("../utils/cutomError");
const router = express.Router();

router.get(
  "/",
  catchAsync(async (req, res) => {
    const articles = await Article.find();
    res.render("articles/index", { articles });
  })
);

// To render input form
router.get("/new", (req, res) => {
  res.render("articles/new");
});

router.post(
  "/",
  catchAsync(async (req, res) => {
    console.log(req.body);
    const article = new Article(req.body);
    article.author = "63596d0651e2a1a0a72fb1eb";
    const { _id: articleId } = await article.save();
    res.redirect(`/articles/${articleId}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const article = await Article.findById(id).populate("author");
    res.render("articles/show", { article });
  })
);

// To render input form
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const article = await Article.findById(id);
    res.render("articles/edit", { article });
  })
);

router.put(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Article.findOneAndUpdate({ _id: id }, req.body);
    res.redirect(`/articles/${id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Article.findByIdAndDelete(id);
    res.redirect("/articles");
  })
);

module.exports = router;
