/* =========================================================
   SALÓN DE BELLEZA ESTHER — Interactions & Motion
   ========================================================= */
(function () {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  const hasGSAP = typeof gsap !== "undefined";

  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ---------- PRELOADER ---------- */
  function initPreloader() {
    const preloader = document.getElementById("preloader");
    const mark = preloader.querySelector(".preloader-mark");
    const fill = document.getElementById("preloaderFill");
    const body = document.body;

    if (!hasGSAP || reducedMotion) {
      preloader.style.display = "none";
      body.classList.remove("is-loading");
      revealHeroImmediate();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        preloader.style.display = "none";
        body.classList.remove("is-loading");
        animateHero();
      },
    });

    tl.to(mark, { opacity: 1, duration: 0.6, ease: "power2.out" })
      .to(fill, { width: "100%", duration: 0.9, ease: "power2.inOut" }, "-=0.2")
      .to(preloader, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "+=0.1");
  }

  function revealHeroImmediate() {
    document.querySelectorAll(".hero-title .line span").forEach((el) => (el.style.transform = "none"));
    document.querySelectorAll(".hero-desc, .hero-actions, .hero-visual, .hero-scroll").forEach((el) => (el.style.opacity = "1"));
  }

  /* ---------- HERO ENTRANCE ---------- */
  function animateHero() {
    if (!hasGSAP) return;
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(".hero-title .line span", { yPercent: 0, duration: 1.1, stagger: 0.12 })
      .to(".hero-desc", { opacity: 1, y: 0, duration: 0.8 }, "-=0.6")
      .to(".hero-actions", { opacity: 1, y: 0, duration: 0.8 }, "-=0.5")
      .fromTo(".hero-visual", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 1 }, "-=0.9")
      .to(".hero-scroll", { opacity: 1, duration: 0.6 }, "-=0.3");

    // hero exit on scroll (surprise: fades/scales & background morphs)
    gsap.to(".hero-copy", {
      yPercent: -18,
      opacity: 0.15,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero-visual", {
      yPercent: -8,
      scale: 0.94,
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
    });
    gsap.to(".hero-blob-1", { y: 120, x: 40, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    gsap.to(".hero-blob-2", { y: -80, x: -30, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  }

  /* ---------- NAV ---------- */
  function initNav() {
    const nav = document.getElementById("mainNav");
    const burger = document.getElementById("navBurger");
    const mobileMenu = document.getElementById("mobileMenu");
    const links = document.querySelectorAll(".nav-links a, .mobile-menu a");

    window.addEventListener("scroll", () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 40);
    }, { passive: true });

    burger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("is-open");
      document.body.style.overflow = open ? "hidden" : "";
    });

    links.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });

    // active section highlight
    const sections = [...document.querySelectorAll("main section[id]")];
    const navLinks = document.querySelectorAll(".nav-links a");
    if (hasGSAP && sections.length) {
      sections.forEach((sec) => {
        ScrollTrigger.create({
          trigger: sec,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (!self.isActive) return;
            navLinks.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === `#${sec.id}`));
          },
        });
      });
    }
  }

  /* ---------- SCROLL PROGRESS ---------- */
  function initScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    window.addEventListener("scroll", () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
      bar.style.width = scrolled + "%";
    }, { passive: true });
  }

  /* ---------- BACK TO TOP ---------- */
  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    window.addEventListener("scroll", () => {
      btn.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- CUSTOM CURSOR ---------- */
  function initCursor() {
    if (isTouch) return;
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.body.classList.add("cursor-ready");

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px"; dot.style.top = my + "px";
    });

    function loop() {
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.left = rx + "px"; ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    }
    loop();

    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  /* ---------- MAGNETIC BUTTONS ---------- */
  function initMagnetic() {
    if (isTouch) return;
    document.querySelectorAll(".btn-primary, .btn-gold").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => (btn.style.transform = "translate(0,0)"));
    });
  }

  /* ---------- SCROLL REVEAL ---------- */
  function initReveal() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!hasGSAP) {
      items.forEach((el) => (el.style.opacity = "1"));
      return;
    }
    items.forEach((el, i) => {
      const type = el.getAttribute("data-reveal");
      const from = type === "scale" ? { opacity: 0, scale: 0.94 } : type === "fade" ? { opacity: 0 } : { opacity: 0, y: 36 };
      const to = type === "scale" ? { opacity: 1, scale: 1 } : type === "fade" ? { opacity: 1 } : { opacity: 1, y: 0 };
      gsap.fromTo(el, from, {
        ...to,
        duration: 0.9,
        ease: "power3.out",
        delay: (i % 4) * 0.06,
        scrollTrigger: { trigger: el, start: "top 88%" },
      });
    });
  }

  /* ---------- ABOUT VISUAL MASK REVEAL ---------- */
  function initAboutFrame() {
    if (!hasGSAP) return;
    gsap.to("#aboutFrame", {
      clipPath: "inset(0 0% 0 0)",
      duration: 1.2,
      ease: "power4.inOut",
      scrollTrigger: { trigger: "#aboutFrame", start: "top 75%" },
    });
  }

  /* ---------- COUNTERS ---------- */
  function initCounters() {
    const counters = document.querySelectorAll(".counter");
    counters.forEach((el) => {
      const target = parseFloat(el.getAttribute("data-target"));
      const run = () => {
        if (!hasGSAP) { el.textContent = target; return; }
        gsap.fromTo(el, { textContent: 0 }, {
          textContent: target,
          duration: 1.6,
          ease: "power1.out",
          snap: { textContent: 1 },
          onUpdate() { el.textContent = Math.floor(el.textContent); },
        });
      };
      if (hasGSAP) {
        ScrollTrigger.create({ trigger: el, start: "top 90%", once: true, onEnter: run });
      } else {
        run();
      }
    });
  }

  /* ---------- ACADEMY DRAG SCROLL ---------- */
  function initAcademyDrag() {
    const wrap = document.getElementById("academyTrack");
    if (!wrap) return;
    let isDown = false, startX, scrollLeft;

    wrap.addEventListener("mousedown", (e) => {
      isDown = true;
      wrap.classList.add("is-dragging");
      startX = e.pageX - wrap.offsetLeft;
      scrollLeft = wrap.scrollLeft;
    });
    ["mouseleave", "mouseup"].forEach((evt) =>
      wrap.addEventListener(evt, () => { isDown = false; wrap.classList.remove("is-dragging"); })
    );
    wrap.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - wrap.offsetLeft;
      wrap.scrollLeft = scrollLeft - (x - startX) * 1.4;
    });
  }

  /* ---------- GALLERY FILTER ---------- */
  function initGalleryFilter() {
    const buttons = document.querySelectorAll(".gallery-filters button");
    const items = document.querySelectorAll(".gallery-item");

    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const filter = btn.getAttribute("data-filter");

        items.forEach((item) => {
          const match = filter === "all" || item.getAttribute("data-cat") === filter;
          if (hasGSAP) {
            if (match) {
              item.classList.remove("is-hidden");
              gsap.fromTo(item, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" });
            } else {
              gsap.to(item, { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => item.classList.add("is-hidden") });
            }
          } else {
            item.classList.toggle("is-hidden", !match);
          }
        });
      });
    });
  }

  /* ---------- TESTIMONIAL CAROUSEL ---------- */
  function initTestimonials() {
    const slides = document.querySelectorAll(".testi-slide");
    const dots = document.querySelectorAll("#testiDots button");
    if (!slides.length) return;
    let idx = 0, timer;

    function show(i) {
      slides.forEach((s, n) => s.classList.toggle("is-active", n === i));
      dots.forEach((d, n) => d.classList.toggle("is-active", n === i));
      idx = i;
    }
    function next() { show((idx + 1) % slides.length); }
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 6000);
    }

    dots.forEach((dot, n) => dot.addEventListener("click", () => { show(n); restart(); }));
    restart();
  }

  /* ---------- INIT ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initNav();
    initScrollProgress();
    initBackToTop();
    initCursor();
    initMagnetic();
    initReveal();
    initAboutFrame();
    initCounters();
    initAcademyDrag();
    initGalleryFilter();
    initTestimonials();
    initPreloader();
  });
})();
