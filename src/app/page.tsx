
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Server, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";
import SplitText from "@/components/SplitText";
import ScrollReveal from "@/components/ScrollReveal";
import AnimatedBackground from "@/components/animated-background";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


export default function LandingPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  useEffect(() => {
    // 기능 제목 글자 애니메이션 ('기','능' 순서로)
    const titleChars = document.querySelectorAll('[class*="feature-char-"]');
    if (titleChars.length > 0) {
      gsap.fromTo(
        titleChars,
        { 
          opacity: 0.1, 
          filter: 'blur(6px)',
          willChange: 'opacity, filter'
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: '.features-title',
            start: 'top bottom-=20%',
            end: 'bottom center',
            scrub: 1,
          },
        }
      );
    }

    // 기능 설명 단어 애니메이션
    const descWords = document.querySelectorAll('[class*="feature-word-"]');
    if (descWords.length > 0) {
      gsap.fromTo(
        descWords,
        { 
          opacity: 0.1, 
          filter: 'blur(4px)',
          willChange: 'opacity, filter'
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.features-description',
            start: 'top bottom-=20%',
            end: 'bottom center',
            scrub: 1,
          },
        }
      );
    }

    // 카드 애니메이션
    const cardElements = document.querySelectorAll('[class*="feature-card-"]');
    if (cardElements.length > 0) {
      gsap.fromTo(
        cardElements,
        { 
          opacity: 0.1, 
          filter: 'blur(4px)', 
          rotate: 2, 
          y: 50,
          transformOrigin: '50% 50%'
        },
        {
          opacity: 1,
          filter: 'blur(0px)',
          rotate: 0,
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.2,
          scrollTrigger: {
            trigger: cardElements[0],
            start: 'top bottom-=10%',
            end: '+=800px',
            scrub: 1,
            onComplete: () => {
              // 애니메이션이 완료되지 않은 경우 강제로 완료
              gsap.set(cardElements, {
                opacity: 1,
                filter: 'blur(0px)',
                rotate: 0,
                y: 0
              });
            }
          },
        }
      );
    }
  }, [t]);

  // Check if current theme is dark (including system theme detection)
  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && typeof window !== 'undefined' && 
     window.matchMedia('(prefers-color-scheme: dark)').matches);


  const features = [
    {
      icon: <Server className="w-full h-full" />,
      title: t('feature.integration.title'),
      description: t('feature.integration.description'),
    },
    {
      icon: <Zap className="w-full h-full" />,
      title: t('feature.performance.title'),
      description: t('feature.performance.description'),
    },
    {
      icon: <Shield className="w-full h-full" />,
      title: t('feature.security.title'),
      description: t('feature.security.description'),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background relative scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
      <AnimatedBackground />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center relative">
          <div className="flex items-center space-x-2">
            <Server className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              {t('brand')}
            </span>
          </div>
          
          <nav className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-6 text-sm font-medium">
            <Link
              href="#features"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t('nav.features')}
            </Link>
            <Link
              href="/pricing"
              prefetch={true}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t('nav.pricing')}
            </Link>
            <Link
              href="#"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {t('nav.docs')}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-2 ml-auto">
            <LanguageToggle />
            <ThemeToggle />
            <Button size="sm" asChild>
              <Link href="/login" prefetch={true}>
                {t('nav.getstarted')} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10">
        <section className="min-h-screen flex items-center justify-center space-y-6 pb-8 pt-16">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center transform -translate-y-16">
            <SplitText
              key={`${language}-${theme}`}
              text={`${t('hero.title')} ${t('hero.subtitle')}`}
              className={`font-korean text-4xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl ${isDarkMode ? 'text-white' : 'text-black'}`}
              delay={50}
              duration={0.6}
              ease="back.out(1.7)"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.3}
              rootMargin="-100px"
              textAlign="center"
              tag="h1"
              onLetterAnimationComplete={handleAnimationComplete}
            />
            <p className="max-w-[48rem] leading-normal text-muted-foreground text-lg sm:text-2xl lg:text-3xl sm:leading-8 font-korean">
              {t('hero.description')}
            </p>
            <div className="space-x-6 pt-4">
              <Button size="lg" className="text-lg px-8 py-4 h-auto" asChild>
                <Link href="/login" prefetch={true} className="font-korean">
                  {t('hero.cta')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 h-auto" asChild>
                <Link href="#features" className="font-korean">
                  {t('hero.learn')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="min-h-screen flex items-center justify-center py-8"
        >
          <div className="container flex max-w-[80rem] flex-col items-center space-y-12 text-center">
            <div className="space-y-8">
              <h2 
                className={`features-title font-korean text-4xl leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl ${isDarkMode ? 'text-white' : 'text-black'}`}
                style={{ willChange: 'transform, opacity, filter' }}
              >
                {t('features.title').split('').map((char, index) => (
                  <span 
                    key={index} 
                    className={`feature-char-${index} inline-block`}
                    style={{ 
                      opacity: 0.1, 
                      filter: 'blur(6px)',
                      willChange: 'opacity, filter'
                    }}
                  >
                    {char}
                  </span>
                ))}
              </h2>
              <p 
                className="features-description max-w-[90%] mx-auto leading-normal text-muted-foreground text-lg sm:text-xl md:text-2xl lg:text-3xl sm:leading-8 font-korean"
                style={{ willChange: 'transform, opacity, filter' }}
              >
                {t('features.description').split(' ').map((word, index) => (
                  <span 
                    key={index} 
                    className={`feature-word-${index} inline-block`}
                    style={{ 
                      opacity: 0.1, 
                      filter: 'blur(4px)',
                      willChange: 'opacity, filter'
                    }}
                  >
                    {word}{index < t('features.description').split(' ').length - 1 ? ' ' : ''}
                  </span>
                ))}
              </p>
            </div>
            <div className="mx-auto grid justify-center gap-8 sm:grid-cols-2 md:max-w-[80rem] md:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`feature-card-${index} relative overflow-hidden rounded-3xl border bg-white/20 backdrop-blur-sm border-white/20 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10 p-4`}
                style={{
                  willChange: 'transform, opacity, filter'
                }}
              >
                <div className="flex h-[240px] flex-col justify-between rounded-md p-8">
                  <div className="text-primary flex justify-center">
                    <div className="w-16 h-16">{feature.icon}</div>
                  </div>
                  <div className="space-y-4 text-center">
                    <h3 className="font-bold text-xl md:text-2xl lg:text-3xl font-korean">{feature.title}</h3>
                    <p className="text-base md:text-lg text-muted-foreground font-korean">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="container py-6 md:py-0 relative z-10">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Server className="h-6 w-6 text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)]" />
            <p className="text-center text-sm leading-loose text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)] md:text-left font-korean">
              {t('footer.built')}{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4 text-white hover:text-primary transition-colors font-korean"
              >
                {t('footer.github')}
              </a>
              {t('footer.available')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
