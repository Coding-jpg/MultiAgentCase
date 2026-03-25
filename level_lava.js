/**
 * Level B: Lava Fortress (Lava Level)
 * Developed as part of the Mario Multiverse Demo.
 * 
 * Features:
 * - Heavy Physics: Increased gravity and lower acceleration for a "lava" feel.
 * - Predictive Fire-spitting AI: Enemies target player's future position.
 * - Random Lava Eruptions: Periodic environment hazards.
 * - Flagpole: Triggers transition to 'sky' level.
 */

(function() {
    const LAVA_COLOR = '#ff4500';
    const SLUG_COLOR = '#8b0000';
    const FIREBALL_COLOR = '#ff8c00';
    const FLAGPOLE_X = 750;

    class Projectile {
        constructor(x, y, vx, vy) {
            this.x = x; this.y = y;
            this.vx = vx; this.vy = vy;
            this.radius = 5;
            this.active = true;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) this.active = false;
        }
        draw(ctx) {
            ctx.fillStyle = FIREBALL_COLOR;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            // Core glow
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    class FireSlug {
        constructor(x, y) {
            this.x = x; this.y = y;
            this.width = 40; this.height = 20;
            this.shootCooldown = 120; // 2 seconds at 60fps
            this.timer = Math.random() * 60;
            this.bulletSpeed = 4;
        }
        update(player, projectils) {
            this.timer++;
            if (this.timer >= this.shootCooldown) {
                this.shoot(player, projectils);
                this.timer = 0;
            }
        }
        shoot(player, projectils) {
            // Predictive Aiming Logic
            const dx = (player.x + player.width/2) - (this.x + this.width/2);
            const dy = (player.y + player.height/2) - (this.y + this.height/2);
            const distance = Math.sqrt(dx*dx + dy*dy);
            
            // Time to reach player's current position
            const time = distance / this.bulletSpeed;
            
            // Target future position
            const targetX = player.x + player.vx * time;
            const targetY = player.y + player.vy * time;
            
            const aimDX = targetX - this.x;
            const aimDY = targetY - this.y;
            const angle = Math.atan2(aimDY, aimDX);
            
            projectils.push(new Projectile(
                this.x + this.width/2, 
                this.y, 
                Math.cos(angle) * this.bulletSpeed, 
                Math.sin(angle) * this.bulletSpeed
            ));
        }
        draw(ctx) {
            ctx.fillStyle = SLUG_COLOR;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            // Eye
            ctx.fillStyle = "yellow";
            ctx.fillRect(this.x + this.width - 10, this.y + 5, 5, 5);
        }
    }

    const projectiles = [];
    const slugs = [
        new FireSlug(300, 480),
        new FireSlug(550, 380),
        new FireSlug(100, 180)
    ];
    let eruptionTimer = 0;
    const eruptions = [];
    const smokeParticles = [];
    
    // --- WIN ANIMATION STATE ---
    let isClearing = false;
    let flagY = 60;
    let winTimer = 0;

    const lavaConfig = {
        name: 'lava',
        title: 'Lava Fortress',
        description: 'Predictive fireballs and heavy movement. Reach the flag!',
        backgroundColor: '#2e0a0a',
        platformColor: '#4b3621',
        physics: {
            gravity: 0.7,      // Heavier gravity
            speed: 0.35,       // Slower acceleration
            jumpForce: 13,     // Higher jump needed for heavy gravity
            frictionX: 0.85,
            frictionY: 1
        },
        platforms: [
            {x: 50, y: 500, w: 200, h: 40},  // Starting Ground
            {x: 300, y: 500, w: 200, h: 40}, // Gap jump
            {x: 550, y: 500, w: 200, h: 40}, // End Ground
            {x: 250, y: 400, w: 100, h: 20}, // Mid 1
            {x: 450, y: 320, w: 100, h: 20}, // Mid 2
            {x: 150, y: 250, w: 100, h: 20}, // High 1
            {x: 400, y: 180, w: 100, h: 20}, // High 2
            {x: 650, y: 150, w: 150, h: 20}  // Goal Plat
        ],

        onInit: function(player) {
            player.color = '#ff9900'; // Lava-themed mario
            player.x = 80;
            player.y = 450;
            isClearing = false;
            flagY = 60;
            winTimer = 0;
            smokeParticles.length = 0;
        },

        onUpdate: function(player, keys) {
            if (isClearing) {
                player.vx = 0; player.vy = 0; player.x = FLAGPOLE_X - 10;
                if (player.y < 120) {
                    player.y += 2;
                    if (flagY < 120) flagY += 2;
                } else {
                    winTimer++;
                    if (winTimer === 60 && window.showTransition) window.showTransition('sky');
                }
                return;
            }

            // Lava Death Logic
            if (player.y > 560) {
                player.x = 80; player.y = 450; player.vx = 0; player.vy = 0;
                projectiles.length = 0;
            }

            // Update Slugs
            slugs.forEach(s => s.update(player, projectiles));
            
            // Update Smoke
            if (Math.random() > 0.8) {
                smokeParticles.push({ x: Math.random() * 800, y: 600, size: 5 + Math.random() * 10, vy: -1 - Math.random() * 2, life: 1 });
            }
            for (let i = smokeParticles.length - 1; i >= 0; i--) {
                const s = smokeParticles[i];
                s.y += s.vy; s.life -= 0.005;
                if (s.life <= 0) smokeParticles.splice(i, 1);
            }

            // Update Projectiles
            for (let i = projectiles.length - 1; i >= 0; i--) {
                projectiles[i].update();
                const p = projectiles[i];
                if (p.x > player.x && p.x < player.x + player.width && p.y > player.y && p.y < player.y + player.height) {
                    player.x = 80; player.y = 450; projectiles.length = 0;
                }
                if (!projectiles[i].active) projectiles.splice(i, 1);
            }

            // Lava Eruptions
            eruptionTimer++;
            if (eruptionTimer > 180) {
                if (Math.random() > 0.5) {
                    eruptions.push({ x: player.x + (Math.random() * 200 - 100), y: 600, vy: -8 - Math.random() * 5, active: true });
                }
                eruptionTimer = 0;
            }
            for (let i = eruptions.length - 1; i >= 0; i--) {
                const e = eruptions[i]; e.y += e.vy; e.vy += 0.3;
                if (e.x > player.x && e.x < player.x + player.width && e.y > player.y && e.y < player.y + player.height) {
                    player.x = 80; player.y = 450;
                }
                if (e.y > 600) eruptions.splice(i, 1);
            }
        },

        renderBackground: function(ctx) {
            // Draw Smoke
            ctx.fillStyle = "rgba(100, 100, 100, 0.3)";
            smokeParticles.forEach(s => {
                ctx.globalAlpha = s.life;
                ctx.fillRect(s.x, s.y, s.size, s.size);
            });
            ctx.globalAlpha = 1.0;

            // Lava flow
            const time = Date.now() / 1000;
            ctx.fillStyle = LAVA_COLOR;
            ctx.beginPath();
            ctx.moveTo(0, 580);
            for (let x = 0; x <= 800; x += 20) {
                const y = 580 + Math.sin(x * 0.02 + time * 3) * 10;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(800, 600); ctx.lineTo(0, 600); ctx.fill();

            // Background heat distortion
            ctx.fillStyle = "rgba(255, 69, 0, 0.05)";
            for(let i=0; i<5; i++) ctx.fillRect(0, 400 + Math.sin(time + i) * 50, 800, 10);
        },

        renderForeground: function(ctx, player) {
            slugs.forEach(s => s.draw(ctx));
            projectiles.forEach(p => p.draw(ctx));
            ctx.fillStyle = "#ffcc00";
            eruptions.forEach(e => {
                ctx.beginPath(); ctx.arc(e.x, e.y, 8, 0, Math.PI * 2); ctx.fill();
            });

            // Flagpole
            ctx.fillStyle = "#fff"; ctx.fillRect(FLAGPOLE_X, 50, 10, 100);
            ctx.fillStyle = "red"; ctx.beginPath();
            ctx.moveTo(FLAGPOLE_X + 10, flagY); ctx.lineTo(FLAGPOLE_X + 40, flagY + 15); ctx.lineTo(FLAGPOLE_X + 10, flagY + 30);
            ctx.fill();
        },

        checkWin: function(player) {
            if (!isClearing && player.x > FLAGPOLE_X - 20 && player.x < FLAGPOLE_X + 10 && player.y < 160) {
                isClearing = true;
                return false;
            }
            return false;
        }
    };

    window.LevelRegistry['lava'] = lavaConfig;
})();
