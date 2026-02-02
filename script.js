document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll("[data-reveal]");
  const header = document.querySelector("[data-header]");
  const navLinks = document.querySelectorAll("[data-nav] a");
  const sections = Array.from(document.querySelectorAll("section[id]"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  reveals.forEach((el, index) => {
    el.style.setProperty("transition-delay", `${index * 60}ms`);
    revealObserver.observe(el);
  });

  const onScroll = () => {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === `#${id}`
              );
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
