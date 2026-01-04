let swiperPortfolio = null;
let swiperPortfolioItemList = null;
let lastScreenWidth = window.innerWidth;
let isAnimating = false;
function initializeSwipers() {
  const screenWidth = window.innerWidth;
  if (swiperPortfolio) swiperPortfolio.destroy(true, true);
  if (swiperPortfolioItemList) swiperPortfolioItemList.destroy(true, true);
  if (screenWidth > 991) {
    swiperPortfolio = new Swiper(".swiper_portfolio", {
      slidesPerView: "auto",
      spaceBetween: 4,
      direction: "vertical",
      loop: false,
      centeredSlides: true,
      effect: "slide",
      speed: 800,
      navigation: {
        nextEl: ".swiper-button-next.is-portfolio",
        prevEl: ".swiper-button-prev.is-portfolio",
      },
    });
  } else {
    swiperPortfolio = new Swiper(".swiper_portfolio", {
      slidesPerView: "1",
      spaceBetween: 12,
      loop: false,
      centeredSlides: true,
      effect: "slide",
      speed: 800,
      navigation: {
        nextEl: ".swiper-button-next.is-portfolio",
        prevEl: ".swiper-button-prev.is-portfolio",
      },
      breakpoints: {
        320: {
          slidesPerView: 1.05,
          spaceBetween: 0,
        },
        480: {
          slidesPerView: 1.2,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 1.5,
          spaceBetween: 0,
        },
      },
    });
  }
  if (screenWidth > 991) {
    swiperPortfolioItemList = new Swiper(".portfolio_item_list", {
      slidesPerView: "auto",
      spaceBetween: 4,
      direction: "vertical",
      loop: false,
      centeredSlides: true,
      effect: "slide",
      speed: 0,
      allowTouchMove: false,
    });
  } else {
    swiperPortfolioItemList = new Swiper(".portfolio_item_list", {
      slidesPerView: "1",
      spaceBetween: 12,
      loop: false,
      centeredSlides: true,
      effect: "slide",
      speed: 0,
      allowTouchMove: false,
      breakpoints: {
        320: {
          slidesPerView: 1.05,
          spaceBetween: 0,
        },
        480: {
          slidesPerView: 1.2,
          spaceBetween: 0,
        },
        768: {
          slidesPerView: 1.5,
          spaceBetween: 0,
        },
      },
    });
  }
  swiperPortfolio.on("slideChange", () => {
    if (isAnimating) return;
    isAnimating = true;
    const activeIndex = swiperPortfolio.activeIndex;
    const currentSlide =
      swiperPortfolioItemList.slides[swiperPortfolioItemList.activeIndex]; // link the two sliders with the index of the pictures slider
    if (currentSlide) {
      currentSlide.classList.add("swiper-slide-wait");
    }
    document.querySelector(".swiper-button-next.is-portfolio").disabled = true;
    document.querySelector(".swiper-button-prev.is-portfolio").disabled = true;
    setTimeout(() => {
      if (currentSlide) {
        currentSlide.classList.remove("swiper-slide-wait");
      }
      swiperPortfolioItemList.slideTo(activeIndex, 0);
      document.querySelector(
        ".swiper-button-next.is-portfolio"
      ).disabled = false;
      document.querySelector(
        ".swiper-button-prev.is-portfolio"
      ).disabled = false;
      isAnimating = false;
    }, 550);
  });
  swiperPortfolioItemList.on("slideChange", () => {
    if (isAnimating) return;
    const activeIndex = swiperPortfolioItemList.activeIndex;
    swiperPortfolio.slideTo(activeIndex, 0);
  });
}
initializeSwipers();
window.addEventListener("resize", () => {
  const newScreenWidth = window.innerWidth;
  if (newScreenWidth !== lastScreenWidth) {
    lastScreenWidth = newScreenWidth;
    initializeSwipers();
  }
});
