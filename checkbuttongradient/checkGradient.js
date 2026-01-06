// ============================================
// CONFIGURATION GSAP ET EASINGS
// ============================================

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);

// Création des courbes d'animation personnalisées
CustomEase.create("ease-main", "0.625, 0.02, 0, 1.05");
CustomEase.create("ease-out-smooth", "0.22, 1, 0.36, 1");
CustomEase.create("ease-out-fast", "0.4, 0, 0.2, 1");
CustomEase.create("ease-in-out-balanced", "0.45, 0, 0.55, 1");
CustomEase.create("ease-hover", "0.25, 0.8, 0.25, 1");
CustomEase.create("ease-pop", "0.5, 1.5, 0.5, 1");

const easings = {
  main: "ease-main",
  outSmooth: "ease-out-smooth",
  outFast: "ease-out-fast",
  inOut: "ease-in-out-balanced",
  hover: "ease-hover",
  pop: "ease-pop",
};

const durations = {
  default: 0.8,
  quarter: 0.2,
  half: 0.4,
  oneQuarter: 0.6,
  oneHalf: 1.2,
  double: 1.6,
  hover: 0.15,
  modalEnter: 0.2,
  modalExit: 0.15,
  long: 1,
  staggerDefault: 0.075,
};

gsap.defaults({
  ease: easings.main,
  duration: durations.default,
});

// Variables globales
let menuOpen = false;
let menuButton = document.querySelector(".menu-button");

// Détection du type d'appareil
const isMobile = window.innerWidth < 480;
const isMobileLandscape = window.innerWidth >= 480 && window.innerWidth < 768;
const isTablet = window.innerWidth >= 768 && window.innerWidth < 992;
const isDesktop = window.innerWidth >= 992;

// ============================================
// DÉTECTION DE LA DIRECTION DU SCROLL
// ============================================

function initCheckScrollUpDown() {
  let lastScrollPosition = 0;

  function handleScroll() {
    const currentScrollPosition = window.scrollY;

    // Si le scroll a changé de plus de 50px
    if (Math.abs(lastScrollPosition - currentScrollPosition) >= 50) {
      // Définir la direction du scroll (up ou down)
      document.body.setAttribute(
        "data-scrolling-direction",
        currentScrollPosition > lastScrollPosition ? "down" : "up"
      );
      lastScrollPosition = currentScrollPosition;
    }

    // Marquer si le scroll a commencé (après 50px)
    document.body.setAttribute(
      "data-scrolling-started",
      currentScrollPosition > 50 ? "true" : "false"
    );
  }

  window.addEventListener("scroll", handleScroll);
}

// ============================================
// SPLIT TEXT (Animation de texte)
// ============================================

function initSplit() {
  let elementsToSplitByLines = document.querySelectorAll(
    '[data-split="lines"]'
  );
  let elementsToSplitByLetters = document.querySelectorAll(
    '[data-split="letters"]'
  );

  // Split par lignes
  new SplitText(elementsToSplitByLines, {
    type: "lines",
    linesClass: "single-line",
  }).lines.forEach((line) => {
    // Envelopper chaque ligne dans un wrapper
    let wrapper = document.createElement("div");
    wrapper.classList.add("single-line-wrap");
    line.parentNode.insertBefore(wrapper, line);
    wrapper.appendChild(line);
  });

  // Split par lettres
  Array.from(elementsToSplitByLetters)
    .map((element) => {
      if (!element.hasAttribute("split-ran")) {
        return new SplitText(element, {
          type: "words, chars",
          charsClass: "single-letter",
        });
      }
    })
    .forEach((splitResult) => {
      if (splitResult) {
        splitResult.elements[0].setAttribute("split-ran", "true");

        // Ajouter des delays aux lettres si demandé
        if (splitResult.elements[0].hasAttribute("data-letters-delay")) {
          splitResult.chars.forEach((char, index) => {
            let delay = index / 150 + "s";
            char.style.setProperty("transition-delay", delay);
          });
        }
      }
    });
}

// ============================================
// RÉVÉLATION DE TEXTE AU SCROLL
// ============================================

function initRevealTextScroll(container) {
  container.querySelectorAll('[data-reveal="scroll"]').forEach((element) => {
    let lines = element.querySelectorAll(".single-line");

    gsap.to(lines, {
      y: 0,
      duration: durations.default + 0.2,
      stagger: durations.staggerDefault,
      ease: easings.iosSheet,
      scrollTrigger: {
        trigger: element,
        start: "top 90%",
        once: true,
      },
    });
  });
}

// ============================================
// RÉVÉLATION EN FONDU AU SCROLL
// ============================================

function initRevealFadeScroll(container) {
  container.querySelectorAll('[data-reveal="fade"]').forEach((element) => {
    gsap.from(element, {
      yPercent: 20,
      autoAlpha: 0,
      duration: durations.default + 0.2,
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        once: true,
      },
    });
  });
}

// ============================================
// MENU MOBILE
// ============================================

function initMobileMenu() {
  if (!document.querySelector(".header")) return;

  let menu = document.querySelector(".nav_menu");
  let navButtons = document.querySelectorAll("[data-nav-button]");
  let menuRevealElements = menu.querySelectorAll("[data-menu-reveal]");
  let menuBackground = document.querySelector(".menu_bg");
  let menuLinks = menu.querySelectorAll("a");
  let timeline = gsap.timeline();

  // Fonction pour fermer le menu
  const closeMenu = () => {
    menuOpen = false;
    menuButton.classList.remove("close");
    document.body.setAttribute("data-nav-status", "closed");

    timeline
      .clear()
      .to(menu, { yPercent: -120 })
      .to(menuBackground, { autoAlpha: 0 }, "<")
      .to(
        navButtons,
        {
          autoAlpha: 1,
          y: "0em",
          stagger: { each: 0.05, from: "end" },
        },
        "<+=0.2"
      )
      .set(menu, { display: "none" });
  };

  // Toggle du menu
  menuButton.addEventListener("click", () => {
    if (menuOpen) {
      closeMenu();
    } else {
      menuOpen = true;
      menuButton.classList.add("close");
      document.body.setAttribute("data-nav-status", "open");

      timeline
        .clear()
        .set([menu, menuBackground], { display: "block" })
        .fromTo(menuBackground, { autoAlpha: 0 }, { autoAlpha: 1 })
        .fromTo(
          navButtons,
          { autoAlpha: 1, y: "0em" },
          { autoAlpha: 0, y: "-3em", stagger: 0.01 },
          "<"
        )
        .fromTo(menu, { yPercent: -120 }, { yPercent: 0 }, "<+=0.2")
        .fromTo(
          menuRevealElements,
          { autoAlpha: 0, yPercent: 50 },
          { autoAlpha: 1, yPercent: 0, stagger: 0.05 },
          "<+=0.25"
        );
    }
  });

  // Fermer le menu en cliquant sur le background
  menuBackground.addEventListener("click", () => {
    closeMenu();
  });

  // Fermer le menu en cliquant sur un lien
  menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (menuOpen) closeMenu();
    });
  });
}

// ============================================
// ANNÉE COURANTE
// ============================================

function initCurrentYear(container) {
  const currentYear = new Date().getFullYear();
  const yearElements = container.querySelectorAll("[data-current-year]");

  if (yearElements.length > 0) {
    yearElements.forEach((element) => {
      element.textContent = currentYear;
    });
  }
}

// ============================================
// FAQ / ACCORDÉON
// ============================================

function initFaq(container) {
  let dropdownItems = container.querySelectorAll(".dropdown-item");

  if (dropdownItems.length === 0) return;

  dropdownItems.forEach((item) => {
    let link = item.querySelector(".dropdown-link");
    let content = item.querySelector(".dropdown-content");

    link.addEventListener("click", () => {
      // Fermer les autres items ouverts
      dropdownItems.forEach((otherItem) => {
        if (
          otherItem !== item &&
          otherItem.getAttribute("data-state") === "open"
        ) {
          otherItem.setAttribute("data-state", "closed");
          gsap.to(otherItem.querySelector(".dropdown-content"), {
            height: 0,
            duration: 0.65,
            onComplete: ScrollTrigger.refresh,
          });
        }
      });

      // Toggle l'item actuel
      if (item.getAttribute("data-state") === "closed") {
        item.setAttribute("data-state", "open");
        gsap.to(content, {
          height: "auto",
          onComplete: ScrollTrigger.refresh,
        });
      } else {
        item.setAttribute("data-state", "closed");
        gsap.to(content, {
          height: 0,
          duration: 0.65,
          onComplete: ScrollTrigger.refresh,
        });
      }
    });
  });
}

// ============================================
// VALIDATION DE FORMULAIRE AVANCÉE
// ============================================

function initAdvancedFormValidation() {
  document.querySelectorAll("[data-form-validate]").forEach((formContainer) => {
    const formSubmissionTime = new Date().getTime();
    const form = formContainer.querySelector("form");

    if (!form) return;

    const fieldsToValidate = form.querySelectorAll("[data-validate]");
    const submitContainer = form.querySelector("[data-submit]");

    if (!submitContainer) return;

    const submitInput = submitContainer.querySelector('input[type="submit"]');

    if (!submitInput) return;

    // Vérifier si le formulaire a été soumis trop rapidement (protection spam)
    function isSubmittedTooQuickly() {
      return new Date().getTime() - formSubmissionTime < 5000; // 5 secondes
    }

    // Valider un champ individuel
    function isFieldValid(fieldWrapper) {
      const radioCheckGroup = fieldWrapper.querySelector(
        "[data-radiocheck-group]"
      );

      // Validation pour groupes radio/checkbox
      if (radioCheckGroup) {
        const inputs = radioCheckGroup.querySelectorAll(
          'input[type="radio"], input[type="checkbox"]'
        );
        const checkedInputs = radioCheckGroup.querySelectorAll("input:checked");
        const minRequired = parseInt(radioCheckGroup.getAttribute("min")) || 1;
        const maxAllowed =
          parseInt(radioCheckGroup.getAttribute("max")) || inputs.length;
        const checkedCount = checkedInputs.length;

        if (inputs[0].type === "radio") {
          return checkedCount >= 1;
        } else {
          if (inputs.length === 1) {
            return inputs[0].checked;
          }
          return checkedCount >= minRequired && checkedCount <= maxAllowed;
        }
      }

      // Validation pour champs standards
      const input = fieldWrapper.querySelector("input, textarea, select");
      if (!input) return false;

      let isValid = true;
      const minLength = parseInt(input.getAttribute("min")) || 0;
      const maxLength = parseInt(input.getAttribute("max")) || Infinity;
      const value = input.value.trim();
      const valueLength = value.length;

      // Validation select
      if (input.tagName.toLowerCase() === "select") {
        if (
          value === "" ||
          value === "disabled" ||
          value === "null" ||
          value === "false"
        ) {
          isValid = false;
        }
      }
      // Validation email
      else if (input.type === "email") {
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      }
      // Validation longueur
      else {
        if (input.hasAttribute("min") && valueLength < minLength) {
          isValid = false;
        }
        if (input.hasAttribute("max") && valueLength > maxLength) {
          isValid = false;
        }
      }

      return isValid;
    }

    // Mettre à jour l'état visuel d'un champ
    function updateFieldVisualState(fieldWrapper) {
      const radioCheckGroup = fieldWrapper.querySelector(
        "[data-radiocheck-group]"
      );

      if (radioCheckGroup) {
        const inputs = radioCheckGroup.querySelectorAll(
          'input[type="radio"], input[type="checkbox"]'
        );
        const checkedCount =
          radioCheckGroup.querySelectorAll("input:checked").length;

        // Classe "filled"
        if (checkedCount > 0) {
          fieldWrapper.classList.add("is--filled");
        } else {
          fieldWrapper.classList.remove("is--filled");
        }

        // Classe "success" ou "error"
        if (isFieldValid(fieldWrapper)) {
          fieldWrapper.classList.add("is--success");
          fieldWrapper.classList.remove("is--error");
        } else {
          fieldWrapper.classList.remove("is--success");

          // N'afficher l'erreur que si la validation a commencé
          if (Array.from(inputs).some((input) => input.__validationStarted)) {
            fieldWrapper.classList.add("is--error");
          } else {
            fieldWrapper.classList.remove("is--error");
          }
        }
      } else {
        const input = fieldWrapper.querySelector("input, textarea, select");
        if (!input) return;

        // Classe "filled"
        if (input.value.trim()) {
          fieldWrapper.classList.add("is--filled");
        } else {
          fieldWrapper.classList.remove("is--filled");
        }

        // Classe "success" ou "error"
        if (isFieldValid(fieldWrapper)) {
          fieldWrapper.classList.add("is--success");
          fieldWrapper.classList.remove("is--error");
        } else {
          fieldWrapper.classList.remove("is--success");

          if (input.__validationStarted) {
            fieldWrapper.classList.add("is--error");
          } else {
            fieldWrapper.classList.remove("is--error");
          }
        }
      }
    }

    // Valider tous les champs du formulaire
    function validateAllFields() {
      let allValid = true;
      let firstInvalidField = null;

      fieldsToValidate.forEach(function (fieldWrapper) {
        const input = fieldWrapper.querySelector("input, textarea, select");
        const radioCheckGroup = fieldWrapper.querySelector(
          "[data-radiocheck-group]"
        );

        if (input || radioCheckGroup) {
          // Marquer la validation comme commencée
          if (input) {
            input.__validationStarted = true;
          }

          if (radioCheckGroup) {
            radioCheckGroup.__validationStarted = true;
            radioCheckGroup
              .querySelectorAll('input[type="radio"], input[type="checkbox"]')
              .forEach(function (input) {
                input.__validationStarted = true;
              });
          }

          updateFieldVisualState(fieldWrapper);

          if (!isFieldValid(fieldWrapper)) {
            allValid = false;
            if (!firstInvalidField) {
              firstInvalidField =
                input || radioCheckGroup.querySelector("input");
            }
          }
        }
      });

      // Focus sur le premier champ invalide
      if (!allValid && firstInvalidField) {
        firstInvalidField.focus();
      }

      return allValid;
    }

    // Désactiver les options disabled des select
    fieldsToValidate.forEach(function (fieldWrapper) {
      const select = fieldWrapper.querySelector("select");
      if (select) {
        select.querySelectorAll("option").forEach(function (option) {
          if (
            option.value === "" ||
            option.value === "disabled" ||
            option.value === "null" ||
            option.value === "false"
          ) {
            option.setAttribute("disabled", "disabled");
          }
        });
      }
    });

    // Attacher les événements de validation
    fieldsToValidate.forEach(function (fieldWrapper) {
      const input = fieldWrapper.querySelector("input, textarea, select");
      const radioCheckGroup = fieldWrapper.querySelector(
        "[data-radiocheck-group]"
      );

      if (radioCheckGroup) {
        radioCheckGroup
          .querySelectorAll('input[type="radio"], input[type="checkbox"]')
          .forEach(function (input) {
            input.__validationStarted = false;

            input.addEventListener("change", function () {
              requestAnimationFrame(function () {
                if (!input.__validationStarted) {
                  const checkedCount =
                    radioCheckGroup.querySelectorAll("input:checked").length;
                  const minRequired =
                    parseInt(radioCheckGroup.getAttribute("min")) || 1;

                  if (checkedCount >= minRequired) {
                    input.__validationStarted = true;
                  }
                }

                if (input.__validationStarted) {
                  updateFieldVisualState(fieldWrapper);
                }
              });
            });

            input.addEventListener("blur", function () {
              input.__validationStarted = true;
              updateFieldVisualState(fieldWrapper);
            });
          });
      } else if (input) {
        input.__validationStarted = false;

        if (input.tagName.toLowerCase() === "select") {
          input.addEventListener("change", function () {
            input.__validationStarted = true;
            updateFieldVisualState(fieldWrapper);
          });
        } else {
          input.addEventListener("input", function () {
            const valueLength = input.value.trim().length;
            const minLength = parseInt(input.getAttribute("min")) || 0;
            const maxLength = parseInt(input.getAttribute("max")) || Infinity;

            if (!input.__validationStarted) {
              if (input.type === "email") {
                if (isFieldValid(fieldWrapper)) {
                  input.__validationStarted = true;
                }
              } else {
                if (
                  (input.hasAttribute("min") && valueLength >= minLength) ||
                  (input.hasAttribute("max") && valueLength <= maxLength)
                ) {
                  input.__validationStarted = true;
                }
              }
            }

            if (input.__validationStarted) {
              updateFieldVisualState(fieldWrapper);
            }
          });

          input.addEventListener("blur", function () {
            input.__validationStarted = true;
            updateFieldVisualState(fieldWrapper);
          });
        }
      }
    });

    // Soumettre le formulaire au clic
    submitContainer.addEventListener("click", function () {
      if (validateAllFields()) {
        if (isSubmittedTooQuickly()) {
          alert("Form submitted too quickly. Please try again.");
          return;
        }
        submitInput.click();
      }
    });

    // Soumettre le formulaire avec Enter
    form.addEventListener("keydown", function (event) {
      if (
        event.key === "Enter" &&
        event.target.tagName !== "TEXTAREA" &&
        (event.preventDefault(), validateAllFields())
      ) {
        if (isSubmittedTooQuickly()) {
          alert("Form submitted too quickly. Please try again.");
          return;
        }
        submitInput.click();
      }
    });
  });
}

// ============================================
// ⭐ ANIMATION DES BORDURES DE BOUTON ⭐
// Cette fonction gère les variables CSS --x et --r2
// ============================================

function initBtnWrapAnimation() {
  // Fonction d'interpolation linéaire
  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }

  // Animation de rotation (--r2)
  function animateRotation(element, duration, startTime) {
    const now = Date.now();
    let rotation;
    let progress = (now - startTime) / duration;

    // Animation par segments avec des paliers
    if (progress < 0.3282275711) {
      rotation = lerp(0, 0, progress / 0.3282275711); // mettre le progress par rapport aux 33% premiers pourcents
    } else if (progress < 0.5) {
      rotation = lerp(0, 180, (progress - 0.3282275711) / 0.1717724289); // normaliser progress pour avoir 0-1 entre 33% et 50% 0.17 = diff entre ,5 et ,33
    } else if (progress < 0.8282275711) {
      rotation = 180; // il reste a 80 de 0.5 à 0.82
    } else if (progress <= 1) {
      rotation = lerp(180, 360, (progress - 0.8282275711) / 0.1717724289); // normaliser sur la diff entre 1 et 0.82
    } else {
      rotation = 360;
      startTime = now; // Recommencer l'animation
    }

    element.style.setProperty("--r2", `${rotation}deg`);

    const animationFrameId = requestAnimationFrame(() =>
      animateRotation(element, duration, startTime)
    );

    // Stocker l'ID de l'animation frame
    animationStates.set(element, {
      ...animationStates.get(element),
      r2: animationFrameId,
    });
  }

  // Animation de position horizontale (--x)
  function animatePosition(element, duration, startTime) {
    const now = Date.now();
    let position;
    let progress = (now - startTime) / duration;

    // Animation par segments avec des paliers
    if (progress < 0.3282275711) {
      position = lerp(10, 90, progress / 0.3282275711);
    } else if (progress < 0.5) {
      position = 90;
    } else if (progress < 0.8282275711) {
      position = lerp(90, 10, (progress - 0.5) / 0.3282275711);
    } else if (progress <= 1) {
      position = 10;
    } else {
      position = 10;
      startTime = now; // Recommencer l'animation
    }

    element.style.setProperty("--x", `${position}%`);

    const animationFrameId = requestAnimationFrame(() =>
      animatePosition(element, duration, startTime)
    );

    // Stocker l'ID de l'animation frame
    animationStates.set(element, {
      ...animationStates.get(element),
      x: animationFrameId,
    });
  }

  const buttons = document.querySelectorAll(".btn_border");

  if (!buttons.length) return;

  const animationStates = new Map();

  // Initialiser les animations pour chaque bouton
  buttons.forEach((button) => {
    const existingState = animationStates.get(button);

    // Annuler les animations précédentes si elles existent
    if (existingState) {
      cancelAnimationFrame(existingState.r2);
      cancelAnimationFrame(existingState.x);
    }

    // Démarrer les animations (durée: 6 secondes)
    animateRotation(button, 6000, Date.now());
    animatePosition(button, 6000, Date.now());
  });
}

// ============================================
// ANIMATION DES CARACTÈRES DE BOUTON
// ============================================

function initButtonCharacterStagger() {
  const delayBetweenChars = 0.01; // secondes

  document.querySelectorAll("[data-button-animate-chars]").forEach((button) => {
    const text = button.textContent;
    button.innerHTML = "";

    [...text].forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.transitionDelay = index * delayBetweenChars + "s";

      // Préserver les espaces
      if (char === " ") {
        span.style.whiteSpace = "pre";
      }

      button.appendChild(span);
    });
  });
}

// ============================================
// SYSTÈME DE FILTRES
// ============================================

function initFilterBasic() {
  document.querySelectorAll("[data-filter-group]").forEach((filterGroup) => {
    const filterButtons = filterGroup.querySelectorAll("[data-filter-target]");
    const filterableItems = filterGroup.querySelectorAll("[data-filter-name]");
    const transitionDuration = 300;

    // Mettre à jour l'état d'un élément filtrable
    const updateItemState = (item, isActive) => {
      item.setAttribute(
        "data-filter-status",
        isActive ? "active" : "not-active"
      );
      item.setAttribute("aria-hidden", isActive ? "false" : "true");

      // Gérer l'animation des marquees
      item.querySelectorAll("[data-marquee-list]").forEach((marquee) => {
        marquee.style.animationPlayState = isActive ? "running" : "paused";
      });
    };

    // Appliquer un filtre
    const applyFilter = (filterName) => {
      // Mettre à jour les éléments filtrables
      filterableItems.forEach((item) => {
        const itemName = item.getAttribute("data-filter-name");
        const shouldBeActive = filterName === "all" || itemName === filterName;

        // Pauser les marquees des items non actifs
        if (!shouldBeActive) {
          item.querySelectorAll("[data-marquee-list]").forEach((marquee) => {
            marquee.style.animationPlayState = "paused";
          });
        }

        // Transition avec délai
        if (item.getAttribute("data-filter-status") === "active") {
          item.setAttribute("data-filter-status", "transition-out");
          setTimeout(
            () => updateItemState(item, shouldBeActive),
            transitionDuration
          );
        } else {
          setTimeout(
            () => updateItemState(item, shouldBeActive),
            transitionDuration
          );
        }
      });

      // Mettre à jour les boutons de filtre
      filterButtons.forEach((button) => {
        const buttonTarget = button.getAttribute("data-filter-target");
        const isActive = buttonTarget === filterName;

        button.setAttribute(
          "data-filter-status",
          isActive ? "active" : "not-active"
        );
        button.setAttribute("aria-pressed", isActive ? "true" : "false");
      });
    };

    // Attacher les événements aux boutons
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const filterTarget = button.getAttribute("data-filter-target");

        if (button.getAttribute("data-filter-status") !== "active") {
          applyFilter(filterTarget);
        }
      });
    });
  });
}

// ============================================
// MARQUEE CSS
// ============================================

function initCSSMarquee() {
  const pixelsPerSecond = 50;
  const marquees = document.querySelectorAll("[data-marquee]");

  // Dupliquer les listes pour effet de boucle infinie
  marquees.forEach((marquee) => {
    marquee.querySelectorAll("[data-marquee-list]").forEach((list) => {
      const clone = list.cloneNode(true);
      marquee.appendChild(clone);
    });
  });

  // Observer pour démarrer/pauser l'animation selon la visibilité
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.querySelectorAll("[data-marquee-list]").forEach((list) => {
          list.style.animationPlayState = entry.isIntersecting
            ? "running"
            : "paused";
        });
      });
    },
    { threshold: 0 }
  );

  // Configurer les marquees
  marquees.forEach((marquee) => {
    marquee.querySelectorAll("[data-marquee-list]").forEach((list) => {
      // Calculer la durée en fonction de la largeur
      list.style.animationDuration = list.offsetWidth / pixelsPerSecond + "s";
      list.style.animationPlayState = "paused";
    });

    observer.observe(marquee);
  });
}

// ============================================
// SWIPERS (Carrousels de vidéos)
// ============================================

function initTypeSwipers() {
  document.querySelectorAll(".swiper_type").forEach((swiperElement) => {
    // Gérer la lecture des vidéos
    function handleVideoPlayback(swiper) {
      const activeIndex = swiper.realIndex;
      let hasPlayedVideo = false;

      swiper.slides.forEach((slide) => {
        const video = slide.querySelector(".type_video");

        if (video) {
          const isActiveSlide =
            (slide.classList.contains("swiper-slide-active") &&
              !slide.classList.contains("swiper-slide-duplicate")) ||
            slide.dataset.swiperSlideIndex === String(activeIndex);

          if (isActiveSlide) {
            if (video.paused) {
              video
                .play()
                .then(() => {
                  hasPlayedVideo = true;
                })
                .catch(() => {});
            }
          } else {
            if (!video.paused) {
              video.pause();
              video.currentTime = 0;
            }
          }
        }
      });
    }

    // Pauser toutes les vidéos au départ
    swiperElement.querySelectorAll(".swiper-slide").forEach((slide) => {
      const video = slide.querySelector(".type_video");
      if (video) {
        video.pause();
      }
    });

    // Initialiser Swiper
    new Swiper(swiperElement, {
      loop: true,
      centeredSlides: true,
      slidesPerView: "auto",
      spaceBetween: 0,
      grabCursor: true,
      speed: 800,
      watchSlidesProgress: true,
      on: {
        // Au démarrage
        init(swiper) {
          setTimeout(() => {
            handleVideoPlayback(swiper);
          }, 100);
        },

        // Pendant le défilement - effet 3D
        progress(swiper) {
          swiper.slides.forEach((slide) => {
            const slideProgress = slide.progress;
            const scale = getScaleFromProgress(slideProgress);
            const absProgress = Math.abs(slideProgress);

            // Calcul du décalage horizontal
            const direction = slideProgress < 0 ? -1 : 1;
            const offset =
              absProgress > 1 ? direction * (absProgress - 1) * 60 : 0;

            // Appliquer les transformations
            slide.style.transform = `translateX(${offset}px) scale(${scale})`;
            slide.style.zIndex = Math.floor(100 * (1 - absProgress));
            slide.style.opacity = scale < 0.3 ? 0 : 1;
          });
        },

        // Définir la durée de transition
        setTransition(swiper, duration) {
          swiper.slides.forEach((slide) => {
            slide.style.transition = `${duration}ms transform, ${duration}ms opacity`;
          });
        },

        // Au début du changement de slide
        slideChangeTransitionStart(swiper) {
          swiper.slides.forEach((slide) => {
            const video = slide.querySelector(".type_video");
            if (video && !video.paused) {
              video.pause();
              video.currentTime = 0;
            }
          });
        },

        // À la fin du changement de slide
        slideChangeTransitionEnd(swiper) {
          setTimeout(() => {
            handleVideoPlayback(swiper);
          }, 50);
        },

        slideChange(swiper) {
          // Événement disponible mais non utilisé ici
        },
      },
    });
  });
}

// ============================================
// CALCUL DU SCALE POUR L'EFFET 3D DU SWIPER
// ============================================

function getScaleFromProgress(progress) {
  const absProgress = Math.abs(progress);

  if (absProgress < 1) {
    // Slide actif ou proche : scale de 1.0 à 0.8
    return 1 - 0.2 * absProgress;
  } else if (absProgress < 2) {
    // Slide suivant : scale de 0.8 à 0.6
    return 0.8 - 0.2 * (absProgress - 1);
  } else {
    // Slides lointains : scale minimum de 0.4
    return Math.max(0.4, 0.6 - 0.1 * (absProgress - 2));
  }
}

// ============================================
// FONCTION GÉNÉRALE D'INITIALISATION
// ============================================

function initGeneral() {
  initCheckScrollUpDown();
  initCurrentYear(document);
  initMobileMenu();
  initFaq(document);
  initBtnWrapAnimation();
  initFilterBasic();
  initCSSMarquee();
  initTypeSwipers();

  // N'activer l'animation des caractères que sur desktop
  if (window.innerWidth >= 992) {
    initButtonCharacterStagger();
  }

  // Rafraîchir ScrollTrigger après l'initialisation
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 300);
}

// ============================================
// GESTION DU RESIZE (Rechargement si changement desktop/mobile)
// ============================================

function handleResize() {
  let previousWidth = window.innerWidth;

  window.addEventListener("resize", () => {
    let currentWidth = window.innerWidth;

    // Recharger la page si on passe de desktop à mobile ou vice-versa
    const wasDesktop = previousWidth >= 992;
    const isNowDesktop = currentWidth >= 992;
    const wasMobile = previousWidth < 992;
    const isNowMobile = currentWidth < 992;

    if ((wasDesktop && isNowMobile) || (wasMobile && isNowDesktop)) {
      location.reload();
    }

    previousWidth = currentWidth;
  });
}

// ============================================
// DÉMARRAGE DE L'APPLICATION
// ============================================

// Attendre que les polices soient chargées avant d'initialiser
if (document.fonts) {
  document.fonts.ready.then(() => {
    initGeneral();
    handleResize();
  });
} else {
  // Fallback si l'API fonts n'est pas disponible
  setTimeout(() => {
    initGeneral();
    handleResize();
  }, 100);
}
