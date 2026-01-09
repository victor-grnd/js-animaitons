//-----------------------------BUBBLE BUTTON-----------------------------

class BubbleButton {
  constructor(buttonElement) {
    this.button = buttonElement;
    this.bubble = this.button.querySelector(".button_main_circle");
    this.isAnimating = false;

    if (!this.bubble) {
      console.warn("Aucun élément .button_main_circle trouvé dans le bouton");
      return;
    }

    this.init();
  }

  init() {
    this.xSet = (value) => {
      this.bubble.style.left = `${value}px`;
    };

    this.ySet = (value) => {
      this.bubble.style.top = `${value}px`;
    };

    this.initEvents();
  }

  getXY(e) {
    const rect = this.button.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  async sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async animateBubbleIn(e) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const { x, y } = this.getXY(e);

    // Positionner la bulle
    this.xSet(x);
    this.ySet(y);

    // Forcer un reflow pour séparer le positionnement du scale
    this.bubble.offsetHeight;

    // Animer le scale
    this.bubble.style.transform = "scale(9)";

    await this.sleep(150);
    this.isAnimating = false;
  }

  async animateBubbleOut(e) {
    // Attendre que l'animation d'entrée se termine
    while (this.isAnimating) {
      await this.sleep(25);
    }

    const { x, y } = this.getXY(e); // x et y = coordonées de la mouse quand elle sort
    const rect = this.button.getBoundingClientRect();

    // Calculer si on sort par un bord
    const xPercent = (x / rect.width) * 100;
    const yPercent = (y / rect.height) * 100;

    // Animer vers l'extérieur si on sort par un bord
    if (xPercent > 90 || xPercent < 10 || yPercent > 90 || yPercent < 10) {
      const offsetX = xPercent > 90 ? 20 : xPercent < 10 ? -20 : 0;
      const offsetY = yPercent > 90 ? 20 : yPercent < 10 ? -20 : 0;

      this.xSet(x + offsetX);
      this.ySet(y + offsetY);
    }

    // Rétrécir la bulle
    this.bubble.style.transform = "scale(0)";
  }

  handleMouseMove(e) {
    if (!this.isAnimating) return;

    const { x, y } = this.getXY(e);
    this.xSet(x);
    this.ySet(y);
  }

  initEvents() {
    this.button.addEventListener("mouseenter", (e) => {
      this.animateBubbleIn(e);
    });

    this.button.addEventListener("mouseleave", (e) => {
      this.animateBubbleOut(e);
    });

    this.button.addEventListener("mousemove", (e) => {
      this.handleMouseMove(e);
    });
  }
}

const bubbleButtons = document.querySelectorAll(".button_main_wrap.is-bubble");

bubbleButtons.forEach((button) => {
  new BubbleButton(button);
});

//-----------------------SHADOW BUTTON-------------------

class shadowButton {
  constructor(button) {
    this.button = button;
    this.shadow = this.button.querySelector(".button_main_shadow");
    if (!this.shadow) return;
    this.init();
  }

  init() {
    this.setPosition = (x, y) => {
      this.shadow.style.transform = `translate(${x}px, ${y}px)`;
    };
    this.initEvents();
  }

  getXY(e) {
    const rect = this.button.getBoundingClientRect();
    // On centre la shadow sur le curseur (optionnel, selon ton CSS)
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  handleMove(e) {
    const { x, y } = this.getXY(e);
    this.setPosition(x, y);
  }

  initEvents() {
    this.button.addEventListener("mousemove", (e) => {
      this.handleMove(e);
    });
  }
}

const shadowButtons = document.querySelectorAll(".button_main_wrap.is-shadow");

shadowButtons.forEach((button) => {
  new shadowButton(button);
});
//----------------------APPLE BUTTON ANIMATION---------------------

const appleButtons = document.querySelectorAll(".button_main_wrap.is-apple");

appleButtons.forEach((button) => {
  const appleText = button.querySelector(".apple_main_text");
  const appleIcon = button.querySelector(".btn_apple_icon");

  if (!appleText || !appleIcon) return;

  const appleTl = gsap.timeline({ paused: true });

  appleTl
    .to(appleText, {
      yPercent: -200,
      duration: 0.6,
      ease: "power2.inOut",
    })
    .to(
      appleIcon,
      {
        yPercent: -200,
        duration: 0.6,
        ease: "power2.inOut",
      },
      "<"
    );

  button.addEventListener("mouseenter", () => appleTl.play());
  button.addEventListener("mouseleave", () => appleTl.reverse());
});

//------------------------------BUTTON TEXT STAGGER AND ARROW ANIMATION-----------------------------

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
