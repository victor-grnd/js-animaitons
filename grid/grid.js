const ROWS = 25;
const COLS = 25;
const gridContainer = document.querySelector(".grid_layout");

function createGrid(rows, cols) {
  const totalItems = rows * cols;

  for (let i = 0; i < totalItems; i++) {
    const hue = Math.random() * 360;
    const gridItem = document.createElement("div");

    gridItem.classList.add("grid_item");
    gridItem.style.background = `hsl(${hue}, 70%, 60%)`;

    gridContainer.appendChild(gridItem);
  }
}

createGrid(ROWS, COLS);

gsap.to(".grid_item", {
  opacity: 0,
  scale: 0.2,
  duration: 1,
  transformOrigin: "center bottom",
  stagger: function (index, target, list) {
    const cols = COLS;
    const row = Math.floor(index / cols);
    const col = index % cols;

    const centerRow = Math.round(ROWS / 2);
    const centerCol = Math.round(COLS / 2);

    const distance = Math.sqrt(
      Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2) // formule norme dez vecteurs avec seulement les coordonées des 2 points composant le vecteur
    );

    const angle = Math.atan2(row - centerRow, col - centerCol);

    return distance * 0.1 + (angle + Math.PI) * 0.5; // composante distance -> plus c'est loin du centre + ya de délai + composante angle si tout à droite = -pi donc -pi + pi = 0 donc pas de délai et pi + pi = 2pi donc délai max
  },
  ease: "sine.out",
  onComplete: () => {
    gridContainer.style.display = "none";
  },
});
