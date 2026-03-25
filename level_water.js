(function() {
    const FLAGPOLE_X = 750;
    let spacePressedLastFrame = false;

    window.LevelRegistry['water'] = {
        name: 'water',
        title: 'Deep Sea Mystery',
        description: 'Tap SPACE to swim! Reach the seaweed flagpole.',
        backgroundColor: '#004466',
        platformColor: '#006688',
        physics: {
            gravity: 0.15,    // Low gravity for buoyancy
            speed: 0.3,       // Slow movement in water
            jumpForce: 4,     // Swimming stroke strength
            frictionX: 0.92,  // High resistance
            frictionY: 0.95   // Sinking resistance
        },
        platforms: [
            {x: 0, y: 550, w: 800, h: 50},   // Floor
            {x: 200, y: 400, w: 100, h: 20},
            {x: 400, y: 300, w: 100, h: 20},
            {x: 600, y: 450, w: 100, h: 20},
            {x: 50, y: 250, w: 100, h: 20}
        ],
        
        onInit: function(player) {
            player.color = '#00faff'; // Cyan Mario for underwater
            player.x = 50;
            player.y = 500;
        },

        onUpdate: function(player, keys) {
            // "Flappy Bird" style swimming: Jump anytime SPACE is pressed
            if (keys['Space'] && !spacePressedLastFrame) {
                // Using a hardcoded value that matches the defined jumpForce in physics
                player.vy = -4; 
            }
            spacePressedLastFrame = keys['Space'];
        },

        renderBackground: function(ctx) {
            // Draw some bubbles
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            for(let i=0; i<10; i++) {
                let x = (Math.sin(Date.now()/1000 + i) * 400) + 400;
                let y = (Date.now()/10 * (1 + i/10)) % 600;
                ctx.beginPath();
                ctx.arc(x, 600 - y, 5 + i, 0, Math.PI*2);
                ctx.fill();
            }

            // Draw Corals
            ctx.fillStyle = "#FF7F50"; // Coral color
            ctx.fillRect(150, 520, 20, 30);
            ctx.fillRect(450, 510, 25, 40);
            ctx.fillRect(650, 530, 15, 20);
        },

        renderForeground: function(ctx, player) {
            // Draw seaweed-wrapped flagpole
            const poleX = FLAGPOLE_X;
            const poleY = 350;
            
            // The Pole
            ctx.fillStyle = "#8B4513";
            ctx.fillRect(poleX, poleY, 10, 200);

            // The Flag (wrapped in seaweed)
            ctx.fillStyle = "#228B22"; // Seaweed green
            ctx.beginPath();
            ctx.moveTo(poleX + 10, poleY + 10);
            ctx.lineTo(poleX + 50, poleY + 30);
            ctx.lineTo(poleX + 10, poleY + 50);
            ctx.fill();

            // Animated Seaweed around pole
            ctx.strokeStyle = "#006400";
            ctx.lineWidth = 3;
            ctx.beginPath();
            for(let i=0; i<10; i++) {
                let offset = Math.sin(Date.now()/500 + i) * 5;
                ctx.lineTo(poleX + 5 + offset, poleY + (i * 20));
            }
            ctx.stroke();
        },

        checkWin: function(player) {
            if (player.x + player.width > FLAGPOLE_X) {
                // Trigger transition to Level B (Lava)
                if (window.showTransition) {
                    window.showTransition('lava');
                }
                return true;
            }
            return false;
        }
    };
})();
