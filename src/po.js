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

const search = document.querySelector("#project-search");
const filters = [...document.querySelectorAll("[data-filter]")];
const cards = [...document.querySelectorAll("[data-project]")];
const resultCount = document.querySelector("#result-count");
const emptyState = document.querySelector("#no-results");
const resetButton = document.querySelector("[data-reset-search]");

if (search && resultCount && emptyState) {
  document.querySelector("#catalogue-tools").hidden = false;
  let category = "Semua";

  const update = () => {
    const query = search.value.trim().toLocaleLowerCase("id");
    let count = 0;
    for (const card of cards) {
      const categoryMatches =
        category === "Semua" || card.dataset.category === category;
      const searchMatches = card.dataset.search.includes(query);
      card.hidden = !(categoryMatches && searchMatches);
      if (!card.hidden) count += 1;
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
      update();
    });
  }

  search.addEventListener("input", update);
  resetButton.addEventListener("click", () => {
    category = "Semua";
    search.value = "";
    for (const filter of filters) {
      filter.setAttribute(
        "aria-pressed",
        String(filter.dataset.filter === "Semua"),
      );
    }
    update();
    search.focus();
  });
}
