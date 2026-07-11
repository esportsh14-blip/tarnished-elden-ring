(() => {
  // Build a small noise tile once and tile it for the film grain overlay
  const grain = document.querySelector(".grain");
  if (grain) {
    const c = document.createElement("canvas");
    c.width = c.height = 160;
    const ctx = c.getContext("2d");
    const img = ctx.createImageData(160, 160);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    grain.style.backgroundImage = `url(${c.toDataURL()})`;
  }

  const nav = document.querySelector(".nav");
  const navLinks = document.querySelector(".nav-links");
  const navToggle = document.querySelector(".nav-toggle");
  const links = [...document.querySelectorAll(".nav-links a")];

  // Solid nav after scrolling past the hero copy
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
  });
  links.forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  // Active section highlighting
  const sections = [...document.querySelectorAll("section[id]")];
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === `#${e.target.id}`)
        );
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((s) => spy.observe(s));

  // Scroll reveal with per-group stagger
  const reveals = [...document.querySelectorAll(".reveal")];
  const groups = new Map();
  reveals.forEach((el) => {
    const parent = el.parentElement;
    const idx = groups.get(parent) ?? 0;
    el.style.setProperty("--reveal-delay", `${Math.min(idx * 60, 300)}ms`);
    groups.set(parent, idx + 1);
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  reveals.forEach((el) => io.observe(el));

  // Only load the YouTube embed after the poster is clicked
  document.querySelectorAll(".video-frame").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.videoId;
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
      iframe.title = btn.getAttribute("aria-label") || "YouTube video";
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      btn.replaceChildren(iframe);
      btn.disabled = true;
      btn.style.cursor = "default";
    });
  });
})();
