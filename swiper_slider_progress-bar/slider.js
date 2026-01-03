const SLIDE_DURATION = 3;
let progressTween = null;
let activeIndex = 0;

const slides = document.querySelectorAll(
  ".slider-sect_slider_slide.swiper-slide"
);
const paginationWrapper = document.querySelector(
  ".slider-sect_slider_pagination"
);

const activeClass = "is-active";
const inactiveClass = "is-inactive";

const mainSwiper = new Swiper(".slider-sect_slider_wrap.swiper", {
  slidesPerView: 1,
  allowTouchMove: true, // the slider can be controlled by fingers gestures
  autoplay: {
    delay: SLIDE_DURATION * 1000,
    disableOnInteraction: false, // autoplay don't resset
  },
  effect: "fade",
  speed: 200, // duration of the slides change transtion

  fadeEffect: {
    crossFade: true, // the slides fade at the sime time and the first doesn't have to wait for the second to be done
  },

  on: {
    slideChange: () => {
      activeIndex = mainSwiper.activeIndex;
      updatePaginationClassesAndBars();
      startProgress(activeIndex);
    },
  },
});

function generateInnerHtml(paginaitonLabel) {
  const innerHtml = ` <div class="slider-sect_slider_pagination-bar">
      <div class="slider-sect_slider_progress"></div>
    </div>
    <div class="slider-sect_slider_label u-text-style-h3">${paginaitonLabel}</div>`;
  return innerHtml;
}

function initPaginationItems(slides) {
  slides.forEach((slide, index) => {
    const paginationItem = document.createElement("div");
    const paginationLabel = slide.dataset.label;
    paginationItem.classList.add("slider-sect_slider_pagination-item");
    paginationItem.dataset.index = index;
    paginationItem.innerHTML = generateInnerHtml(paginationLabel);
    paginationWrapper.appendChild(paginationItem);

    paginationItem.addEventListener("click", () => {
      mainSwiper.slideTo(index);
    });
  });
}

function updatePaginationClassesAndBars() {
  const paginationsItems = document.querySelectorAll(
    ".slider-sect_slider_pagination-item"
  );

  document.querySelectorAll(".slider-sect_slider_progress").forEach((bar) => {
    bar.style.height = "0%";
  });

  paginationsItems.forEach((item, index) => {
    item.classList.remove(activeClass, inactiveClass);
    if (index === activeIndex) {
      item.classList.add(activeClass);
    } else {
      item.classList.add(inactiveClass);
    }
  });
}

function startProgress(index) {
  const barToFill = document.querySelector(
    `.slider-sect_slider_pagination-item[data-index="${index}"] .slider-sect_slider_progress`
  );

  if (!barToFill) return;
  if (progressTween) {
    progressTween.kill();
  }
  progressTween = gsap.to(barToFill, {
    height: "100%",
    duration: SLIDE_DURATION,
    ease: "linear",
  });
}

function initSlider() {
  initPaginationItems(slides);
  updatePaginationClassesAndBars();
  startProgress(0);
}

initSlider();
