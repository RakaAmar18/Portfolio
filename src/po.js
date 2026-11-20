const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("#site-navigation");

if (menuButton && navigation) {
  menuButton.hidden = false;
  navigation.classList.add("menu-ready");
  const closeMenu = () => {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Buka navigasi");
  };

  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    navigation.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Tutup navigasi" : "Buka navigasi",
    );
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) closeMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      closeMenu();
      menuButton.focus();
    }
  });

  const desktop = window.matchMedia("(min-width: 801px)");
  desktop.addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

const progressBar = document.querySelector("[data-read-progress]");
if (progressBar) {
  let ticking = false;
  const renderProgress = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    progressBar.style.transform = `scaleX(${ratio})`;
  };
  const scheduleProgress = () => {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(renderProgress);
    }
  };
  window.addEventListener("scroll", scheduleProgress, { passive: true });
  window.addEventListener("resize", scheduleProgress, { passive: true });
  renderProgress();
}

const panels = [...document.querySelectorAll("[data-panel]")];
if (panels.length && !reduceMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("comic-motion");
  const reveal = (panel, delayMs = 0) => {
    if (!("panelPending" in panel.dataset)) return;
    panel.style.setProperty("--panel-delay", `${delayMs}ms`);
    delete panel.dataset.panelPending;
    panel.dataset.panelVisible = "";
  };
  const observer = new IntersectionObserver(
    (entries) => {
      let batch = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        reveal(entry.target, (batch % 3) * 65);
        batch += 1;
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.01, rootMargin: "0px 0px -10px 0px" },
  );
  for (const panel of panels) {
    if (panel.getBoundingClientRect().top > window.innerHeight * 0.96) {
      panel.dataset.panelPending = "";
      observer.observe(panel);
    }
  }
  const flushVisiblePanels = () => {
    let batch = 0;
    for (const panel of panels) {
      if (!("panelPending" in panel.dataset)) continue;
      if (panel.getBoundingClientRect().top <= window.innerHeight * 1.02) {
        reveal(panel, (batch % 3) * 45);
        batch += 1;
        observer.unobserve(panel);
      }
    }
  };
  window.addEventListener("scroll", flushVisiblePanels, { passive: true });
  window.setTimeout(() => {
    for (const panel of panels) {
      if ("panelPending" in panel.dataset) {
        reveal(panel, 0);
        observer.unobserve(panel);
      }
    }
  }, 1800);
}

const bubble = document.querySelector("[data-comic-bubble]");
const portrait = document.querySelector("[data-portrait-tap]");
if (bubble) {
  const lines = [
    "Fullstack lintas stack!",
    "V-Class · teruji 50 murid/room!",
    "Web, Tauri/Rust, sampai Flutter.",
    "Punya proyek? Yuk ngobrol!",
  ];
  let lineIndex = 0;
  const cycleBubble = () => {
    lineIndex = (lineIndex + 1) % lines.length;
    bubble.textContent = lines[lineIndex];
    if (!reduceMotion) {
      bubble.classList.remove("is-popping");
      void bubble.offsetWidth;
      bubble.classList.add("is-popping");
    }
  };
  bubble.addEventListener("click", cycleBubble);
  if (portrait) portrait.addEventListener("click", cycleBubble);
}

const copyButton = document.querySelector("[data-copy-email]");
const copyBurst = document.querySelector("[data-copy-burst]");
if (copyButton && copyBurst) {
  let burstTimer = 0;
  const fallbackCopy = (text) => {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(field);
    }
  };
  copyButton.addEventListener("click", async () => {
    const email = copyButton.dataset.copyEmail;
    if (!email) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        fallbackCopy(email);
      }
    } catch {
      fallbackCopy(email);
    }
    copyBurst.hidden = false;
    if (!reduceMotion) {
      copyBurst.classList.remove("is-bursting");
      void copyBurst.offsetWidth;
      copyBurst.classList.add("is-bursting");
    }
    window.clearTimeout(burstTimer);
    burstTimer = window.setTimeout(() => {
      copyBurst.hidden = true;
      copyBurst.classList.remove("is-bursting");
    }, 1500);
  });
}

const search = document.querySelector("#project-search");
const filters = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll("[data-project]")];
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#no-results");
const resetButton = document.querySelector("[data-reset-search]");

if (search && resultCount && emptyState) {
  document.querySelector("#catalogue-tools").hidden = false;
  let category = "Semua";

  const update = (animate = false) => {
    const query = search.value.trim().toLocaleLowerCase("id");
    let count = 0;
    for (const card of cards) {
      const categoryMatches =
        category === "Semua" || card.dataset.category === category;
      const searchMatches = card.dataset.search.includes(query);
      const visible = categoryMatches && searchMatches;
      card.hidden = !visible;
      if (visible) {
        if (animate && !reduceMotion) {
          card.style.setProperty("--filter-delay", `${Math.min(count, 4) * 35}ms`);
          card.classList.remove("filter-pop");
          void card.offsetWidth;
          card.classList.add("filter-pop");
          card.addEventListener(
            "animationend",
            () => card.classList.remove("filter-pop"),
            { once: true },
          );
        }
        count += 1;
      }
    }
    resultCount.textContent = `${count} dari ${cards.length} proyek`;
    emptyState.hidden = count !== 0;
  };

  for (const button of filters) {
    button.addEventListener("click", () => {
      category = button.dataset.filter;
      for (const filter of filters) {
        filter.setAttribute("aria-pressed", String(filter === button));
      }
      update(true);
    });
  }

  search.addEventListener("input", () => update(false));
  resetButton.addEventListener("click", () => {
    category = "Semua";
    search.value = "";
    for (const filter of filters) {
      filter.setAttribute(
        "aria-pressed",
        String(filter.dataset.filter === "Semua"),
      );
    }
    update(true);
    search.focus();
  });
}
