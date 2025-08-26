'use client';

import { useRef, useEffect, useState } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  splitType?: "chars" | "words" | "lines";
  from?: { opacity: number; y: number };
  to?: { opacity: number; y: number };
  threshold?: number;
  textAlign?: "left" | "center" | "right";
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  textAlign = "center",
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedElements, setAnimatedElements] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  useEffect(() => {
    if (!isVisible || !text) return;

    const elements = splitType === "chars" ? text.split("") : text.split(" ");
    setAnimatedElements([]);

    elements.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedElements(prev => [...prev, index]);
        
        if (index === elements.length - 1) {
          setTimeout(() => {
            onLetterAnimationComplete?.();
          }, duration * 1000);
        }
      }, index * delay);
    });
  }, [isVisible, text, splitType, delay, duration, onLetterAnimationComplete]);

  const renderSplitText = () => {
    if (splitType === "chars") {
      return text.split("").map((char, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-600 ease-out"
          style={{
            opacity: animatedElements.includes(index) ? to.opacity : from.opacity,
            transform: `translateY(${animatedElements.includes(index) ? to.y : from.y}px)`,
            transitionDelay: `${index * delay}ms`,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ));
    } else {
      return text.split(" ").map((word, index) => (
        <span key={index} className="inline-block mr-2">
          <span
            className="inline-block transition-all duration-600 ease-out"
            style={{
              opacity: animatedElements.includes(index) ? to.opacity : from.opacity,
              transform: `translateY(${animatedElements.includes(index) ? to.y : from.y}px)`,
              transitionDelay: `${index * delay}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ));
    }
  };

  return (
    <div
      ref={ref}
      className={`split-parent overflow-hidden inline-block whitespace-nowrap ${className}`}
      style={{
        textAlign,
        wordWrap: "normal",
      }}
    >
      {renderSplitText()}
    </div>
  );
};

export default SplitText;