const headings = document.querySelectorAll("h2,h3");

headings.forEach((h) => {
  h.setAttribute("id", h.textContent.replaceAll(" ", "-"));
});
