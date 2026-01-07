const openButton = document.querySelector(".hero_script_open");
const menuWrap = document.querySelector(".hero_script_menu_wrap");
const menuItems = document.querySelectorAll(".hero_script_item_wrap");

// Validate required elements exist
if (!openButton || !menuWrap) {
  console.error("Required menu elements not found");
}

let isOpen = false;

openButton?.addEventListener("click", () => {
  isOpen = !isOpen;
  const yValue = isOpen ? "0%" : "-100%";
  menuWrap.style.transform = `translateY(${yValue})`;
});

// Create timeline once per item and store it
menuItems.forEach((item) => {
  const upperText = item.querySelector(".hero_script_item_upper");
  const lowerText = item.querySelector(".hero_script_item_lower");
  if (!upperText || !lowerText) return;

  // Create and store the timeline on the element
  const timeline = gsap
    .timeline({ paused: true })
    .to(
      upperText,
      {
        yPercent: -125,
        duration: 0.2,
        ease: "power1.out",
      },
      0
    )
    .to(
      lowerText,
      {
        yPercent: -100,
        duration: 0.2,
        ease: "power1.in",
      },
      ">"
    );

  item.addEventListener("mouseenter", () => timeline.play());
  item.addEventListener("mouseleave", () => timeline.reverse());
});
