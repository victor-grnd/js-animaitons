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
  if (!womanCard || !sectionTwo || !cardsWrapper) {
    return;
  }
  if (animationIsPlaying) return;
  if (!isInitialized) {
    rvltTl = gsap.timeline({
      paused: true,
      onStart: () => {
        animationIsPlaying = true;
        /*const initialState = Flip.getState(womanCard);

        if (scrollDirectionIsForward) {
          womanCard.classList.add("is-card");
          const firstCard = cardsWrapper.firstElementChild;
          if (firstCard) {
            firstCard.after(womanCard);
          } else {
            cardsWrapper.appendChild(womanCard);
          }

          Flip.from(initialState, {
            duration: 1,
            ease: "power1.in",
          })
        }*/
      },
      onComplete: () => {
        animationIsPlaying = false;
        nextAnimationMustBeReversed = true;
      },
      onReverseComplete: () => {
        animationIsPlaying = false;
        nextAnimationMustBeReversed = false;
        /*const reverseInitialState = Flip.getState(womanCard);

        womanCard.classList.remove("is-card");
        sectionTwo.appendChild(womanCard);

        // Flip back to original position
        Flip.from(reverseInitialState, {
          duration: 1,
          ease: "power1.out",
        });*/
      },
    });

    // Mask animation
    rvltTl.fromTo(
      sectionTwo,
      {
        maskSize: "45vh 70vh",
      },
      {
        maskSize: "100% 100%",
        duration: 0.5,
        ease: "power1.in",
      },
      0,
    );

    isInitialized = true;
  }

  if (scrollDirectionIsForward) {
    rvltTl.play();
  } else {
    rvltTl.reverse();
  }
}
