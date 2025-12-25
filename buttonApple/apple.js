// -----------------APPLE BUTTON ANIMATION----------------

function initAppleButtons() {
  const appleButtons = document.querySelectorAll(
    ".button_main_element.is-apple"
  );
  if (!appleButtons.length) return;

  function createAppleAnimations(buttons) {
    buttons.forEach((button) => {
      const buttonAppleText = button.querySelector(
        ".button_main_text.is-apple"
      );
      const buttonAppleLogo = button.querySelector(".btn_apple_icon");

      if (!buttonAppleText || !buttonAppleLogo) return;

      const appleButtonTimeline = gsap.timeline({ paused: true });
      appleButtonTimeline.to(buttonAppleText, {
        y: "-250%",
        duration: 0.5,
      });
      appleButtonTimeline.fromTo(
        buttonAppleLogo,
        {
          y: "200%",
        },
        {
          y: "-50%",
          duration: 0.5,
        },
        ">"
      );

      button.addEventListener("mouseenter", () => {
        appleButtonTimeline.play();
      });

      button.addEventListener("mouseleave", () => {
        appleButtonTimeline.reverse();
      });
    });
  }

  createAppleAnimations(appleButtons);
}

initAppleButtons();
