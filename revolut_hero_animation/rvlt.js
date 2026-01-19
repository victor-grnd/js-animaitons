const sectionTwo = document.querySelector(".rvlt_layer-two_wrap");
const womanCard = document.querySelector(".rvlt_layer-two_bg");
const whiteLayer = document.querySelector(".rvlt_layer-two_white");

let animationIsPlaying = false;
let rvltTl;
let ticking = false;
let currentScroll;
let lastScroll;
let scrollDirectionIsForward = true;
let nextAnimationMustBeReversed = false;

function getScrollDirection() {
  if (!lastScroll) lastScroll = 0;
  currentScroll = window.scrollY;
  if (currentScroll > lastScroll) {
    scrollDirectionIsForward = true;
  } else {
    scrollDirectionIsForward = false;
  }
  lastScroll = currentScroll;
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      getScrollDirection();
      getScrollThereshold();
      ticking = false;
    });
    ticking = true;
  }
});

function getScrollThereshold() {
  if (
    currentScroll > 50 &&
    scrollDirectionIsForward &&
    !nextAnimationMustBeReversed
  ) {
    startAnimation();
  } else if (
    currentScroll < 5 &&
    !scrollDirectionIsForward &&
    nextAnimationMustBeReversed
  ) {
    startAnimation();
  }
}

function initRevolutTimeline() {
  if (!whiteLayer || !womanCard || !sectionTwo) {
    return;
  }
  rvltTl = gsap.timeline({
    paused: true,
    onStart: () => {
      animationIsPlaying = true;
      whiteLayer.style.display = "none";
    },
    onComplete: () => {
      animationIsPlaying = false;
      nextAnimationMustBeReversed = true;
    },
    onReverseComplete: () => {
      animationIsPlaying = false;
      nextAnimationMustBeReversed = false;
      whiteLayer.style.display = "block";
    },
  });
  rvltTl.fromTo(
    sectionTwo,
    {
      clipPath: "inset(20vh 34vw 15vh 34vw round 2rem)",
    },
    {
      clipPath: "inset(0% 0% 0% 0%);",
      duration: 0.5,
    },
    0,
  );

  rvltTl.fromTo(
    womanCard,
    {
      scale: 1,
    },
    {
      scale: 0.5,
      duration: 0.7,
      ease: "sine.out",
    },
    0,
  );
}

function startAnimation() {
  if (animationIsPlaying) return;

  if (scrollDirectionIsForward) rvltTl.play();
  else rvltTl.reverse();
}
initRevolutTimeline();
