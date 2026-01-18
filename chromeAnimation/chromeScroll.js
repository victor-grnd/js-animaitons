const header = document.querySelector('[animation2 = "header"]');
const scrollableAnim3 = document.querySelector(".scrollable_div_350_vh");
const wrapper1Anim3 = document.querySelector('[animation2 = "wrapper1"]');
const image1Anim3 = document.querySelector('[animation2 = "image1"]');
const wrapper2Anim3 = document.querySelector('[animation2 = "wrapper22"]');
const image2Anim3 = document.querySelector('[animation2 = "image2"]');
const wrapper3Anim3 = document.querySelector('[animation2 = "wrapper3"]');
const image3Anim3 = document.querySelector('[animation2 = "image3"]');

const timelineAnimationThree = gsap.timeline({
  scrollTrigger: {
    trigger: scrollableAnim3,
    scrub: true,
    start: "20% 60%",
    end: "60% 30%",
    markers: true,
  },
});

// Zoom du wrapper1
timelineAnimationThree.to(wrapper1Anim3, {
  scale: 2.3,
});

// Apparition du wrapper2
timelineAnimationThree.to(wrapper2Anim3, {
  opacity: 1,
});

// Disparition du wrapper1 avec clip-path
timelineAnimationThree.to(wrapper1Anim3, {
  clipPath: "inset(0% 0% 100% 0%)",
});

timelineAnimationThree.to(wrapper3Anim3, {
  opacity: 1,
});

timelineAnimationThree.to(wrapper2Anim3, {
  clipPath: "inset(0% 0% 100% 0%)",
});
