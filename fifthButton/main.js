const fifthsButtons = document.querySelectorAll(".button_main_wrap.is-fifth");

fifthsButtons.forEach((button) => {
  const textAbove = button.querySelector(".fifth_main_text:not(.is-below)");
  const textBelow = button.querySelector(".fifth_main_text.is-below");
  const arrow = button.querySelector(".u-svg");

  if (!textAbove || !textBelow || !arrow) {
    return;
  }

  function initTextSplit(text) {
    const textSplit = SplitText.create(text, {
      type: "chars",
    });

    return textSplit.chars;
  }

  const textAboveSplited = initTextSplit(textAbove);
  const textBelowSplited = initTextSplit(textBelow);

  const timeline = gsap.timeline({
    paused: true,
    defaults: {
      ease: "power1.out",
    },
  });

  timeline.to(
    textAboveSplited,
    {
      yPercent: -100,
      duration: 0.3,
      stagger: {
        amount: 0.2,
      },
    },
    0
  );

  timeline.fromTo(
    textBelowSplited,
    {
      yPercent: 100,
    },
    {
      yPercent: -100,
      duration: 0.3,
      stagger: {
        amount: 0.2,
      },
    },
    0.1
  );

  timeline.to(
    arrow,
    {
      xPercent: 100,
      yPercent: -100,
      duration: 0.3,
    },
    0
  );

  timeline.fromTo(
    arrow,
    {
      xPercent: -100,
      yPercent: 100,
    },
    {
      xPercent: 0,
      yPercent: 0,
      duration: 0.5,
      immediateRender: false,
    },
    0.2
  );

  button.addEventListener("mouseenter", () => {
    timeline.play();
  });

  button.addEventListener("mouseleave", () => {
    timeline.reverse();
  });
});
