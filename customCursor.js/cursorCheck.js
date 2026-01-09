class CursorEffect {
  constructor() {
    this.DOM = {
      main: document.querySelector(".js-masker"),
    };

    this.cursor = {
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
    };

    this.easing = 0.15; // Valeur pour la fluidité du mouvement du masque

    this.init();
  }

  init() {
    this.bindEvents();
    this.render();
  }

  bindEvents() {
    // ... (identique à la version précédente)
    document.body.addEventListener(
      "mousemove",
      this.handleMouseMoving.bind(this)
    );
    document.addEventListener("scroll", this.onScroll.bind(this));

    // Pour agrandir le masque
    document.querySelectorAll("[data-cursor-extend]").forEach((el) => {
      el.addEventListener("mouseenter", this.onEnterExtend.bind(this));
      el.addEventListener("mouseleave", this.onLeave.bind(this));
    });

    // Pour réduire le masque
    document.querySelectorAll("[data-cursor-contract]").forEach((el) => {
      el.addEventListener("mouseenter", this.onEnterContract.bind(this));
      el.addEventListener("mouseleave", this.onLeave.bind(this));
    });
  }

  handleMouseMoving(event) {
    this.cursor.last.x = event.clientX;
    this.cursor.last.y = event.clientY;
  }

  onScroll(event) {
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

  render() {
    requestAnimationFrame(this.render.bind(this));

    // Interpolation pour un mouvement fluide
    this.cursor.current.x =
      this.cursor.current.x +
      (this.cursor.last.x - this.cursor.current.x) * this.easing;
    this.cursor.current.y =
      this.cursor.current.y +
      (this.cursor.last.y - this.cursor.current.y) * this.easing;

    // Si la valeur du curseur est proche de zéro, la définir à zéro exactement
    if (this.cursor.value < 0.5) {
      this.cursor.value = 0;
    }

    // Mise à jour des propriétés CSS pour le masque
    this.DOM.main.style = `--size: ${this.cursor.value}px; --x: ${
      this.cursor.current.x
    }px; --y: ${this.cursor.current.y + this.cursor.scroll}px;`;
  }
}

document.addEventListener("DOMContentLoaded", function () {
  new CursorEffect();
});

function adjustHeight() {
  // Supposons qu'il y ait jusqu'à 10 paires pour l'exemple.
  // Vous pouvez augmenter ce nombre selon vos besoins.
  for (let i = 1; i <= 10; i++) {
    // Récupérer la hauteur de l'élément text-active-i
    let activeTextHeight = $(`[text-active-${i}]`).height();

    // Ajuster la hauteur de l'élément text-mask-i correspondant
    $(`[text-mask-${i}]`).height(activeTextHeight);
  }
}

$(document).ready(function () {
  adjustHeight(); // Ajustez d'abord la hauteur

  $(window).resize(adjustHeight);
});

// Slider
