const openButton = document.querySelector(".hero_script_open");
const menuWrap = document.querySelector(".hero_script_menu_wrap");
let isOpen = false;

openButton.addEventListener("click", () => {
  console.log("clicked");
  const yValue = isOpen ? "-100%" : "0%";
  isOpen = !isOpen;
  menuWrap.style.transform = `translateY(${yValue})`;
});
