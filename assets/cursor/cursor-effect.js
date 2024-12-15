// Initialize custom cursor
function initCustomCursor() {
  // Only initialize on non-touch devices
  if ("ontouchstart" in window) return;

  const cursor = document.querySelector(".custom-cursor");
  if (!cursor) return;

  // Initialize cursor position
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  // Smoothing factor (0 = no smoothing, 1 = maximum smoothing)
  const smoothing = 0.15;

  // Update cursor position with smoothing
  function updateCursorPosition() {
    // Calculate the distance to move
    const distX = mouseX - cursorX;
    const distY = mouseY - cursorY;

    // Update cursor position with smoothing
    cursorX += distX * smoothing;
    cursorY += distY * smoothing;

    // Apply the transform
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

    // Request next frame
    requestAnimationFrame(updateCursorPosition);
  }

  // Track mouse movement
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Show cursor if it's hidden
    if (cursor.style.opacity === "0") {
      cursor.style.opacity = "1";
    }
  });

  // Hide cursor when mouse leaves window
  document.addEventListener("mouseleave", () => {
    cursor.style.opacity = "0";
  });

  // Show cursor when mouse enters window
  document.addEventListener("mouseenter", () => {
    cursor.style.opacity = "1";
  });

  // Start the animation loop
  updateCursorPosition();
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initCustomCursor);
