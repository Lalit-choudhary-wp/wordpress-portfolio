(function () {
  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("nav-toggle");
  const year = document.getElementById("year");
  const links = document.querySelectorAll('.nav__list a[href^="#"]');
  const sections = ["about", "services", "work", "skills", "contact"]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  toggle.addEventListener("click", function () {
    setMenu(!nav.classList.contains("is-open"));
  });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      setMenu(false);
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      setMenu(false);
    }
  });

  function onScroll() {
    header.classList.toggle("is-light", window.scrollY > 40);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          links.forEach(function (link) {
            const isCurrent = link.getAttribute("href") === "#" + entry.target.id;
            if (isCurrent) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }
})();
