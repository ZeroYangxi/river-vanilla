document.addEventListener("DOMContentLoaded", () => {
  const card = document.querySelector(".pokemon-card");
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  let rafId = null;

  // Performance detection
  const canUseHighPerformance =
    window.matchMedia("(pointer: fine)").matches &&
    !isMobile &&
    !navigator.userAgent.includes("Mobile");

  // Desktop handling
  if (canUseHighPerformance) {
    let lastUpdate = 0;
    const THROTTLE_MS = 16;

    const updateCard = (e) => {
      const now = performance.now();
      if (now - lastUpdate < THROTTLE_MS) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * 12;
      const rotateY = ((x - centerX) / centerX) * 12;
      const moveX = (x / rect.width) * 100;
      const moveY = (y / rect.height) * 100;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const transform = `translate3d(0,0,0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        card.style.transform = transform;
        card.style.setProperty("--moveX", moveX);
        card.style.setProperty("--moveY", moveY);
      });

      lastUpdate = now;
    };

    const resetCard = () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.transform = "translate3d(0,0,0) rotateX(0) rotateY(0)";
      card.style.setProperty("--moveX", "50");
      card.style.setProperty("--moveY", "50");
    };

    // Event listeners
    card.addEventListener("mousemove", updateCard, { passive: true });
    card.addEventListener("mouseleave", resetCard, { passive: true });
    card.addEventListener("touchend", resetCard, { passive: true });
  } else {
    // Mobile/tablet handling
    let initialX, initialY;
    const TOUCH_SENSITIVITY = 0.15;

    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      initialX = touch.clientX;
      initialY = touch.clientY;
      card.style.transition = "none";
    };

    const handleTouchMove = (e) => {
      if (!initialX || !initialY) return;
      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = (touch.clientX - initialX) * TOUCH_SENSITIVITY;
      const deltaY = (touch.clientY - initialY) * TOUCH_SENSITIVITY;

      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const rotateX = Math.max(-10, Math.min(10, deltaY));
        const rotateY = Math.max(-10, Math.min(10, -deltaX));
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      });
    };

    const handleTouchEnd = () => {
      initialX = initialY = null;
      card.style.transition = "transform 0.3s ease-out";
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    };

    // Touch event listeners
    card.addEventListener("touchstart", handleTouchStart, { passive: true });
    card.addEventListener("touchmove", handleTouchMove, { passive: false });
    card.addEventListener("touchend", handleTouchEnd, { passive: true });
    card.addEventListener("touchcancel", handleTouchEnd, { passive: true });
  }

  // Cleanup function
  return () => {
    if (rafId) cancelAnimationFrame(rafId);
    card.removeEventListener("mousemove", updateCard);
    card.removeEventListener("mouseleave", resetCard);
    card.removeEventListener("touchstart", handleTouchStart);
    card.removeEventListener("touchmove", handleTouchMove);
    card.removeEventListener("touchend", handleTouchEnd);
    card.removeEventListener("touchcancel", handleTouchEnd);
  };
});
