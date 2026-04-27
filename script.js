
// ==============================
// LOAD COMPONENTS (FINAL CLEAN)
// ==============================
function loadComponent(id, file, callback) {
  fetch(file)
    .then(res => {
      if (!res.ok) throw new Error("Component not found: " + file);
      return res.text();
    })
    .then(data => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = data;

      if (callback) callback();
    })
    .catch(err => console.error(err));
}

// SIMPLE PATHS NOW
loadComponent("navbar-placeholder", "navbar.html", initNavbar);
loadComponent("footer-placeholder", "footer.html");
loadComponent("contact-placeholder", "contact.html");

// ==============================
// NAVBAR INIT (AFTER LOAD)
// ==============================
function initNavbar() {
  const menuIcon = document.getElementById("menuIcon");
  const navLinks = document.getElementById("navLinks");

  if (menuIcon && navLinks) {
    menuIcon.addEventListener("click", () => {
      menuIcon.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        menuIcon.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  }

  // ✅ Run active nav AFTER navbar loads
  handleActiveNav();
}


// ==============================
// SAFE DOM LOAD
// ==============================
document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // TESTIMONIAL SLIDER
  // ==============================
  const cards = document.querySelectorAll(".testimonial-card");
  let index = 0;

  function showSlide(i) {
    if (!cards.length) return;
    cards.forEach(card => card.classList.remove("active"));
    cards[i].classList.add("active");
  }

  function autoSlide() {
    index = (index + 1) % cards.length;
    showSlide(index);
  }

  if (cards.length > 0) {
    showSlide(index);
    setInterval(autoSlide, 4000);
  }


  // ==============================
  // ANIMATED COUNTERS (SMOOTH)
  // ==============================
  const counters = document.querySelectorAll(".counter");

  if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute("data-target")) || 0;

          const duration = 2000;
          const startTime = performance.now();

          const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            const ease = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(ease * target);

            counter.innerText = value;

            if (progress < 1) {
              requestAnimationFrame(update);
            } else {
              counter.innerText = target + "+";
            }
          };

          requestAnimationFrame(update);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

});

// ==============================
// ACTIVE NAV (FINAL SMART SYSTEM)
// ==============================
function handleActiveNav() {

  const navItems = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("section");

  let currentPage = window.location.pathname.split("/").pop();
  if (!currentPage) currentPage = "index.html";

  /* ==============================
     PAGE BASED ACTIVE
  ============================== */
  navItems.forEach(link => {

    const href = link.getAttribute("href");

    // RESET
    link.classList.remove("active");

    // EXACT MATCH ONLY ✅
    if (href === currentPage) {
      link.classList.add("active");
    }

  });

  /* ==============================
     SCROLL SPY (ONLY INDEX)
  ============================== */
  if (currentPage === "index.html" && sections.length > 0) {

    window.addEventListener("scroll", () => {

      let current = "";

      sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (
          window.scrollY >= sectionTop &&
          window.scrollY < sectionTop + sectionHeight
        ) {
          current = section.getAttribute("id");
        }
      });

      navItems.forEach(link => {

        const href = link.getAttribute("href");

        // Only handle anchor links
        if (href && href.includes("#")) {

          link.classList.remove("active");

          if (href.includes(current)) {
            link.classList.add("active");
          }

        }

      });

    });

  }

}

// ==============================
// SCROLL ANIMATION (SMART)
// ==============================
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add("show");

      // run only once (premium behavior)
      observer.unobserve(entry.target);
    }
  });
},{
  threshold:0.2
});

// APPLY TO ALL ELEMENTS
document.querySelectorAll("[data-animate]").forEach(el=>{
  observer.observe(el);
});

// ==============================
// contact form (SMART SYSTEM)
// ==============================

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector(".contact-form");

  if(form){
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();

      const btn = form.querySelector("button");
      const originalText = btn.innerHTML;

      btn.innerHTML = "Sending...";
      btn.disabled = true;

      const data = new FormData(form);

      try{
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if(response.ok){

          // ✅ SUCCESS
          btn.innerHTML = "✅ Message Sent";
          form.reset();

          // 🔥 FORCE REDIRECT (NO CONFLICT)
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1200);

          return; // ❗ important (stop further execution)

        }else{
          btn.innerHTML = "❌ Error";
        }

      }catch(error){
        btn.innerHTML = "❌ Failed";
      }

      // ONLY RUN IF FAILED
      setTimeout(()=>{
        btn.innerHTML = originalText;
        btn.disabled = false;
      },2000);

    });
  }

});

// ==============================
// TIMELINE SCROLL PROGRESS
// ==============================
const timeline = document.querySelector(".timeline");
const line = document.querySelector(".timeline-line");

if (timeline && line) {
  window.addEventListener("scroll", () => {

    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    let progress = (windowHeight - rect.top) / rect.height;
    progress = Math.max(0, Math.min(1, progress));

    line.style.setProperty("--progress", progress * 100 + "%");

  });
}

// ==============================
// PRODUCTS "SEE MORE" BUTTON 🔥
// ==============================
document.addEventListener("click", function(e) {

  if (e.target.classList.contains("see-more-btn")) {

    const btn = e.target;
    const category = btn.closest(".product-category");
    const grid = category.querySelector(".product-grid");

    // TOGGLE CLASS
    grid.classList.toggle("expanded");

    // CHANGE BUTTON TEXT
    if (grid.classList.contains("expanded")) {
      btn.innerText = "See Less";
    } else {
      btn.innerText = "See More";

      // 🔥 OPTIONAL: scroll back to section top (premium UX)
      category.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

  }

});
