const canvas = document.getElementById('shootingStarsCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions to fill the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reset stars when resizing the canvas
    resetStars();
}

// Star properties
let stars = [];
const shootingStars = [];
const starCount = 100;
const shootingStarProbability = 0.01; // Probability of shooting star appearing

// Function to generate a random number between min and max
function random(min, max) {
    return Math.random() * (max - min) + min;
}

// Reset stars when canvas is resized
function resetStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
        stars.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height),
            radius: random(0.5, 1.5),
            alpha: random(0.1, 0.3),
        });
    }
}
resizeCanvas();

// Create shooting stars
function createShootingStar() {
    const x = random(0, canvas.width);
    const y = random(0, canvas.height / 3); // Shooting stars only from top part
    shootingStars.push({
        x: x,
        y: y,
        length: random(100, 250),
        speed: random(10, 15),
        alpha: random(0.5, 1),
        angle: random(Math.PI / 7, Math.PI / 5),
        curveFactor: 1  // Factor to create the curved effect
    });
}

// Update and draw stars
function updateStars() {
    stars.forEach(star => {
        // Twinkling effect
        star.alpha += random(-0.04, 0.04);
        if (star.alpha < 0.2) {
            // Move the star to a new random position when it fades out
            star.x = random(0, canvas.width);
            star.y = random(0, canvas.height);
            star.alpha = random(0.5, 1);  // Reset alpha to make it visible again
        }
        if (star.alpha > 1) star.alpha = 1;

        // Draw the star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
    });
}

// Update and draw shooting stars with a rotating curved path
function updateShootingStars() {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const shootingStar = shootingStars[i];

        // Simulate circular/rotating motion by changing the angle gradually
        shootingStar.angle += 0.004;  // Increase or decrease this value for faster/slower rotation

        // Stop the star if it reaches 90 degrees (in radians)
        const angleInDegrees = (shootingStar.angle * 180) / Math.PI;
        if (angleInDegrees >= 90) {
            shootingStars.splice(i, 1);  // Remove the shooting star
            continue;  // Skip drawing if the star is removed
        }

        // Create the rotating curved path
        shootingStar.x += shootingStar.speed * Math.cos(shootingStar.angle);
        shootingStar.y += shootingStar.speed * Math.sin(shootingStar.angle) + 0.2 * shootingStar.curveFactor;

        // Update curve intensity over time to give a more pronounced curve
        shootingStar.curveFactor += 0.05;

        // Draw shooting star with a gradient tail (brighter at front, dimmer at back)
        const gradient = ctx.createLinearGradient(
            shootingStar.x, shootingStar.y,
            shootingStar.x - shootingStar.length * Math.cos(shootingStar.angle),
            shootingStar.y - shootingStar.length * Math.sin(shootingStar.angle)
        );

        // Brighter front (white) and dimmer back (transparent)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.alpha})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
            shootingStar.x - shootingStar.length * Math.cos(shootingStar.angle),
            shootingStar.y - shootingStar.length * Math.sin(shootingStar.angle)
        );
        ctx.stroke();

        // Fade out the shooting star over time
        shootingStar.alpha -= 0.005;

        // Remove the shooting star if it has faded out completely
        if (shootingStar.alpha <= 0) {
            shootingStars.splice(i, 1);
        }
    }
}

// Main animation loop
function animate() {
    // Clear the entire canvas for each frame with transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-over';  // Ensures background remains transparent

    // Occasionally create a shooting star
    if (Math.random() < shootingStarProbability) {
        createShootingStar();
    }

    updateStars();
    updateShootingStars();

    // Request the next frame
    requestAnimationFrame(animate);
}


animate();

// Update canvas size on window resize
window.addEventListener('resize', resizeCanvas);
