'use client';

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words" | "lines";
  from?: { opacity: number; y: number };
  to?: { opacity: number; y: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: "left" | "center" | "right";
  tag?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  onLetterAnimationComplete?: () => void;
}

const SplitText = ({
  text,
  className = "",
  delay = 100,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
}: SplitTextProps) => {
  const ref = useRef<HTMLElement>(null);
  const animationCompletedRef = useRef(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts.status === "loaded") {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    }
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      const el = ref.current;

      // Clean up previous instance
      if ((el as any)._rbsplitInstance) {
        try { 
          (el as any)._rbsplitInstance.revert(); 
        } catch (_) { 
          /* ignore */ 
        }
        (el as any)._rbsplitInstance = null;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
      const sign = marginValue === 0 ? "" : (marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`);
      const start = `top ${startPct}%${sign}`;

      let targets: Element[] = [];
      const assignTargets = (self: any) => {
        if (splitType.includes("chars") && self.chars && self.chars.length) targets = self.chars;
        if (!targets.length && splitType.includes("words") && self.words && self.words.length) targets = self.words;
        if (!targets.length && splitType.includes("lines") && self.lines && self.lines.length) targets = self.lines;
        if (!targets.length) targets = self.chars || self.words || self.lines || [];
      };

      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
        onSplit: (self) => {
          assignTargets(self);
          return gsap.fromTo(
            targets,
            { ...from },
            {
              ...to,
              duration,
              ease: "back.out(1.7)",
              stagger: delay / 1000,
              scrollTrigger: {
                trigger: el,
                start,
                fastScrollEnd: true,
                anticipatePin: 0.4,
                onEnter: () => {
                  // Animation will play automatically
                },
                onLeave: () => {
                  // Reset animation when leaving viewport
                  gsap.set(targets, from);
                },
                onEnterBack: () => {
                  // Replay animation when scrolling back into view
                  gsap.fromTo(
                    targets,
                    { ...from },
                    {
                      ...to,
                      duration,
                      ease: "back.out(1.7)",
                      stagger: delay / 1000,
                      onComplete: () => {
                        animationCompletedRef.current = true;
                        onLetterAnimationComplete?.();
                      },
                    }
                  );
                },
                onLeaveBack: () => {
                  // Reset animation when leaving viewport upwards
                  gsap.set(targets, from);
                },
              },
              onComplete: () => {
                animationCompletedRef.current = true;
                onLetterAnimationComplete?.();
              },
              willChange: "transform, opacity",
              force3D: true,
            }
          );
        },
      });
      (el as any)._rbsplitInstance = splitInstance;

      return () => {
        ScrollTrigger.getAll().forEach((st) => { 
          if (st.trigger === el) st.kill(); 
        });
        try { 
          splitInstance.revert(); 
        } catch (_) { 
          /* ignore */ 
        }
        (el as any)._rbsplitInstance = null;
      };
    },
    {
      dependencies: [
        text,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
        fontsLoaded,
        onLetterAnimationComplete,
      ],
      scope: ref,
    }
  );

  const renderTag = () => {
    const style = {
      textAlign,
      whiteSpace: "nowrap" as const,
      willChange: "transform, opacity",
    };
    const classes = `split-parent overflow-hidden inline-block whitespace-nowrap ${className}`;
    
    const renderElement = () => {
      switch (tag) {
        case "h1":
          return (
            <h1 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>
              {text}
            </h1>
          );
        case "h2":
          return (
            <h2 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>
              {text}
            </h2>
          );
        case "h3":
          return (
            <h3 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>
              {text}
            </h3>
          );
        case "h4":
          return (
            <h4 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>
              {text}
            </h4>
          );
        case "h5":
          return (
            <h5 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>
              {text}
            </h5>
          );
        case "h6":
          return (
            <h6 ref={ref as React.RefObject<HTMLHeadingElement>} style={style} className={classes}>
              {text}
            </h6>
          );
        default:
          return (
            <p ref={ref as React.RefObject<HTMLParagraphElement>} style={style} className={classes}>
              {text}
            </p>
          );
      }
    };

    return renderElement();
  };
  
  return renderTag();
};

export default SplitText;