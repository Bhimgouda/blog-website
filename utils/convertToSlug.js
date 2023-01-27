module.exports = function convertToSlug(title) {
    // Replace spaces with dashes
    let slug = title.replace(/\s+/g, '-');
  
    // Replace non-alphanumeric characters with dashes
    slug = slug.replace(/[^a-zA-Z0-9-]/g, '-');
  
    // Make the string lowercase
    slug = slug.toLowerCase();
  
    // Remove any dashes at the beginning or end of the string
    slug = slug.replace(/^-+|-+$/g, '').trim();
  
    return slug;
  }