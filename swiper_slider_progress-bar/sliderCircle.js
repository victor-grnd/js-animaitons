const SLIDE_DURATION = 3;
let progressTween = null;
let activeIndex = 0;

const slides = document.querySelectorAll("[data-slider-2='slide']");
const circleProgress = document.querySelector("[data-slider-2='circle']");
const paginationWrapper = document.querySelector(
  "[data-slider-2='pagination']"
);
const counter = document.querySelector("[data-slider-2='counter']");

const circleRadius = circleProgress?.getAttribute("rx");
const circleLength = 2 * Math.PI * circleRadius;

const activeClass = "is-active";
const inactiveClass = "is-inactive";

const mainSwiper = new Swiper("[data-slider-2='slider']", {
  slidesPerView: 1,
  allowTouchMove: true,
  autoplay: {
    delay: SLIDE_DURATION * 1000,
    disableOnInteraction: false,
  },
  effect: "fade",
  speed: 200,
  fadeEffect: {
    crossFade: true,
  },
  on: {
    slideChange: () => {
      activeIndex = mainSwiper.activeIndex;
      updatePaginationClassesAndBars();
      startProgress();
    },
  },
});

function generateInnerHtml(paginaitonLabel) {
  const innerHtml = `
    <div class="slider-sect_slider_label u-text-style-main">${paginaitonLabel}</div>`;
  return innerHtml;
}

function initPaginationItems(slides) {
  slides.forEach((slide, index) => {
    const paginationItem = document.createElement("div");
    const paginationLabel = slide.dataset.label;
    paginationItem.classList.add("slider-sect_slider_pagination-item");
    paginationItem.dataset.index = index;
    paginationItem.setAttribute("data-slider-2", "pagination-item");
    paginationItem.innerHTML = generateInnerHtml(paginationLabel);
    paginationWrapper.appendChild(paginationItem);

    paginationItem.addEventListener("click", () => {
      mainSwiper.slideTo(index);
    });
  });
}

function updatePaginationClassesAndBars() {
  const paginationsItems = document.querySelectorAll(
    "[data-slider-2='pagination-item']"
  );

  paginationsItems.forEach((item, index) => {
    item.classList.remove(activeClass, inactiveClass);
    if (index === activeIndex) {
      item.classList.add(activeClass);
    } else {
      item.classList.add(inactiveClass);
    }
  });
}

function startProgress() {
  if (progressTween) {
    progressTween.kill();
    gsap.set(circleProgress, {
      strokeDashoffset: 0,
    });
  }

  if (counter) counter.textContent = SLIDE_DURATION;

  progressTween = gsap.to(circleProgress, {
    strokeDashoffset: circleLength,
    duration: SLIDE_DURATION,
    ease: "linear",
    onUpdate: function () {
      const progress = this.progress();
      const timeRemaining = Math.ceil((1 - progress) * SLIDE_DURATION);

      counter.textContent = timeRemaining;
    },
    onComplete: () => {
      counter.textContent = SLIDE_DURATION;
    },
  });
}

function initSlider() {
  initPaginationItems(slides);
  updatePaginationClassesAndBars();
  startProgress();
}

initSlider();
