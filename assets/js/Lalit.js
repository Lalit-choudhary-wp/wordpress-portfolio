(function () {
  const root = document.documentElement;
  root.classList.add("js");

  const header = document.querySelector(".site-header");
  const nav = document.querySelector(".nav");
  const toggle = document.getElementById("nav-toggle");
  const year = document.getElementById("year");
  const progress = document.querySelector(".scroll-progress");
  const heroAtmosphere = document.querySelector(".hero__atmosphere");
  const cursor = document.querySelector(".cursor");
  const links = document.querySelectorAll('.nav__list a[href^="#"]');
  const sectionIds = ["about", "services", "work", "skills", "contact"];
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  function setMenu(open) {
    if (!nav || !header || !toggle) {
      return;
    }
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!nav.classList.contains("is-open"));
    });
  }

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

  function setActiveLink(id) {
    links.forEach(function (link) {
      const isCurrent = link.getAttribute("href") === "#" + id;
      if (isCurrent) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  let ticking = false;

  function updateScroll() {
    const y = window.scrollY || 0;
    const doc = document.documentElement;
    const max = Math.max(doc.scrollHeight - window.innerHeight, 1);

    if (header) {
      header.classList.toggle("is-scrolled", y > 24);
    }

    if (progress) {
      progress.style.width = Math.min(100, (y / max) * 100) + "%";
    }

    if (!reduceMotion && heroAtmosphere) {
      heroAtmosphere.style.transform = "translate3d(0, " + (y * 0.16) + "px, 0)";
    }

    ticking = false;
  }

  function onScroll() {
    if (ticking) {
      return;
    }
    ticking = true;
    window.requestAnimationFrame(updateScroll);
  }

  updateScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const revealNodes = document.querySelectorAll("[data-reveal]");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealNodes.forEach(function (node) {
      node.classList.add("is-inview");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }
          entry.target.classList.add("is-inview");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    revealNodes.forEach(function (node) {
      revealObserver.observe(node);
    });
  }

  if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  if (!reduceMotion) {
    document.querySelectorAll(".work-card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const box = card.getBoundingClientRect();
        card.style.setProperty("--mx", event.clientX - box.left + "px");
        card.style.setProperty("--my", event.clientY - box.top + "px");
      });
    });
  }

  if (!reduceMotion && finePointer && cursor) {
    root.classList.add("has-cursor");
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let cx = x;
    let cy = y;

    window.addEventListener("pointermove", function (event) {
      x = event.clientX;
      y = event.clientY;
      cursor.classList.add("is-on");
    }, { passive: true });

    function loop() {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = "translate3d(" + cx + "px, " + cy + "px, 0)";
      window.requestAnimationFrame(loop);
    }

    loop();

    document.querySelectorAll("a, button").forEach(function (el) {
      el.addEventListener("pointerenter", function () {
        cursor.classList.add("is-hover");
      });
      el.addEventListener("pointerleave", function () {
        cursor.classList.remove("is-hover");
      });
    });
  }
})();
