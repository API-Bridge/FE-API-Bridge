'use client';

import { useEffect, useRef, useMemo, ReactNode } from 'react';
import React from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
}

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
  tag = "div"
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLElement>(null);

  const splitText = useMemo(() => {
    let text = '';
    if (typeof children === 'string') {
      text = children;
    } else if (React.isValidElement(children) && typeof children.props.children === 'string') {
      text = children.props.children;
    } else if (children && typeof children === 'object' && 'toString' in children) {
      text = children.toString();
    }
    
    console.log('Processing text:', text);
    
    // Split by spaces and filter out empty strings
    const words = text.split(' ').filter(word => word.trim().length > 0);
    
    return words.map((word, index) => (
      <React.Fragment key={index}>
        <span className="inline-block word" data-word={word}>
          {word}
        </span>
        {index < words.length - 1 && ' '}
      </React.Fragment>
    ));
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Wait for the element to be fully rendered
    const timeout = setTimeout(() => {
      const scroller =
        scrollContainerRef && scrollContainerRef.current
          ? scrollContainerRef.current
          : window;

      // Rotation animation
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        {
          ease: 'none',
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom',
            end: rotationEnd,
            scrub: true,
          },
        }
      );

      const wordElements = el.querySelectorAll('.word');
      
      if (wordElements.length > 0) {
        console.log('Found word elements:', wordElements.length);
        
        // Set initial states for all words
        wordElements.forEach((word, index) => {
          gsap.set(word, { 
            opacity: baseOpacity,
            filter: enableBlur ? `blur(${blurStrength}px)` : 'blur(0px)'
          });
        });

        // Animate each word with stagger
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            scroller,
            start: 'top bottom-=20%',
            end: wordAnimationEnd,
            scrub: true,
          }
        });

        // Add each word animation to timeline with delay
        wordElements.forEach((word, index) => {
          tl.to(word, {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 0.3,
            ease: 'none'
          }, index * 0.1); // 0.1초 간격으로 시작
        });
      }
    }, 100);

    return () => {
      clearTimeout(timeout);
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === el) trigger.kill();
      });
    };
  }, [children, scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  const renderTag = () => {
    const classes = `${containerClassName}`;
    const textClasses = `${textClassName}`;
    
    const content = (
      <span className={textClasses}>{splitText}</span>
    );

    switch (tag) {
      case "h1":
        return (
          <h1 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={classes}>
            {content}
          </h1>
        );
      case "h2":
        return (
          <h2 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={classes}>
            {content}
          </h2>
        );
      case "h3":
        return (
          <h3 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={classes}>
            {content}
          </h3>
        );
      case "h4":
        return (
          <h4 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={classes}>
            {content}
          </h4>
        );
      case "h5":
        return (
          <h5 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={classes}>
            {content}
          </h5>
        );
      case "h6":
        return (
          <h6 ref={containerRef as React.RefObject<HTMLHeadingElement>} className={classes}>
            {content}
          </h6>
        );
      case "p":
        return (
          <p ref={containerRef as React.RefObject<HTMLParagraphElement>} className={classes}>
            {content}
          </p>
        );
      default:
        return (
          <div ref={containerRef as React.RefObject<HTMLDivElement>} className={classes}>
            {content}
          </div>
        );
    }
  };

  return renderTag();
};

export default ScrollReveal;