function initCheckSectionThemeScroll() {
  const navbar = document.querySelector("[data-navbar]");
  if (!navbar) {
    console.warn("Navbar not found");
    return;
  }

  const themeSections = document.querySelectorAll("[data-section]");

  const themeObserverOffset = navbar.offsetHeight / 2;

  let currentTheme = null;

  function checkThemeSection() {
    for (const section of themeSections) {
      const rect = section.getBoundingClientRect();
      const theme = section.getAttribute("data-section");

      if (
        rect.top <= themeObserverOffset &&
        rect.bottom >= themeObserverOffset
      ) {
        if (theme === currentTheme) {
          return;
        }

        currentTheme = theme;

        navbar.classList.remove(
          "w-variant-dd866659-1d7d-6447-6461-66ca86ca367f",
          "w-variant-c35435ed-5c06-a9fe-f1bb-ad2bdb8c4eec"
        );

        const variantClass =
          theme === "dark"
            ? "w-variant-dd866659-1d7d-6447-6461-66ca86ca367f"
            : "w-variant-c35435ed-5c06-a9fe-f1bb-ad2bdb8c4eec";

        navbar.classList.add(variantClass);

        const variantName = `Overlap_${theme}`;

        navbar.setAttribute("data-wf--nav--nav-position", variantName);
      }
    }
  }

  checkThemeSection();
  document.addEventListener("scroll", checkThemeSection);
}
initCheckSectionThemeScroll();
