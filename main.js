const button = document.querySelector(".button_main_wrap.is-bubble");

if (button) {
  let buttonCurrentlyAnimating = false;

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function animateBubble(button, e) {
    buttonCurrentlyAnimating = true;
    const bubble = button.querySelector(".button_main_circle");
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    bubble.style.left = `${x}px`;
    bubble.style.top = `${y}px`;

    bubble.classList.add("animate");
    await sleep(500);
    buttonCurrentlyAnimating = false;
  }

  async function unanimateBubble(button) {
    while (buttonCurrentlyAnimating) {
      await sleep(50);
    }
    const bubble = button.querySelector(".button_main_circle");
    bubble.classList.remove("animate");
  }

  button.addEventListener("mouseenter", (e) => {
    animateBubble(e.currentTarget, e);
  });

  button.addEventListener("mouseleave", (e) => {
    unanimateBubble(e.currentTarget);
  });
}
