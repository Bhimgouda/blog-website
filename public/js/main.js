const toggle = document.querySelector(".nav__burger");
      const navLinks = document.querySelector(".nav__links")

      window.addEventListener("scroll", ()=>{
        toggle.classList.remove("nav__burger--close")
        navLinks.classList.remove("nav__links--expanded")
        setActiveToc()
      })

      toggle.addEventListener("click", ()=>{
        toggle.classList.toggle("nav__burger--close")
        navLinks.classList.toggle("nav__links--expanded")
      })


      // To dissapear flash after 2-3 seconds
      const flash = document.querySelector(".flash")

      setTimeout(()=>{
        if(flash) flash.style.display = 'none'
      },2000)

      // Checking for item Visiblity using async observer (author-box here)

      const author = document.querySelector(".author-box--mobile .author")

      var authorBoxObserver = new IntersectionObserver(function(entries) {
          // isIntersecting is true when element and viewport are overlapping
          // isIntersecting is false when element and viewport don't overlap
          if(entries[0].isIntersecting === true)
            if(author){
              author.classList.add('author--slide-in')
            }
        }, { threshold: [1] }); // 0 for entry and 11 for full visible

        authorBoxObserver.observe(document.querySelector("#author-box"));

      // For Like Button There are 2 like btns (for styling purposes) for both mobile and pc 
      const likeBtns = document.querySelectorAll(".likes")
      const likeCount = document.querySelectorAll('.likes-count')
      let liked = JSON.parse('<%= liked %>')

      // For initial state when the page loads 
      
      likeBtns.forEach((likeBtn,i)=>{
        if(liked) likeBtn.style.backgroundColor = 'red';
        likeBtn.addEventListener("click", async()=>{
          if(liked){
          likeBtn.style.backgroundColor = 'black'
          likeCount[i].textContent --;
          liked = false
        }
        else{
          likeBtn.style.backgroundColor = 'red'
          likeCount[i].textContent ++;
          liked = true;
        }
        // To change the data in db
        await fetch(`/articles/<%= article.slug %>/like`)
        })
      })

      // For sidebar functionality
        const headings = document.querySelectorAll("h2,h3");
        const tocLinks = document.querySelectorAll(".toc__content")
        const toc = document.getElementById("toc")

        headings.forEach((heading,index) => {
          heading.setAttribute("id", `heading-${index}`);
          // articleHeadingObserver.observe(heading)
        });

        tocLinks.forEach(link=>{
          link.addEventListener("click", (e)=>{
            e.target.dataset.toc
            headings.forEach(heading=>{
              if(e.target.dataset.toc === heading.id){
                return heading.scrollIntoView({behavior: "smooth"})
              }
            })
          })
        })


      // To set active TOC link based on respective heading on scroll
      function setActiveToc() {
        let activeHeading = null;
        headings.forEach((heading) => {
          if (heading.getBoundingClientRect().top < 150 && heading.getBoundingClientRect().top > -150) {
            activeHeading = heading;
          }
        });
        if (!activeHeading) {
          return;
        }
        const activeLink = toc.querySelector(`[data-toc="${activeHeading.id}"]`);
        activeLink.classList.add("toc__content--active");
        // Remove the active class from all other links
        const tocLinks = toc.querySelectorAll(".toc__content");
        tocLinks.forEach((link) => {
          if (link !== activeLink) {
            link.classList.remove("toc__content--active");
          }
        });
  };  

// window.addEventListener("scroll", ()=>{
//   setActiveToc()
// });


// articleHeadingObserver = new IntersectionObserver((entries)=>{
//   console.log(entries)
//   if (entries[0].isIntersecting === true && entries[0].intersectionRatio === 1){
//     tocLinks.forEach(link=>{
//       if(link.dataset.toc === entries[0].target.id){
//         return link.classList.add("toc__content--active")
//       }
//       link.classList.remove("toc__content--active")
//     })
//   }
// },{ threshold: [1]})







