const express = require("express");
const Article = require("../models/article");
const catchAsync = require("../utils/catchAsync");
const convertToSlug = require("../utils/convertToSlug")
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const { isLoggedIn, isAuthor } = require("../middlewares");
const Category = require("../models/category");
const upload = multer({
  storage,
});

// --------------- image url generator for images in text-editor ---------//
router.post("/image-urls", isLoggedIn, upload.single("image"), (req, res) => {
  console.log(req.file.path.replace("/upload", "/upload/w_700"))
  res.send({
    url: req.file.path.replace("/upload", "/upload/w_700"),
  });
});

router.get(
  "/",
  catchAsync(async (req, res) => {
    const articles = await Article.find()
      .populate("category")
      .populate("author");
    res.render("articles/index", { articles });
  })
);

// To render input form
router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const categories = await Category.find();
    res.render("articles/new", { categories });
  })
);

router.post(
  "/",
  isLoggedIn,
  upload.single("heroImage"),
  catchAsync(async (req, res) => {

    const article = new Article(req.body);
    article.author = req.author._id;
    article.datePublished = new Date().toUTCString().slice(5,16);
    article.slug = convertToSlug(article.title);
    article.reads = 0;
    if (req.file) article.heroImage = req.file.path;

    const { slug } = await article.save();
    req.flash("success","Your article is now Live");
    res.redirect(`/articles/${slug}`);
  })
);

router.get(
  "/:slug",
  catchAsync(async (req, res) => {
    const { slug } = req.params;
    const article = await Article.findOne({slug})
      .populate("author")
      .populate("category");
    res.render("articles/show", { article });
    article.reads ++;
    return await article.save();
  })
);

// To render input form
router.get(
  "/:slug/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { slug } = req.params;
    const article = await Article.findOne({slug});
    res.render("articles/edit", { article });
  })
);

// pending: heroImage is not been updated
router.put(
  "/:slug",
  isLoggedIn,
  isAuthor,
  upload.single("heroImage"),
  catchAsync(async (req, res) => {
    const { slug } = req.params;
    req.body.dateLastUpdated = new Date().toUTCString().slice(5,16)
    if(!req.file){
      await Article.findOneAndUpdate({ slug }, req.body);
    }
    else{
      await Article.findOneAndUpdate({ slug }, {...req.body, heroImage: req.file.path});
    }

    req.flash("success", "Article has been updated SuccessFully");
    res.redirect(`/articles/${slug}`);
  })
);

router.delete(
  "/:slug",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { slug } = req.params;
    await Article.findOneAndDelete({slug});
    res.redirect("/articles");
  })
);

module.exports = router;
