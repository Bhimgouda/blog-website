// ------------- LoggedIn checking middleware ----------------//

const Article = require("../models/article");
const catchAsync = require("../utils/catchAsync");

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.session.author_id) {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/author/login");
  }
  next();
});

// ----------------Authorization middleware-----------------//

exports.isAuthor = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const article = await Article.findOne({slug});
  if (!article.author.equals(req.author._id)) {
    return res.redirect(`/articles/${slug}`);
  }
  next();
});
