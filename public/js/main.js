

// For sidebar functionality
const headings = document.querySelectorAll("h2,h3");

headings.forEach((h) => {
  h.setAttribute("id", h.textContent.replaceAll(" ", "-"));
});

// To dissapear flash after 2-3 seconds

const flash = document.querySelector(".flash")

setTimeout(()=>{
  flash.style.display = 'none'
},2000)


