document.addEventListener("DOMContentLoaded", function () {
  gsap.registerPlugin(Flip, ScrollTrigger, SplitText);

  const items = [...document.querySelectorAll(".case-study_item")];
  if (!items.length) return;
  const parent = items[0].parentNode;
  const oddWrap = document.createElement("div");
  oddWrap.className = "case-study_group is-odd";
  const evenWrap = document.createElement("div");
  evenWrap.className = "case-study_group is-even";
  parent.insertBefore(oddWrap, items[0]);
  parent.insertBefore(evenWrap, items[0]);
  items.forEach((item, i) => {
    (i % 2 === 0 ? oddWrap : evenWrap).appendChild(item);
  });

  // Scroll Marquee
  function ScrollMarquee() {
    let tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      },
    });
    tl2.fromTo(
      ".case-study_group",
      { "--progress": 0 },
      { "--progress": 1, ease: "none" },
    );
  }

  // Page Load
  let tl3 = gsap.timeline({
    onComplete: () => {
      lenis.start();
      document.querySelector("body").classList.remove("intro");
      ScrollMarquee();
    },
  });
  tl3.fromTo(".cms-wrapper", { opacity: 0 }, { opacity: 1, delay: 0.3 });
  tl3.fromTo(
    ".case-study_group",
    { "--progress": 0.2 },
    { "--progress": 0, ease: "power3.inOut", duration: 1.2 },
    "<",
  );

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  window.addEventListener("load", () => {
    lenis.scrollTo(0, { immediate: true });
  });
  setTimeout(() => {
    lenis.stop();
  }, 100);

  const promptInput = document.querySelector(".prompt_input");
  const promptResult = document.querySelector(".prompt_result");
  const promptLink = document.querySelector(".prompt_link");
  const caseStudyItems = document.querySelectorAll(".case-study_item");
  const modalTarget = document.querySelector(".modal_project");

  let item;

  function flipInto(element) {
    const state = Flip.getState(item);
    element.appendChild(item);
    Flip.from(state, { duration: 0.6, ease: "power2.inOut", zIndex: 100 });
  }

  function showModal() {
    gsap.set(".modal_wrap", { display: "block" });
    document.querySelector(".prompt_scroll").scrollTop = 0;

    setTimeout(() => {
      item = document.querySelector(".is-active .case-study_card");
      flipInto(modalTarget);
    }, 1000);

    const split = SplitText.create(
      document.querySelectorAll(".prompt_result > *"),
      {
        type: "words, chars",
        charsClass: "char",
      },
    );

    let tl = gsap.timeline();
    tl.fromTo(
      ".modal_content_wrap",
      { delay: 0.4, "--progress": 1 },
      { "--progress": 0, ease: "power1.inOut", duration: 0.6 },
    );
    tl.fromTo(
      ".panel",
      { width: "0rem" },
      { width: "40rem", ease: "power1.inOut", duration: 0.6 },
      "<",
    );
    tl.fromTo(
      ".modal_backdrop",
      { opacity: 0 },
      { delay: 0.8, opacity: 1, duration: 0.2 },
    );
    tl.from(".char", {
      opacity: 0,
      stagger: { each: 0.005, ease: "power1.out" },
      duration: 0.005,
    });
  }
  function hideModal() {
    flipInto(document.querySelector(".case-study_item.is-active"));
    let tl = gsap.timeline();
    tl.fromTo(".modal_backdrop", { opacity: 1 }, { opacity: 0, duration: 0.2 });
    tl.fromTo(
      ".modal_content_wrap",
      { "--progress": 0 },
      { delay: 0.6, "--progress": 1, ease: "power1.inOut", duration: 0.6 },
    );
    tl.to(
      ".panel",
      { width: "0rem", ease: "power1.inOut", duration: 0.6 },
      "<",
    );
    tl.set(".modal_wrap", { display: "none" });
    tl.to(".prompt_wrap", { yPercent: 0, scale: 1, ease: "power2.in" });
    promptInput.value = "";
  }

  const WORKER_URL = "https://case-study.timothyricksdesign.workers.dev/";

  // Gather case study data
  function getCaseStudyData() {
    const caseStudies = [];

    caseStudyItems.forEach((item) => {
      const title =
        item.querySelector(".case-study_title")?.textContent?.trim() || "";
      const content =
        item.querySelector(".case-study_content")?.textContent?.trim() || "";
      const link =
        item.querySelector(".case-study_link")?.getAttribute("href") || "";

      caseStudies.push({
        title,
        content,
        link,
      });
    });

    return caseStudies;
  }

  // Send prompt to worker and handle response
  async function handlePrompt(userPrompt) {
    const caseStudies = getCaseStudyData();

    // Show loading state
    document.querySelector("body").classList.add("loading");

    gsap.to(".prompt_wrap", {
      yPercent: 100,
      scale: 0.6,
      duration: 0.3,
      ease: "power3.out",
    });

    try {
      const response = await fetch(WORKER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: userPrompt,
          caseStudies: caseStudies,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from worker");
      }

      const data = await response.json();

      // Render the AI response
      promptResult.innerHTML = data.explanation;

      // Update case study visibility
      const matchedTitle = data.matchedCaseStudy?.toLowerCase();

      caseStudyItems.forEach((item) => {
        const itemTitle = item
          .querySelector(".case-study_title")
          ?.textContent?.trim()
          ?.toLowerCase();

        if (itemTitle === matchedTitle) {
          item.classList.add("is-active");
        } else {
          item.classList.remove("is-active");
        }
      });

      document.querySelector("body").classList.remove("loading");
      showModal();

      // Update and show the link
      if (data.matchedLink) {
        promptLink.href = data.matchedLink;
        promptLink.style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error);
      promptResult.innerHTML =
        "<p>Sorry, something went wrong. Please try again.</p>";
    }
  }

  // Listen for Enter key on input
  promptInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const userPrompt = promptInput.value.trim();
      if (userPrompt) handlePrompt(userPrompt);
    }
  });

  document
    .querySelector(".prompt_circle")
    .addEventListener("click", function () {
      const userPrompt = promptInput.value.trim();
      if (userPrompt) handlePrompt(userPrompt);
    });

  document
    .querySelectorAll(".modal_close_wrap, .modal_backdrop")
    .forEach(function (el) {
      el.addEventListener("click", function () {
        hideModal();
      });
    });
});
