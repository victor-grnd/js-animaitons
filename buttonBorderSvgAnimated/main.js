const svgButtons = document.querySelectorAll(".button_main_wrap.is-sixth");

svgButtons.forEach((button) => {
  const svgPath = button.querySelector(".sixth_button_path");

  const pathLength = svgPath.getTotalLength();
  svgPath.style.setProperty("stroke-dasharray", pathLength);
  svgPath.style.setProperty("stroke-dashoffset", pathLength);

  const pathTimeline = gsap.timeline({ paused: true });

  pathTimeline.fromTo(
    svgPath,
    {
      strokeDashoffset: pathLength,
    },
    {
      strokeDashoffset: 0,
      duration: 0.5,
      ease: "power1.out",
    }
  );

  button.addEventListener("mouseenter", () => {
    pathTimeline.play();
  });

  button.addEventListener("mouseleave", () => {
    pathTimeline.reverse();
  });
});
