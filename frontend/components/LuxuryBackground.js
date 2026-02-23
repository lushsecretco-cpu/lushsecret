import React, { useEffect, useRef } from 'react';

export default function LuxuryBackground({ children }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Control de animación
    let animationFrameId = null;
    let isRunning = true;
    let lastFrameTime = Date.now();
    const targetFPS = 30; // Limitar a 30 FPS para mejor rendimiento
    const frameInterval = 1000 / targetFPS;

    // Partículas de luz blanca (reducidas para mejor rendimiento)
    const particles = [];
    const particleCount = 30; // Reducido de 50 a 30

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
        this.opacity = Math.random();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -10;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        this.pulse += this.pulseSpeed;
        
        // Efecto de pulsación
        this.currentOpacity = this.opacity * (0.5 + Math.sin(this.pulse) * 0.5);

        if (this.y > canvas.height) {
          this.reset();
        }

        if (this.x > canvas.width || this.x < 0) {
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.beginPath();
        
        // Crear gradiente radial para cada partícula
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.size * 2.5
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.currentOpacity})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.currentOpacity * 0.5})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Núcleo brillante
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${this.currentOpacity})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Inicializar partículas
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    // Destellos de luz ocasionales
    const sparkles = [];
    
    class Sparkle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 0;
        this.maxSize = Math.random() * 15 + 5;
        this.growing = true;
        this.growthRate = Math.random() * 1.5 + 0.5;
        this.opacity = 1;
      }

      update() {
        if (this.growing) {
          this.size += this.growthRate;
          if (this.size >= this.maxSize) {
            this.growing = false;
          }
        } else {
          this.opacity -= 0.02;
        }
      }

      draw() {
        if (this.opacity <= 0) return;

        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Estrella de 4 puntas
        for (let i = 0; i < 2; i++) {
          ctx.rotate(Math.PI / 4);
          
          const gradient = ctx.createLinearGradient(-this.size, 0, this.size, 0);
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
          gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.9})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(-this.size, -1.5, this.size * 2, 3);
        }
        
        ctx.restore();
      }

      isDead() {
        return this.opacity <= 0;
      }
    }

    // Función de animación
    function animate() {
      // Verificar si la animación debe continuar
      if (!isRunning) return;

      // Control de FPS
      const now = Date.now();
      const elapsed = now - lastFrameTime;

      if (elapsed < frameInterval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = now - (elapsed % frameInterval);

      // Fondo con gradiente oscuro de lujo
      const bgGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGradient.addColorStop(0, '#0a0a0a');
      bgGradient.addColorStop(0.5, '#1a0a14');
      bgGradient.addColorStop(1, '#0a0a0a');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar partículas
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Actualizar y dibujar destellos
      sparkles.forEach((sparkle, index) => {
        sparkle.update();
        sparkle.draw();
        
        if (sparkle.isDead()) {
          sparkles.splice(index, 1);
        }
      });

      // Crear nuevos destellos aleatoriamente (reducida frecuencia)
      if (Math.random() < 0.005 && sparkles.length < 2) {
        sparkles.push(new Sparkle());
      }

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    // Manejar redimensionamiento
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Cleanup: detener animación y remover listeners
    return () => {
      isRunning = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Canvas de fondo */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a14 50%, #0a0a0a 100%)' }}
      />
      
      {/* Overlay sutil para mejor contraste */}
      <div className="fixed top-0 left-0 w-full h-full -z-5 bg-black/20" />
      
      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
