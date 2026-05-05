// ==============================
// HELPERS
// ==============================
const qs = (s) => document.querySelector(s);
const qsa = (s) => document.querySelectorAll(s);


// ==============================
// LOAD COMPONENTS
// ==============================
async function loadComponent(id, file, callback) {
  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error("Component not found: " + file);

    const html = await res.text();
    const el = document.getElementById(id);

    if (el) el.innerHTML = html;

    if (callback) callback();

  } catch (err) {
    console.error(err);
  }
}


// ==============================
// INIT APP (ONE ENTRY POINT)
// ==============================
document.addEventListener("DOMContentLoaded", () => {

  // DETECT PATH
  const isSubPage = window.location.pathname.includes("/htmls/");
  const base = isSubPage ? "../" : "";

  // LOAD COMPONENTS (FIXED)
  loadComponent("navbar-placeholder", base + "navbar.html", initNavbar);
  loadComponent("footer-placeholder", base + "footer.html");
  loadComponent("contact-placeholder", base + "contact.html");

  // INIT FEATURES
  initCounters();
  initTestimonials();
  initAnimations();
  initContactForm();
  initTimeline();
  initSeeMore();

});


// ==============================
// NAVBAR
// ==============================
function initNavbar() {
  const menuIcon = qs("#menuIcon");
  const navLinks = qs("#navLinks");

  if (menuIcon && navLinks) {
    menuIcon.addEventListener("click", () => {
      menuIcon.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    qsa(".nav-links a").forEach(link => {
      link.addEventListener("click", () => {
        menuIcon.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  }

  handleActiveNav();
}


// ==============================
// ACTIVE NAV + SCROLLSPY (FIXED)
// ==============================
function handleActiveNav() {

  const navItems = qsa(".nav-links a");
  const sections = qsa("section");

  let currentPage = window.location.pathname.split("/").pop();

  // 🔥 fix for "/" homepage
  if (!currentPage || currentPage === "") {
    currentPage = "index.html";
  }

  // ==============================
  // PAGE ACTIVE FIX
  // ==============================
  navItems.forEach(link => {
    let href = link.getAttribute("href");

    // 🔥 normalize (remove leading slash)
    href = href.replace(/^\//, "");

    link.classList.remove("active");

    if (href === currentPage) {
      link.classList.add("active");
    }
  });

  // ==============================
  // SCROLLSPY (ONLY HOME)
  // ==============================
  if (currentPage === "index.html" && sections.length) {

    window.addEventListener("scroll", () => {

      let current = "";

      sections.forEach(section => {
        const top = section.offsetTop - 120;
        const height = section.offsetHeight;

        if (window.scrollY >= top && window.scrollY < top + height) {
          current = section.id;
        }
      });

      navItems.forEach(link => {
        const href = link.getAttribute("href");

        if (href.includes("#")) {
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
// COUNTERS
// ==============================
function initCounters() {
  const counters = qsa(".counter");
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;

      if (el.dataset.started) return;
      el.dataset.started = "true";

      const target = parseInt(el.dataset.target);
      if (isNaN(target)) return;

      const start = performance.now();
      const duration = 2000;

      const animate = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        el.innerText = Math.floor(progress * target);

        if (progress < 1) requestAnimationFrame(animate);
        else el.innerText = target + "+";
      };

      requestAnimationFrame(animate);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}


// ==============================
// TESTIMONIALS
// ==============================
function initTestimonials() {
  const cards = qsa(".testimonial-card");
  if (!cards.length) return;

  let index = 0;

  function show(i) {
    cards.forEach(c => c.classList.remove("active"));
    cards[i].classList.add("active");
  }

  setInterval(() => {
    index = (index + 1) % cards.length;
    show(index);
  }, 4000);

  show(0);
}


// ==============================
// ANIMATIONS
// ==============================
function initAnimations() {

  const elements = qsa("[data-animate]");
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) return;

      const el = entry.target;

      // 🔥 delay support (data-delay="200")
      const delay = el.dataset.delay || 0;

      setTimeout(() => {
        el.classList.add("show");
      }, delay);

      // 🔥 animate once (default)
      if (!el.dataset.repeat) {
        obs.unobserve(el);
      }

    });

  }, {
    threshold: 0.25,
    rootMargin: "0px 0px -50px 0px"
  });

  elements.forEach(el => observer.observe(el));
}


// ==============================
// CONTACT FORM
// ==============================
function initContactForm() {
  const form = qs(".contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const btn = form.querySelector("button");
    const original = btn.innerHTML;

    btn.innerHTML = "Sending...";
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        btn.innerHTML = "✅ Message Sent";
        form.reset();

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1200);

        return;
      }

      btn.innerHTML = "❌ Error";

    } catch {
      btn.innerHTML = "❌ Failed";
    }

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
    }, 2000);
  });
}


// ==============================
// TIMELINE
// ==============================
function initTimeline() {
  const timeline = qs(".timeline");
  const line = qs(".timeline-line");
  if (!timeline || !line) return;

  window.addEventListener("scroll", () => {
    const rect = timeline.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / rect.height));
    line.style.setProperty("--progress", progress * 100 + "%");
  });
}


// ==============================
// SEE MORE
// ==============================
function initSeeMore() {
  document.addEventListener("click", (e) => {

    if (!e.target.classList.contains("see-more-btn")) return;

    const btn = e.target;
    const category = btn.closest(".product-category");
    const grid = category.querySelector(".product-grid");

    grid.classList.toggle("expanded");

    if (grid.classList.contains("expanded")) {
      btn.innerText = "See Less";
    } else {
      btn.innerText = "See More";

      category.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }

  });
}

