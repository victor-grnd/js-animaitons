function initButtonAnimation() {
  function lerp(start, end, progress) {
    return start + (end - start) * progress;
  }
  const animationStates = new Map();
  const buttons = document.querySelectorAll(".button_border_border");
  if (!buttons.length) return;

  function animateRotation(element, duration, start) {
    const now = Date.now();
    let progress = (now - start) / duration;
    let rotation;

    if (progress < 0.3282275711) {
      rotation = lerp(0, 0, progress / 0.3282275711); // mettre le progress par rapport aux 33% premiers pourcents
    } else if (progress < 0.5) {
      rotation = lerp(0, 180, (progress - 0.3282275711) / 0.1717724289); // normaliser progress pour avoir 0-1 entre 33% et 50% 0.17 = diff entre ,5 et ,33
    } else if (progress < 0.8282275711) {
      rotation = 180; // il reste a 80 de 0.5 à 0.82
    } else if (progress <= 1) {
      rotation = lerp(180, 360, (progress - 0.8282275711) / 0.1717724289); // normaliser sur la diff entre 1 et 0.82
    } else {
      rotation = 360;
      start = now; // by setting startTime to now progress is reset to 0
    }

    element.style.setProperty("--r2", `${rotation}deg`);

    const animationRotationFrameId = requestAnimationFrame(() => {
      animateRotation(element, duration, start);
    });

    animationStates.set(element, {
      ...animationStates.get(element),
      r2: animationRotationFrameId,
    });
  }

  function animatePosition(element, duration, start) {
    const now = Date.now();
    let position;
    let progress = (now - start) / duration;

    // Animation par segments avec des paliers
    if (progress < 0.3282275711) {
      position = lerp(10, 90, progress / 0.3282275711);
    } else if (progress < 0.5) {
      position = 90;
    } else if (progress < 0.8282275711) {
      position = lerp(90, 10, (progress - 0.5) / 0.3282275711);
    } else if (progress <= 1) {
      position = 10;
    } else {
      position = 10;
      start = now; // Recommencer l'animation
    }

    element.style.setProperty("--x", `${position}%`);

    const animationPositionFrameId = requestAnimationFrame(() => {
      animatePosition(element, duration, start);
    });

    animationStates.set(element, {
      ...animationStates.get(element),
      x: animationPositionFrameId,
    });
  }

  buttons.forEach((button) => {
    const existingState = animationStates.get(button);

    if (existingState) {
      cancelAnimationFrame(existingState.r2); // r2 correspond to the map id and not to thes css property
      cancelAnimationFrame(existingState.x); // the same for x
    }

    animateRotation(button, 6000, Date.now());
    animatePosition(button, 6000, Date.now());
  });
}

initButtonAnimation();
