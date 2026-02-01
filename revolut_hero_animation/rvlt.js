const sectionTwo = document.querySelector(".rvlt_layer-two_wrap");
const womanCard = document.querySelector(".rvlt_layer-two_bg");
const cardsWrapper = document.querySelector(".u-grid.cards_wrapper");
let animationIsPlaying = false;
let rvltTl;
let ticking = false;
let currentScroll = 0;
let lastScroll = 0;
let scrollDirectionIsForward = true;
let nextAnimationMustBeReversed = false;
let isInitialized = false;

function getScrollDirection() {
  currentScroll = window.scrollY;
  if (currentScroll > lastScroll) {
    scrollDirectionIsForward = true;
  } else if (currentScroll < lastScroll) {
    scrollDirectionIsForward = false;
  }
  lastScroll = currentScroll;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      getScrollDirection();
      getScrollThreshold();
      ticking = false;
    });
    ticking = true;
  }
});

function getScrollThreshold() {
  if (
    currentScroll > 50 &&
    scrollDirectionIsForward &&
    !nextAnimationMustBeReversed
  ) {
    initRevolutTimeline();
  } else if (
    currentScroll < 5 &&
    !scrollDirectionIsForward &&
    nextAnimationMustBeReversed
  ) {
    initRevolutTimeline();
  }
}

function initRevolutTimeline() {
  if (!womanCard || !sectionTwo || !cardsWrapper) return;
  if (animationIsPlaying) return;

  if (!isInitialized) {
    rvltTl = gsap.timeline({
      paused: true,
      onStart: () => {
        animationIsPlaying = true;
      },
      onComplete: () => {
        animationIsPlaying = false;
        nextAnimationMustBeReversed = true;
      },
      onReverseComplete: () => {
        animationIsPlaying = false;
        nextAnimationMustBeReversed = false;
      },
    });

    // Mask animation
    rvltTl.fromTo(
      sectionTwo,
      { maskSize: "45vh 70vh" },
      { maskSize: "100% 100%", duration: 0.5, ease: "power1.in" },
      0,
    );

    isInitialized = true;
  }

  // Do Flip BEFORE playing/reversing timeline
  const state = Flip.getState(womanCard, {
    props: "borderRadius, transform",
  });

  if (scrollDirectionIsForward) {
    // Make DOM changes

    womanCard.classList.add("is-card");
    cardsWrapper.appendChild(womanCard);

    // Animate the flip
    Flip.from(state, {
      duration: 1,
      ease: "power1.in",
      nested: true,
      scale: true,
    });
    rvltTl.play();
  } else {
    // Reverse changes
    womanCard.classList.remove("is-card");
    sectionTwo.appendChild(womanCard);

    // Animate the flip
    Flip.from(state, { duration: 1, ease: "power1.out" });
    rvltTl.reverse();
  }
}
