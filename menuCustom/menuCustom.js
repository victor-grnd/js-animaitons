/*const openButton = document.querySelector(".hero_script_open");

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
        duration: 0.25,
        ease: "power1.in",
      },
      0
    )
    .to(
      lowerText,
      {
        yPercent: -100,
        duration: 0.25,
        ease: "power1.in",
      },
      0.17
    );

  item.addEventListener("mouseenter", () => timeline.play());
  item.addEventListener("mouseleave", () => timeline.reverse());
});*/
//------------------------------v2--------------------------------------
const menuWrap = document.querySelector(".hero_script_menu_wrap");
const openButton = document.querySelector(".hero_script_open");
const openText = document.querySelector(".hero_script_label");
let isOpen = true;

function changeLabel() {
  const textToSet = isOpen ? "CLOSE" : "OPEN";
  openText.textContent = textToSet;
  isOpen = !isOpen;
}

function fadeInMenu() {
  const menuTlIn = gsap.timeline({ paused: true });

  menuTlIn.fromTo(
    menuWrap,
    {
      opacity: 0,
      y: "6rem",
    },
    {
      opacity: 1,
      y: "0rem",
      ease: "power1.inOut",
      duration: 0.5,
    },
  );

  const menuTlOut = gsap.timeline({ paused: true });

  menuTlOut.fromTo(
    menuWrap,
    {
      opacity: 1,
      y: "0rem",
    },
    {
      opacity: 0,
      y: "6rem",
      ease: "power1.inOut",
      duration: 0.5,
    },
  );

  if (!isOpen) {
    menuTlIn.play();
  } else {
    menuTlOut.play();
  }
}

openButton.addEventListener("click", () => {
  changeLabel();
  fadeInMenu();
});
