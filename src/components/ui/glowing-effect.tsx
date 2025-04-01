import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GlowingEffectProps {
  blur?: number;
  spread?: number;
  glow?: boolean;
  disabled?: boolean;
  inactiveZone?: number;
  proximity?: number;
  className?: string;
}

export function GlowingEffect({
  blur = 80,
  spread = 100,
  glow = true,
  disabled = false,
  inactiveZone = 0.2,
  proximity = 100,
  className,
}: GlowingEffectProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glow || disabled) return;

      const element = e.currentTarget as HTMLElement;
      const rect = element.getBoundingClientRect();
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const distanceFromCenter = Math.sqrt(
        Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
      );
      
      const maxDistance = Math.sqrt(
        Math.pow(rect.width / 2, 2) + Math.pow(rect.height / 2, 2)
      );
      
      if (distanceFromCenter < maxDistance * (1 - inactiveZone)) {
        setPosition({ x, y });
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [glow, disabled, inactiveZone]);

  if (!glow || disabled) return null;

  return (
    <motion.div
      className={cn(
        "pointer-events-none absolute inset-0 z-30 transition duration-300",
        className
      )}
      animate={{
        background: isHovered
          ? `radial-gradient(${spread}px circle at ${position.x}px ${position.y}px, hsl(var(--fintech-blue) / 0.15), transparent ${proximity}%)`
          : "none",
        filter: isHovered ? `blur(${blur}px)` : "none",
      }}
    />
  );
}
