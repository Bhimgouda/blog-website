var slug = require("slug");

module.exports = function convertToSlug(title) {
  const generatedSlug = slug(title);
  return generatedSlug;
};
