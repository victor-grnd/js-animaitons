"use strict"; // fix lenis in safari

if (Webflow.env("editor") === undefined) {
  // if we are in Webflow don't call Lenis
  const lenis = new Lenis({
    lerp: 0,
    wheelMultiplier: 0.8, // reduce the scrolling speed at 80%
    gestureOrientation: "vertical", // only allow vertical scroll
    normalizeWheel: false, // dont normalize differences between browsers
    smoothTouch: false, // deactivate the smooth scroll on mobile
  });
  console.log(lenis);

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // This should run AFTER Lenis is initialized
  // Use `setTimeout` to ensure it runs after everything else
  /* added a tiny delay ensures the scroll command executes after the browser has processed the initial page rendering, which is exactly when Chrome/Edge need the command to be issued.*/
  setTimeout(() => {
    lenis.scrollTo(0, { immediate: true }); // forced the scroll to be at the top of the window on load
  }, 1);

  // Also use this for when returning to the page
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      // Page is loaded from cache (back/forward navigation)
      lenis.scrollTo(0, { immediate: true });
    }
  });

  $("[data-lenis-start]").on("click", function () {
    lenis.start();
  });
  $("[data-lenis-stop]").on("click", function () {
    lenis.stop();
  });
  $("[data-lenis-toggle]").on("click", function () {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }); // manage elements with lenis attributes

  function connectToScrollTrigger() {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
  }
  // Uncomment this if using GSAP ScrollTrigger
  // connectToScrollTrigger();
}

document.addEventListener("DOMContentLoaded", function () {
  // Select all videos with the "lazy" class
  const lazyVideos = Array.from(document.querySelectorAll("video.lazy"));

  // Check if IntersectionObserver is supported
  if (!("IntersectionObserver" in window)) {
    console.warn(
      "IntersectionObserver not supported. Loading all videos immediately.",
    );
    lazyVideos.forEach((video) => {
      loadVideo(video);
    });
    return;
  }

  // Create IntersectionObserver
  const lazyVideoObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          loadVideo(entry.target);
          observer.unobserve(entry.target); // set here the unobserve once the observer has done its job
        }
      });
    },
    {
      // Options
      rootMargin: "50px", // Start loading 50px before video enters viewport
      threshold: 0.01, // Trigger when at least 1% is visible
    },
  );

  lazyVideos.forEach((video) => {
    lazyVideoObserver.observe(video);
  });

  function loadVideo(videoElement) {
    const sources = Array.from(videoElement.children).filter(
      (child) => child.tagName === "SOURCE",
    );

    // Update src attribute for each source
    sources.forEach((source) => {
      if (source.dataset.src) {
        source.src = source.dataset.src;
        console.log(`Loaded source: ${source.src}`);
      }
    });

    videoElement.load();
  }
});
