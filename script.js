document.addEventListener('DOMContentLoaded', () => {
    const confettiBtn = document.getElementById('confetti-btn');
    const canvas = document.getElementById('confetti-canvas');
    const card = document.querySelector('.card');
    const audio = document.getElementById('birthday-audio');
    const blowAudio = document.getElementById('blow-audio');
    const floatingBalloons = document.querySelector('.floating-balloons');
    const cake = document.querySelector('.cake');
    const flame = document.querySelector('.flame');
    const instructions = document.querySelector('.instructions');
    
    // Variables de estado
    let isConfettiActive = false;
    let isCandleLit = true;
    let lastTap = 0;
    
    // Inicializar canvas
    function initCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    initCanvas();
    
    // Configuración de confeti
    const confettiParticles = [];
    const confettiCount = 100;
    const colors = ['#ff9a9e', '#fad0c4', '#a18cd1', '#fbc2eb', '#ffd166', '#ffef9f', '#a1c4fd', '#c2e9fb', '#ff4e50', '#a3de83'];
    
    // Crear partículas de confeti
    for (let i = 0; i < confettiCount; i++) {
        confettiParticles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 2 + 1,
            angle: Math.random() * 360,
            rotation: Math.random() * 0.2 - 0.1,
            shape: Math.random() > 0.5 ? 'rect' : 'circle'
        });
    }
    
    // Dibujar confeti
    function drawConfetti() {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confettiParticles.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);
            ctx.fillStyle = p.color;
            
            if (p.shape === 'rect') {
                ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            
            ctx.restore();
            
            // Actualizar posición
            p.y += p.speed;
            p.angle += p.rotation;
            
            // Reiniciar partícula cuando sale de la pantalla
            if (p.y > canvas.height) {
                p.y = -p.size;
                p.x = Math.random() * canvas.width;
            }
        });
        
        if (isConfettiActive) {
            requestAnimationFrame(drawConfetti);
        }
    }
    
    // Función para crear globos flotantes
    function createBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('balloon');
        
        const colors = ['var(--balloon1)', 'var(--balloon2)', 'var(--balloon3)', 'var(--balloon4)'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        balloon.style.background = color;
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.animationDuration = `${Math.random() * 10 + 10}s`;
        balloon.style.animationDelay = `${Math.random() * 5}s`;
        
        // Emoji aleatorio para el globo
        const emojis = ['🎈', '🎉', '🎊', '🎁', '🎀'];
        balloon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        floatingBalloons.appendChild(balloon);
        
        // Eliminar después de la animación
        setTimeout(() => {
            balloon.remove();
        }, 15000);
    }
    
    // Función para apagar la vela
    function blowOutCandle() {
        if (!isCandleLit) return;
        
        isCandleLit = false;
        blowAudio.play();
        flame.classList.add('blown');
        instructions.style.display = 'none';
        
        // Mostrar humo
        const smoke = document.createElement('div');
        smoke.classList.add('smoke');
        cake.appendChild(smoke);
        
        setTimeout(() => {
            smoke.remove();
        }, 2000);
        
        // Voltear la tarjeta después de 1 segundo
        setTimeout(() => {
            card.classList.add('flipped');
        }, 1000);
    }
    
    // Evento del botón de confeti
    confettiBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Reproducir audio
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio no pudo reproducirse: ", e));
        
        // Activar confeti
        if (!isConfettiActive) {
            isConfettiActive = true;
            drawConfetti();
            
            // Detener confeti después de 6 segundos
            setTimeout(() => {
                isConfettiActive = false;
                const ctx = canvas.getContext('2d');
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }, 6000);
        }
    });
    
    // Evento de doble toque en el pastel
    cake.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;
        
        if (tapLength < 500 && tapLength > 0) {
            // Doble toque detectado
            blowOutCandle();
        }
        
        lastTap = currentTime;
    });
    
    // Evento de clic en la tarjeta (para voltear)
    card.addEventListener('click', () => {
        if (!isCandleLit) {
            card.classList.toggle('flipped');
        }
    });
    
    // Evento de resize
    window.addEventListener('resize', initCanvas);
    
    // Crear globos continuamente
    for (let i = 0; i < 8; i++) {
        setTimeout(createBalloon, i * 2000);
    }
});