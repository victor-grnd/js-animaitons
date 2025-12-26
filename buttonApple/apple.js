function initAppleButtons() {
  const appleButtons = document.querySelectorAll(
    ".button_main_element.is-apple"
  );
  if (!appleButtons.length) return;

  appleButtons.forEach((button) => {
    let isAnimating = false;

    const buttonAppleText = button.querySelector(".button_main_text.is-apple");
    const buttonAppleLogo = button.querySelector(".btn_apple_icon");

    if (!buttonAppleText || !buttonAppleLogo) return;

    const appleButtonTimeline = gsap.timeline({
      paused: true,
      onComplete: () => {
        isAnimating = false;
      },
      onReverseComplete: () => {
        isAnimating = false;
      },
    });

    appleButtonTimeline.to(buttonAppleText, {
      y: "-225%",
      duration: 0.3,
    });

    appleButtonTimeline.fromTo(
      buttonAppleLogo,
      { y: "200%" },
      { y: "-50%", duration: 0.3 },
      "<"
    );

    button.addEventListener("mouseenter", () => {
      if (isAnimating) return;
      isAnimating = true;
      appleButtonTimeline.play();
    });

    button.addEventListener("mouseleave", () => {
      if (isAnimating) return;
      isAnimating = true;
      appleButtonTimeline.reverse();
    });
  });
}

initAppleButtons();
