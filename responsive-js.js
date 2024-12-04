window.addEventListener('load', function() {
    const canvas = document.getElementById('canvas1');
    const context = canvas.getContext('2d');
    let effect;
    let lastFrameTime = performance.now();

    class Particle {
        constructor(effect, x, y, color) {
            this.effect = effect;
            this.x = Math.random() * this.effect.width;
            this.y = Math.random() * this.effect.height;
            this.originX = Math.floor(x);
            this.originY = Math.floor(y);
            this.color = color;
            this.size = this.effect.gap - 1;
            this.vx = 0;
            this.vy = 0;
            this.ease = Math.random() * 0.05;
            this.friction = 0.95;
            this.dx = 0;
            this.dy = 0;
            this.distance = 0;
            this.force = 0;
            this.angle = 0;
        }

        draw(context) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.size, this.size);
        }

        update() {
            this.dx = this.effect.mouse.x - this.x;
            this.dy = this.effect.mouse.y - this.y;
            this.distance = this.dx * this.dx + this.dy * this.dy;
            this.force = this.distance === 0 ? 
                -this.effect.forceMultiplier : 
                -this.effect.forceMultiplier / this.distance;

            if (this.distance < this.effect.mouse.radius) {
                this.angle = Math.atan2(this.dy, this.dx);
                this.vx += this.force * Math.cos(this.angle);
                this.vy += this.force * Math.sin(this.angle);
            }

            this.vx *= this.friction;
            this.vy *= this.friction;
            this.x += this.vx + (this.originX - this.x) * this.ease;
            this.y += this.vy + (this.originY - this.y) * this.ease;
        }
    }

    class Effect {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.particlesArray = [];
            this.image = document.getElementById('image1');
            
            // Calculate scale once during construction
            const scale = Math.min(
                this.width / this.image.width,
                this.height / this.image.height
            ) * 0.8;

            // Pre-calculate dimensions
            this.scaledWidth = this.image.width * scale;
            this.scaledHeight = this.image.height * scale;
            this.x = (this.width - this.scaledWidth) / 2;
            this.y = (this.height - this.scaledHeight) / 2;

            // Adjust parameters based on screen size
            this.gap = width < 768 ? 4 : 3;
            this.forceMultiplier = width < 768 ? 1500 : 2000;
            this.mouse = {
                radius: width < 768 ? 150 : 300,
                x: undefined,
                y: undefined
            };
        }

        init(context) {
            context.clearRect(0, 0, this.width, this.height);
            
            context.drawImage(
                this.image, 
                this.x, 
                this.y, 
                this.scaledWidth, 
                this.scaledHeight
            );

            const imageData = context.getImageData(0, 0, this.width, this.height);
            const pixels = imageData.data;
            
            this.particlesArray = [];

            for (let y = this.y; y < this.y + this.scaledHeight; y += this.gap) {
                for (let x = this.x; x < this.x + this.scaledWidth; x += this.gap) {
                    const index = (y * this.width + x) * 4;
                    const alpha = pixels[index + 3];
                    if (alpha > 0) {
                        const color = `rgb(${pixels[index]}, ${pixels[index + 1]}, ${pixels[index + 2]})`;
                        this.particlesArray.push(new Particle(this, x, y, color));
                    }
                }
            }
        }

        draw(context) {
            this.particlesArray.forEach(particle => particle.draw(context));
        }

        update() {
            this.particlesArray.forEach(particle => particle.update());
        }
    }

    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        effect = new Effect(canvas.width, canvas.height);
        effect.init(context);
    }

    function animate() {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastFrameTime;
        
        // Adjust particle density based on performance
        if (deltaTime > 32) { // Less than 30 FPS
            effect.gap = Math.min(effect.gap + 1, 8);
        } else if (deltaTime < 16 && effect.gap > 3) { // More than 60 FPS
            effect.gap = Math.max(effect.gap - 1, 3);
        }
        
        context.clearRect(0, 0, canvas.width, canvas.height);
        effect.draw(context);
        effect.update();
        lastFrameTime = currentTime;
        requestAnimationFrame(animate);
    }

    // Mouse interactions
    canvas.addEventListener('mousemove', function(event) {
        effect.mouse.x = event.x;
        effect.mouse.y = event.y;
    });

    // Touch interactions
    canvas.addEventListener('touchmove', function(event) {
        event.preventDefault();
        effect.mouse.x = event.touches[0].clientX;
        effect.mouse.y = event.touches[0].clientY;
    });

    canvas.addEventListener('touchstart', function(event) {
        event.preventDefault();
        effect.mouse.x = event.touches[0].clientX;
        effect.mouse.y = event.touches[0].clientY;
    });

    canvas.addEventListener('touchend', function() {
        effect.mouse.x = undefined;
        effect.mouse.y = undefined;
    });

    // Initialize and handle resize
    window.addEventListener('resize', function() {
        initCanvas();
    });

    initCanvas();
    animate();
});
