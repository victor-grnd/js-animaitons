const openButton = document.querySelector(".hero_script_open");
const menuWrap = document.querySelector(".hero_script_menu_wrap");
let isOpening = false;

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

openButton.addEventListener("click", () => {
  if (isOpening) return;
  isOpening = true;
  menuWrap.classList.toggle("is-open");
  sleep(300);
  isOpening = false;
});
