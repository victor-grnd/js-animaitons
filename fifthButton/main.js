class FifthButton {
  constructor(button) {
    this.button = button;
    this.text = this.button.querySelector(".fifth_main_text");
    this.arrow = this.button.querySelector(".u-svg");
    this.timeline = null;
    this.textSplited = null;
    if (this.isValid()) {
      this.init();
    }
  }

  init() {
    this.timeline = gsap.timeline({ paused: true });
    this.initSplit(this.text);
    this.createTimeline();
    this.attachAEL();
  }

  initSplit(text) {
    const textSplited = new SplitText(text, {
      type: "chars",
      mask: "chars",
    });
    this.textSplited = textSplited.chars;
  }

  isValid() {
    return this.text && this.arrow;
  }

  createTimeline() {
    this.timeline.to(
      this.textSplited,
      {
        yPercent: -100,
        ease: "power1.out",
        duration: 0.3,
        stagger: {
          amount: 0.2,
        },
      },
      0
    );

    this.timeline.fromTo(
      this.textSplited,
      {
        yPercent: 100,
      },
      {
        yPercent: 0,
        ease: "power1.out",
        duration: 0.3,
        stagger: {
          amount: 0.2,
        },
      },
      0.13
    );

    this.timeline.to(
      this.arrow,
      {
        xPercent: 100,
        yPercent: -100,
        ease: "power1.out",
        duration: 0.5,
      },
      0
    );

    this.timeline.fromTo(
      this.arrow,
      {
        xPercent: -100,
        yPercent: 100,
      },
      {
        xPercent: 0,
        yPercent: 0,
        ease: "power1.out",
        duration: 0.5,
      },
      0.21
    );
  }

  attachAEL() {
    this.button.addEventListener("mouseenter", () => {
      this.timeline.play();
    });
    this.button.addEventListener("mouseleave", () => {
      this.timeline.reverse();
    });
  }
}

const fithsButtons = document.querySelectorAll(".button_main_wrap.is-fifth");
fithsButtons.forEach((button) => {
  new FifthButton(button);
});
