document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll("[data-reveal]");
  const header = document.querySelector("[data-header]");
  const navLinks = document.querySelectorAll("[data-nav] a");
  const sections = Array.from(document.querySelectorAll("section[id]"));
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const root = document.documentElement;

  const applyTheme = (theme) => {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", theme === "dark");
    }
    if (themeLabel) {
      themeLabel.textContent = theme === "dark" ? "Dark" : "Light";
    }
  };

  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(storedTheme || (prefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      document.body.classList.add("theme-transition");
      applyTheme(next);
      localStorage.setItem("theme", next);
      window.setTimeout(() => {
        document.body.classList.remove("theme-transition");
      }, 450);
    });
  }

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

  const form = document.querySelector("[data-intake-form]");
  const formStatus = document.querySelector("[data-form-status]");
  const hiddenIframe = document.querySelector("iframe[name='hidden_iframe']");
  let formSubmitted = false;

  if (form && formStatus) {
    form.addEventListener("submit", () => {
      formSubmitted = true;
    });
  }

  if (hiddenIframe && formStatus) {
    hiddenIframe.addEventListener("load", () => {
      if (formSubmitted) {
        formStatus.classList.remove("is-visible");
        void formStatus.offsetWidth;
        formStatus.classList.add("is-visible");
        formSubmitted = false;
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
});
