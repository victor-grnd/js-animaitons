const scrollable = document.querySelector(".scrollable");
const layerOne = document.querySelector('[data-layer="1"]');
const layerTwo = document.querySelector('[data-layer="2"]');
const layerThree = document.querySelector('[data-layer="3"]');
const chromeText = document.querySelector(".chrome_header_wrap");

const chromeTimeline = gsap.timeline({
  scrollTrigger: {
    trigger: scrollable,
    start: "10% top",
    end: "bottom center",
    markers: true,
    scrub: true,
  },
});

chromeTimeline.to(layerOne, {
  scale: 2.3,
});
chromeTimeline.to(
  chromeText,
  {
    yPercent: 100,
  },
  "<",
);

chromeTimeline.set(
  [layerTwo, layerThree],
  {
    opacity: 1,
  },
  ">",
);

chromeTimeline.to(
  layerOne,
  {
    clipPath: "inset(0 0 100% 0)",
  },
  ">",
);
chromeTimeline.to(
  layerTwo,
  {
    clipPath: "inset(0 0 100% 0)",
  },
  ">",
);

//done
