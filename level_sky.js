(function() {
    const levelName = 'sky';
    const WIND_STRENGTH = 0.15;
    const FLAGPOLE_X = 750;

    // Internal level state
    const state = {
        winning: false,
        winTimer: 0,
        flagY: 200,
        marioSlideY: 0
    };

    // Platform types: static or falling
    const platforms = [
        { x: 0, y: 550, w: 150, h: 50, type: 'static' },
        { x: 200, y: 450, w: 100, h: 20, type: 'falling', fallSpeed: 0, triggered: false },
        { x: 350, y: 350, w: 100, h: 20, type: 'falling', fallSpeed: 0, triggered: false },
        { x: 500, y: 250, w: 100, h: 20, type: 'falling', fallSpeed: 0, triggered: false },
        { x: 650, y: 400, w: 150, h: 20, type: 'static' }
    ];

    window.LevelRegistry[levelName] = {
        name: levelName,
        title: 'Level 3: Cloud Top Summit',
        description: 'Strong winds! Clouds will fall under your weight!',
        backgroundColor: '#B0E0E6', // Powder Blue
        platformColor: '#FFFFFF',    // White clouds
        physics: {
            gravity: 0.4,
            speed: 0.6,
            jumpForce: 12,
            frictionX: 0.9,
            frictionY: 1
        },
        platforms: platforms,

        onInit: function(player) {
            player.x = 20;
            player.y = 500;
            player.color = '#FFD700'; // Golden Mario for the sky level
            state.winning = false;
            state.winTimer = 0;
            state.flagY = 200;
            state.marioSlideY = 0;

            // Reset platforms
            platforms[0].y = 550;
            platforms[1].y = 450; platforms[1].triggered = false; platforms[1].fallSpeed = 0;
            platforms[2].y = 350; platforms[2].triggered = false; platforms[2].fallSpeed = 0;
            platforms[3].y = 250; platforms[3].triggered = false; platforms[3].fallSpeed = 0;
            platforms[4].y = 400;
        },

        onUpdate: function(player, keys) {
            if (state.winning) {
                state.winTimer++;
                // Animation logic
                if (state.flagY < 360) state.flagY += 2;
                if (state.marioSlideY < 360) {
                    state.marioSlideY += 2;
                    player.y = state.marioSlideY;
                    player.x = FLAGPOLE_X - 10;
                }
                player.vx = 0;
                player.vy = 0;
                return;
            }

            // 1. Global Side Wind (Leftward)
            player.vx -= WIND_STRENGTH;

            // 2. Responsive Falling Platforms
            platforms.forEach(p => {
                if (p.type === 'falling') {
                    // Check if player is on this platform
                    if (player.x < p.x + p.w && player.x + player.width > p.x &&
                        Math.abs((player.y + player.height) - p.y) < 5 && player.vy >= 0) {
                        p.triggered = true;
                    }

                    if (p.triggered) {
                        p.fallSpeed += 0.1;
                        p.y += p.fallSpeed;
                    }
                }
            });
        },

        renderBackground: function(ctx) {
            // Draw some distant clouds
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(100, 100, 30, 0, Math.PI * 2);
            ctx.arc(130, 100, 40, 0, Math.PI * 2);
            ctx.arc(160, 100, 30, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(500, 150, 40, 0, Math.PI * 2);
            ctx.arc(540, 150, 50, 0, Math.PI * 2);
            ctx.arc(580, 150, 40, 0, Math.PI * 2);
            ctx.fill();

            // Wind indicators (particles)
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            for (let i = 0; i < 5; i++) {
                let y = (Date.now() / 10 + i * 120) % 600;
                let x = (Date.now() / 5 + i * 200) % 800;
                ctx.beginPath();
                ctx.moveTo(800 - x, y);
                ctx.lineTo(750 - x, y);
                ctx.stroke();
            }
        },

        renderForeground: function(ctx, player) {
            // Draw Flagpole
            ctx.fillStyle = '#8B4513'; // Brown pole
            ctx.fillRect(FLAGPOLE_X, 200, 10, 200);
            
            ctx.fillStyle = '#FF0000'; // Red flag
            ctx.beginPath();
            ctx.moveTo(FLAGPOLE_X + 10, state.flagY);
            ctx.lineTo(FLAGPOLE_X + 50, state.flagY + 20);
            ctx.lineTo(FLAGPOLE_X + 10, state.flagY + 40);
            ctx.fill();

            if (!state.winning) {
                // Wind Warning Text
                ctx.fillStyle = "white";
                ctx.font = "16px Arial";
                ctx.fillText("⚠️ STRONG WIND <<<<", 10, 30);
            }
        },

        checkWin: function(player) {
            if (state.winning) {
                if (state.winTimer > 100) {
                    window.showTransition(null); // End of demo
                    return true;
                }
                return false;
            }

            if (player.x + player.width >= FLAGPOLE_X && player.y > 150 && player.y < 450) {
                state.winning = true;
                state.marioSlideY = player.y;
                return false;
            }
            return false;
        }
    };
})();
