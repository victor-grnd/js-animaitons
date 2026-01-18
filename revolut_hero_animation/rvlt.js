const sectionTwo = document.querySelector(".rvlt_layer-two_wrap");
const womanCard = document.querySelector(".rvlt_layer-two_bg");
let animationWasPlayed = false;
let frameId;

let scrollValue;

function getScroll() {
  scrollValue = window.scrollY;
  frameId = requestAnimationFrame(getScroll);
  if (scrollValue > 50) {
    console.log("50px reach");
    cancelAnimationFrame(frameId);
    if (!animationWasPlayed) startAnimation();
  }
}

function startAnimation() {
  const rvltTl = gsap.timeline({
    paused: true,
    onComplete: () => {
      animationWasPlayed = true;
      console.log("animation finished");
    },
  });

  rvltTl.to(sectionTwo, {
    clipPath: "inset(0 0 0 0)",
    duration: 1,
    ease: "sine.out",
  });
  rvltTl.to(womanCard, {
    transform: "scale(0.5)",
    duration: 1,
    ease: "sine.out",
  });

  rvltTl.play();
}

getScroll();
