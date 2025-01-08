document.addEventListener("DOMContentLoaded", () => {
  // Dialog Content
  const dialogContent = [
    {
      text: "Fun fact: Right hand writes, left hand draws ✍️🎨\u00A0 (4/6)",
      delay: 0,
    },
    {
      text: "Proud Pokémon TCG player - Gengar & Shellder forever! 👻🐚\u00A0 (5/6)",
      delay: 100,
    },
    {
      text: "Plot twist: From counseling days to pixels & code - reimagining connections! 🤝✨ Say hi! (6/6)",
      delay: 100,
    },
  ];

  // Card and Chat Elements
  const card = document.querySelector(".pokemon-card");
  const chatHistory = document.getElementById("chatHistory");
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  let rafId = null;

  // Dialog State
  let currentDialog = 0;
  let isAnimating = false;

  // Dialog Functions
  function addMessage(text) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "chat-message";
    messageDiv.textContent = text;
    // messageDiv.innerHTML = `<p>${text}</p>`;
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  function progressDialog() {
    if (isAnimating || currentDialog >= dialogContent.length) return;

    isAnimating = true;
    const dialog = dialogContent[currentDialog];

    setTimeout(() => {
      addMessage(dialog.text);

      if (currentDialog === dialogContent.length - 1) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      currentDialog++;
      isAnimating = false;
    }, dialog.delay);
  }

  // Card Animation Handlers
  const canUseHighPerformance =
    window.matchMedia("(pointer: fine)").matches &&
    !isMobile &&
    !navigator.userAgent.includes("Mobile");

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
        card.style.transform = `translate3d(0,0,0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
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

    card.addEventListener("mousemove", updateCard, { passive: true });
    card.addEventListener("mouseleave", resetCard, { passive: true });
  } else {
    // Mobile handling
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

    card.addEventListener("touchstart", handleTouchStart, { passive: true });
    card.addEventListener("touchmove", handleTouchMove, { passive: false });
    card.addEventListener("touchend", handleTouchEnd, { passive: true });
    card.addEventListener("touchcancel", handleTouchEnd, { passive: true });
  }

  // Dialog triggers
  document.addEventListener("click", progressDialog);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      progressDialog();
    }
  });

  // Connect star functionality
  const connectStar = document.querySelector(".connect-star");
  const connectPopup = document.querySelector(".connect-popup");

  // Toggle popup on star click
  connectStar.addEventListener("click", (e) => {
    e.stopPropagation();
    connectPopup.classList.toggle("active");
  });

  // Close popup when clicking outside
  document.addEventListener("click", (e) => {
    if (!connectStar.contains(e.target) && !connectPopup.contains(e.target)) {
      connectPopup.classList.remove("active");
    }
  });

  // Prevent popup from closing when clicking inside it
  connectPopup.addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // Cleanup
  return () => {
    if (rafId) cancelAnimationFrame(rafId);
  };
});
