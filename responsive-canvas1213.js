window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");
  let effect;

  function getImageScale() {
    if (window.innerWidth <= 768) {
      return 2;
    } else {
      return 1.6;
    }
  }

  function getGapSize() {
    if (window.innerWidth <= 768) {
      return 3;
    } else {
      return 3;
    }
  }

  const image = canvas.querySelector("img");

  function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const IMAGE_SCALE = getImageScale();

    const renderWidth = canvas.width * IMAGE_SCALE;
    const renderHeight =
      renderWidth * (image.naturalHeight / image.naturalWidth);

    const offsetX = (canvas.width - renderWidth) / 2;
    const offsetY = (canvas.height - renderHeight) / 2;

    context.drawImage(image, offsetX, offsetY, renderWidth, renderHeight);

    effect = new Effect(canvas.width, canvas.height);
    effect.init(context);
  }

  class Particle {
    constructor(effect, x, y, color) {
      this.effect = effect;
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      this.color = color;
      this.size = this.effect.gap - 1;
      this.velocityX = 0;
      this.velocityY = 0;
      this.ease = Math.random() * 0.06;
      this.friction = 0.2;
      this.distanceX = 0;
      this.distanceY = 0;
      this.distance = 0;
      this.force = 0;
      this.angle = 0;
    }

    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
      this.distanceX = this.effect.mouse.x - this.x;
      this.distanceY = this.effect.mouse.y - this.y;
      this.distance =
        this.distanceX * this.distanceX + this.distanceY * this.distanceY;

      const forceMultiplier = 2000;
      if (this.distance === 0) {
        this.force = -this.effect.mouse.radius * forceMultiplier;
      } else {
        this.force =
          (-this.effect.mouse.radius * forceMultiplier) / this.distance;
      }

      if (this.distance < this.effect.mouse.radius) {
        this.angle = Math.atan2(this.distanceY, this.distanceX);
        this.velocityX += this.force * Math.cos(this.angle);
        this.velocityY += this.force * Math.sin(this.angle);
      }

      this.velocityX *= this.friction;
      this.velocityY *= this.friction;
      this.x += this.velocityX + (this.originX - this.x) * this.ease;
      this.y += this.velocityY + (this.originY - this.y) * this.ease;
    }

    warp() {
      this.x = Math.random() * this.effect.width;
      this.y = Math.random() * this.effect.height;
      this.ease = 0.01;
    }
  }

  class Effect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.particlesArray = [];
      this.image = canvas.querySelector("img");
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;

      const IMAGE_SCALE = getImageScale();

      const renderWidth = this.width * IMAGE_SCALE;
      const renderHeight =
        renderWidth * (this.image.naturalHeight / this.image.naturalWidth);

      this.x = this.centerX - renderWidth / 2;
      this.y = this.centerY - renderHeight / 2;
      this.gap = getGapSize();
      this.mouse = {
        radius: window.innerWidth <= 768 ? 200 : 300,
        x: undefined,
        y: undefined,
      };
    }

    init(context) {
      const IMAGE_SCALE = getImageScale();

      const renderWidth = this.width * IMAGE_SCALE;
      const renderHeight =
        renderWidth * (this.image.naturalHeight / this.image.naturalWidth);

      context.drawImage(this.image, this.x, this.y, renderWidth, renderHeight);

      const pixels = context.getImageData(0, 0, this.width, this.height).data;

      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const alpha = pixels[index + 3];
          if (alpha > 0) {
            const red = pixels[index];
            const green = pixels[index + 1];
            const blue = pixels[index + 2];
            const color = `rgb(${red}, ${green}, ${blue})`;
            this.particlesArray.push(new Particle(this, x, y, color));
          }
        }
      }
    }

    draw(context) {
      this.particlesArray.forEach((particle) => particle.draw(context));
    }

    update() {
      this.particlesArray.forEach((particle) => particle.update());
    }

    warp() {
      this.particlesArray.forEach((particle) => particle.warp());
    }
  }

  // Mouse event listener
  canvas.addEventListener("mousemove", (event) => {
    if (effect) {
      effect.mouse.x = event.x;
      effect.mouse.y = event.y;
    }
  });

  // Touch event handlers
  canvas.addEventListener(
    "touchstart",
    (event) => {
      event.preventDefault(); // Prevent scrolling when touching the canvas
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    (event) => {
      event.preventDefault(); // Prevent scrolling when touching the canvas
      if (effect && event.touches[0]) {
        // Get the touch coordinates relative to the canvas
        const rect = canvas.getBoundingClientRect();
        effect.mouse.x = event.touches[0].clientX - rect.left;
        effect.mouse.y = event.touches[0].clientY - rect.top;
      }
    },
    { passive: false }
  );

  canvas.addEventListener("touchend", () => {
    if (effect) {
      // Move mouse out of view when touch ends
      effect.mouse.x = undefined;
      effect.mouse.y = undefined;
    }
  });

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (effect) {
      effect.draw(context);
      effect.update();
    }
    requestAnimationFrame(animate);
  }

  // Initialize canvas first time
  if (image.complete) {
    initCanvas();
  } else {
    image.onload = initCanvas;
  }

  // Add resize listener
  window.addEventListener("resize", function () {
    initCanvas();
  });

  // Start animation
  animate();
});
