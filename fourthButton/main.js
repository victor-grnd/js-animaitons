//----------------------FOURTH BUTTON -> 2 LAYERS WITH BG BUTTON-------------------

const buttons = document.querySelectorAll(".button_main_wrap.is-fourth");

buttons.forEach((button) => {
  const firstLayer = button.querySelector(
    ".button_main_element.is-first-layer"
  );
  const secondLayer = button.querySelector(
    ".button_main_element.is-second-layer"
  );
  const roundedBg = button.querySelector(".button_main_bg-hover");

  const layersHoverTl = gsap.timeline({ paused: true });

  layersHoverTl.to(firstLayer, {
    yPercent: -100,
    duration: 0.3,
    ease: "power2.out",
  });

  layersHoverTl.to(
    roundedBg,
    {
      yPercent: -65, // y 20 to -50
      duration: 0.6,
      ease: "power2.in",
    },
    "<-0.15"
  );

  layersHoverTl.to(
    secondLayer,
    {
      yPercent: -150, // y 100 to -50
      opacity: 1,
      duration: 0.1,
      ease: "power2.in",
    },
    0.25
  );

  button.addEventListener("mouseenter", () => {
    layersHoverTl.play();
  });
  button.addEventListener("mouseleave", () => {
    layersHoverTl.reverse();
  });
});
