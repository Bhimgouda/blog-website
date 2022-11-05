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
  const { id } = req.params;
  const article = await Article.findById(id);
  if (!article.author.equals(req.author._id)) {
    // can flash error
    return res.redirect(`/articles/${id}`);
  }
  next();
});
