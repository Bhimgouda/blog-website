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

// .replace is made to change the image width to 700 and type to webp or avif

// --------------- image url generator for images in text-editor ---------//
router.post("/image-urls", isLoggedIn, upload.single("image"), (req, res) => {
  res.send({
    url: req.file.path.replace("/upload", "/upload/w_700,f_auto"),
  });
});

// --------------- To Post a like ------------------------------------//

router.get("/:slug/like", catchAsync(async(req,res)=>{
  const {slug} = req.params
  
  if(!req.session.liked){
    req.session.liked = {}; // For first time users
  }

  // The liked object is like article-slug:true
  
  if(!req.session.liked[slug]){
    req.session.liked[slug] = true;
    await Article.findOneAndUpdate({slug}, {$inc: {likes: 1}})
  }
  else{
    req.session.liked[slug] = false
    await Article.findOneAndUpdate({slug}, {$inc: {likes: -1}})
  }
  res.send() // To send 200 response
}))


router.get(
  "/",
  catchAsync(async (req, res) => {
    const articles = await Article.find()
      .populate("category")
      .populate("author");
      // Here the article heroImage will be replaced on the client side
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
    article.likes = 0;
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
    console.log(article)
    article.heroImage = article.heroImage.replace("/upload", "/upload/w_700,f_auto")
    // req.session.liked has an object that has slug:true(liked or not liked as per article and for unique user session)
    res.render("articles/show", { article, liked: req.session.liked && req.session.liked[slug] || false });
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
    article.heroImage = article.heroImage.replace("/upload", "/upload/w_700,f_auto")
    res.render("articles/edit", { article });
  })
);


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
