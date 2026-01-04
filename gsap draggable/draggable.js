const itemOne = document.querySelector(".hero-drag_item.is-1");
const itemTwo = document.querySelector(".hero-drag_item.is-2");
const itemThree = document.querySelector(".hero-drag_item.is-3");

const sectionBounds = document.querySelector(".hero-drag_wrap");

function generateRandomPoints(number) {
  const rect = sectionBounds.getBoundingClientRect();
  const dots = [];

  for (let i = 0; i < number; i++) {
    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;

    // Create coordinate object for GSAP
    dots.push({ x, y });

    // Create visual dot element (optional, for daebugging)
    const dotElement = document.createElement("div");
    dotElement.classList.add("dot");
    dotElement.style.position = "absolute";
    dotElement.style.left = x + "px";
    dotElement.style.top = y + "px";
    sectionBounds.appendChild(dotElement);
  }

  return dots;
}

const randomPointsFive = generateRandomPoints(5);

Draggable.create(itemOne, {
  type: "x,y",
  bounds: sectionBounds,
  inertia: true,
  snap: {
    points: randomPointsFive,
    radius: 5,
  },
});

Draggable.create(itemTwo, {
  type: "x",
  bounds: sectionBounds,
  inertia: true,
});

Draggable.create(itemThree, {
  type: "rotation",
  bounds: sectionBounds,
  inertia: true,
  snap: function (value) {
    return Math.round(value / 90) * 90;
  },
});
