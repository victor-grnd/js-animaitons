class CursorEffect {
  constructor() {
    (this.DOM = document.querySelector(".second-layer")),
      (this.cursor = {
        current: {
          x: 0,
          y: 0,
        },
        last: {
          x: 0,
          y: 0,
        },
        value: 40, // Initialisation à une taille par défaut
        scroll: 0,
      });

    this.easing = 0.12; // Valeur pour la fluidité du mouvement du masque

    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    document.body.addEventListener(
      "mousemove",
      this.handleMouseMoving.bind(this)
    );
    document.addEventListener("scroll", this.onScroll.bind(this));

    document.querySelectorAll("[data-cursor-extend]").forEach((el) => {
      el.addEventListener("mouseenter", this.onEnterExtend.bind(this));
      el.addEventListener("mouseleave", this.onLeave.bind(this));
    });

    // Pour réduire le masque
    document.querySelectorAll("[data-cursor-contract]").forEach((el) => {
      el.addEventListener("mouseenter", this.onEnterContract.bind(this)); // here without bind, this would refer to the element that triggered the ael and not the instance of cursor
      el.addEventListener("mouseleave", this.onLeave.bind(this));
    });
  }

  handleMouseMoving(event) {
    this.cursor.last.x = event.clientX;
    this.cursor.last.y = event.clientY;
  }

  onScroll() {
    this.cursor.scroll = window.scrollY;
  }

  onEnterExtend() {
    gsap.to(this.cursor, {
      value: 450, // Ajustez cette valeur comme vous le souhaitez
      ease: "power3.out",
      duration: 0.6,
    });
  }

  onEnterContract() {
    gsap.to(this.cursor, {
      value: 0,
      ease: "power3.out",
      duration: 0.3,
    });
  }

  onLeave() {
    gsap.to(this.cursor, {
      value: 40, // Taille par défaut
      ease: "power3.out",
      duration: 0.6,
    });
  }

  lerp(start, end, easing) {
    return start + (end - start) * easing;
  }

  render() {
    requestAnimationFrame(this.render.bind(this));
    const currentX = this.cursor.current.x;
    const currentY = this.cursor.current.y;
    const pastX = this.cursor.last.x;
    const pastY = this.cursor.last.y;

    this.cursor.current.x = this.lerp(currentX, pastX, this.easing);
    this.cursor.current.y = this.lerp(currentY, pastY, this.easing);

    // Interpolation pour un mouvement fluide
    this.cursor.current.x =
      this.cursor.current.x +
      (this.cursor.last.x - this.cursor.current.x) * this.easing;
    this.cursor.current.y =
      this.cursor.current.y +
      (this.cursor.last.y - this.cursor.current.y) * this.easing;

    // Mise à jour des propriétés CSS pour le masque
    this.DOM.style.setProperty("--size", `${this.cursor.value}px`);
    this.DOM.style.setProperty("--x", `${this.cursor.current.x}px`);
    this.DOM.style.setProperty(
      "--y",
      `${this.cursor.current.y + this.cursor.scroll}px`
    );
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CursorEffect();
});
