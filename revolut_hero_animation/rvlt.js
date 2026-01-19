const sectionTwo = document.querySelector(".rvlt_layer-two_wrap");
const womanCard = document.querySelector(".rvlt_layer-two_bg");
let animationIsPlaying = false;
let rvltTl;
let ticking = false;
let currentScroll;
let lastScroll;
let scrollDirectionIsForward = true;
let nextAnimationMustBeReversed = false;

function getScrollDirection() {
  if (!lastScroll) lastScroll = 0;
  console.log(lastScroll);
  currentScroll = window.scrollY;
  console.log(currentScroll);
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

  rvltTl.fromTo(
    sectionTwo,
    {
      clipPath: "inset(20vh 34vw 15vh 34vw round 2rem)",
    },
    {
      clipPath: "inset(0 0 0 0)",
      duration: 1,
      ease: "sine.out",
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
      duration: 1,
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
