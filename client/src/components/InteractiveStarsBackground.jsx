import React, { useEffect, useRef } from "react";

export default function InteractiveStarsBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let stars = [];
    const numStars = 110;
    
    // Mouse tracking for physics repulsion
    let mouse = { x: null, y: null, radius: 140 };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      const baseOpacity = Math.random() * 0.6 + 0.3;
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        baseOpacity: baseOpacity,
        opacity: baseOpacity,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinkleDir: Math.random() > 0.5 ? 1 : -1,
        // 12% of stars are larger cross sparkles
        isSparkle: Math.random() > 0.88,
        color: Math.random() > 0.7 
          ? "rgba(52, 211, 153, "  // Emerald tint
          : Math.random() > 0.5 
            ? "rgba(16, 185, 129, "  // Darker green
            : "rgba(255, 255, 255, ", // Clean white
        speedX: (Math.random() - 0.5) * 0.08,
        speedY: (Math.random() - 0.5) * 0.08,
        // Elastic displacement offsets
        offsetX: 0,
        offsetY: 0,
      });
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Drawing a cross sparkle
    const drawCrossSparkle = (context, x, y, size, color, opacity) => {
      context.strokeStyle = `${color}${opacity})`;
      context.lineWidth = 0.85;
      context.beginPath();
      // Vertical line
      context.moveTo(x, y - size * 2.8);
      context.lineTo(x, y + size * 2.8);
      // Horizontal line
      context.moveTo(x - size * 2.8, y);
      context.lineTo(x + size * 2.8, y);
      context.stroke();

      // Core glow circle
      context.fillStyle = `${color}${opacity * 1.4})`;
      context.beginPath();
      context.arc(x, y, size * 0.7, 0, Math.PI * 2);
      context.fill();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Slow drifting movement
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrapping around the screen
        if (star.x < -20) star.x = canvas.width + 20;
        if (star.x > canvas.width + 20) star.x = -20;
        if (star.y < -20) star.y = canvas.height + 20;
        if (star.y > canvas.height + 20) star.y = -20;

        // Sinusoidal Twinkle animation
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity > 1) {
          star.opacity = 1;
          star.twinkleDir = -1;
        } else if (star.opacity < star.baseOpacity * 0.2) {
          star.opacity = star.baseOpacity * 0.2;
          star.twinkleDir = 1;
        }

        // Elastic displacement logic
        let targetOffsetX = 0;
        let targetOffsetY = 0;

        if (mouse.x !== null && mouse.y !== null) {
          // Calculate distance between mouse and star (including its offsets)
          const currentX = star.x + star.offsetX;
          const currentY = star.y + star.offsetY;
          const dx = currentX - mouse.x;
          const dy = currentY - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius; // 0 to 1
            const angle = Math.atan2(dy, dx);
            const pushDist = force * 24; // Maximum displacement in pixels
            targetOffsetX = Math.cos(angle) * pushDist;
            targetOffsetY = Math.sin(angle) * pushDist;
          }
        }

        // Interpolate current offsets towards target offsets for ultra-smooth fluid movement
        star.offsetX += (targetOffsetX - star.offsetX) * 0.08;
        star.offsetY += (targetOffsetY - star.offsetY) * 0.08;

        const renderX = star.x + star.offsetX;
        const renderY = star.y + star.offsetY;

        // Render the star particle
        if (star.isSparkle) {
          drawCrossSparkle(ctx, renderX, renderY, star.size + 1.2, star.color, star.opacity);
        } else {
          ctx.fillStyle = `${star.color}${star.opacity})`;
          ctx.beginPath();
          ctx.arc(renderX, renderY, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
