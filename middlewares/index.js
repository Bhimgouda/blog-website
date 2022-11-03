// ------------- LoggedIn checking middleware ----------------//

const catchAsync = require("../utils/catchAsync");

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  if (!req.session.author_id) {
    req.session.returnTo = req.originalUrl;
    return res.redirect("/author/login");
  }
  next();
});
