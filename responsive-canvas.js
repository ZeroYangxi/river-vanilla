window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const context = canvas.getContext("2d");
  let effect;

  function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reinitialize effect with new dimensions
    effect = new Effect(canvas.width, canvas.height);
    effect.init(context);
  }

  // individual particles
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
      this.image = document.getElementById("image1");
      this.centerX = this.width / 2;
      this.centerY = this.height / 2;
      this.x = this.centerX - this.image.width / 2;
      this.y = this.centerY - this.image.height / 2;
      this.gap = 3;
      this.mouse = {
        radius: 300,
        x: undefined,
        y: undefined,
      };
    }

    init(context) {
      context.drawImage(this.image, this.x, this.y);
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

  // Mouse move event listener
  canvas.addEventListener("mousemove", (event) => {
    effect.mouse.x = event.x;
    effect.mouse.y = event.y;
  });

  function animate() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    effect.draw(context);
    effect.update();
    requestAnimationFrame(animate);
  }

  // Initialize canvas first time
  initCanvas();

  // Add resize listener
  window.addEventListener("resize", function () {
    initCanvas();
  });

  // Start animation
  animate();
});
