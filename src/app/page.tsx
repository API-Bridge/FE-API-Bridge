
'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Server, 
  Zap, 
  Shield, 
  AlertTriangle,
  Leaf,
  Home,
  FileText,
  Users,
  Wind,
  MapPin,
  GraduationCap,
  Music,
  BarChart3,
  TreePine
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";
import SplitText from "@/components/SplitText";
import ScrollReveal from "@/components/ScrollReveal";
import dynamic from "next/dynamic";

const AnimatedBackground = dynamic(() => import("@/components/animated-background"), {
  ssr: false,
  loading: () => null
});


export default function LandingPage() {
  const { t, language } = useLanguage();
  const { theme } = useTheme();

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };

  useEffect(() => {
    // GSAP 동적 로딩
    const loadGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      // 기능 제목 글자 애니메이션
      const titleChars = document.querySelectorAll('[class*="feature-char-"]');
      if (titleChars.length > 0) {
        gsap.fromTo(titleChars, 
          { opacity: 0.1, filter: 'blur(6px)' },
          {
            opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out', stagger: 0.2,
            scrollTrigger: { trigger: '.features-title', start: 'top bottom-=20%', end: 'bottom center', scrub: 1 }
          }
        );
      }

      // 기능 설명 단어 애니메이션
      const descWords = document.querySelectorAll('[class*="feature-word-"]');
      if (descWords.length > 0) {
        gsap.fromTo(descWords, 
          { opacity: 0.1, filter: 'blur(4px)' },
          {
            opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out', stagger: 0.1,
            scrollTrigger: { trigger: '.features-description', start: 'top bottom-=20%', end: 'bottom center', scrub: 1 }
          }
        );
      }

      // 카드 애니메이션
      const cardElements = document.querySelectorAll('[class*="feature-card-"]');
      if (cardElements.length > 0) {
        gsap.fromTo(cardElements, 
          { opacity: 0.1, filter: 'blur(4px)', rotate: 2, y: 50 },
          {
            opacity: 1, filter: 'blur(0px)', rotate: 0, y: 0, duration: 1.2, ease: 'power2.out', stagger: 0.3,
            scrollTrigger: { trigger: cardElements[0], start: 'top bottom-=30%', toggleActions: 'play none none reverse' }
          }
        );
      }

      // API Categories 제목 애니메이션
      const apiTitleChars = document.querySelectorAll('[class*="api-title-char-"]');
      if (apiTitleChars.length > 0) {
        gsap.fromTo(apiTitleChars, 
          { opacity: 0.1, filter: 'blur(8px)', scale: 0.8 },
          {
            opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.8, ease: 'back.out(1.7)', stagger: 0.1,
            scrollTrigger: { trigger: '.api-categories-title', start: 'top bottom-=20%', end: 'bottom center', scrub: 1 }
          }
        );
      }

      // API Category Cards 애니메이션
      const categoryCards = document.querySelectorAll('[class*="api-category-"]');
      if (categoryCards.length > 0) {
        gsap.fromTo(categoryCards, 
          { opacity: 0, scale: 0.8, rotateY: 15, y: 60, filter: 'blur(6px)' },
          {
            opacity: 1, scale: 1, rotateY: 0, y: 0, filter: 'blur(0px)', duration: 1.5, ease: 'back.out(1.2)', stagger: 0.2,
            scrollTrigger: { 
              trigger: categoryCards[0], start: 'top bottom-=40%', toggleActions: 'play none none reverse'
            },
            onComplete: () => gsap.set(categoryCards, { opacity: 1, scale: 1, rotateY: 0, filter: 'blur(0px)', clearProps: 'transform' })
          }
        );
      }
    };

    loadGSAP();
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

  const apiCategories = [
    {
      category: t('category.culture'),
      icon: <Music className="w-8 h-8" />,
      apis: [
        { name: t('api.performance'), data: t('api.performance.data'), color: "from-pink-500 to-rose-500" },
        { name: t('api.tourism'), data: t('api.tourism.data'), color: "from-purple-500 to-violet-500" }
      ]
    },
    {
      category: t('category.disaster'),
      icon: <AlertTriangle className="w-8 h-8" />,
      apis: [
        { name: t('api.wildfire'), data: t('api.wildfire.data'), color: "from-orange-500 to-red-500" },
        { name: t('api.fire'), data: t('api.fire.data'), color: "from-red-500 to-pink-500" }
      ]
    },
    {
      category: t('category.agriculture'),
      icon: <Leaf className="w-8 h-8" />,
      apis: [
        { name: t('api.livestock'), data: t('api.livestock.data'), color: "from-green-500 to-emerald-500" },
        { name: t('api.fishery'), data: t('api.fishery.data'), color: "from-blue-500 to-cyan-500" }
      ]
    },
    {
      category: t('category.realestate'),
      icon: <Home className="w-8 h-8" />,
      apis: [
        { name: t('api.townhouse'), data: t('api.townhouse.data'), color: "from-indigo-500 to-blue-500" },
        { name: t('api.apartment'), data: t('api.apartment.data'), color: "from-blue-500 to-indigo-500" },
        { name: t('api.vehicle'), data: t('api.vehicle.data'), color: "from-gray-500 to-slate-500" }
      ]
    },
    {
      category: t('category.economy'),
      icon: <BarChart3 className="w-8 h-8" />,
      apis: [
        { name: t('api.business'), data: t('api.business.data'), color: "from-yellow-500 to-orange-500" },
        { name: t('api.ecos'), data: t('api.ecos.data'), color: "from-green-500 to-teal-500" },
        { name: t('api.dart'), data: t('api.dart.data'), color: "from-blue-500 to-purple-500" },
        { name: t('api.trade'), data: t('api.trade.data'), color: "from-teal-500 to-green-500" },
        { name: t('api.trader'), data: t('api.trader.data'), color: "from-cyan-500 to-blue-500" }
      ]
    },
    {
      category: t('category.employment'),
      icon: <Users className="w-8 h-8" />,
      apis: [
        { name: t('api.worknet'), data: t('api.worknet.data'), color: "from-violet-500 to-purple-500" },
        { name: t('api.publicjob'), data: t('api.publicjob.data'), color: "from-indigo-500 to-violet-500" },
        { name: t('api.venture'), data: t('api.venture.data'), color: "from-orange-500 to-yellow-500" }
      ]
    },
    {
      category: t('category.environment'),
      icon: <Wind className="w-8 h-8" />,
      apis: [
        { name: t('api.airpollution'), data: t('api.airpollution.data'), color: "from-gray-500 to-blue-500" },
        { name: t('api.weather'), data: t('api.weather.data'), color: "from-sky-500 to-blue-500" },
        { name: t('api.earthquake'), data: t('api.earthquake.data'), color: "from-amber-500 to-orange-500" }
      ]
    },
    {
      category: t('category.transport'),
      icon: <MapPin className="w-8 h-8" />,
      apis: [
        { name: t('api.subway'), data: t('api.subway.data'), color: "from-blue-500 to-indigo-500" },
        { name: t('api.sgis'), data: t('api.sgis.data'), color: "from-green-500 to-blue-500" }
      ]
    },
    {
      category: t('category.legal'),
      icon: <FileText className="w-8 h-8" />,
      apis: [
        { name: t('api.law'), data: t('api.law.data'), color: "from-slate-500 to-gray-500" },
        { name: t('api.patent'), data: t('api.patent.data'), color: "from-purple-500 to-pink-500" }
      ]
    },
    {
      category: t('category.education'),
      icon: <GraduationCap className="w-8 h-8" />,
      apis: [
        { name: t('api.neis'), data: t('api.neis.data'), color: "from-blue-500 to-green-500" },
        { name: t('api.hospital'), data: t('api.hospital.data'), color: "from-red-500 to-pink-500" },
        { name: t('api.medicine'), data: t('api.medicine.data'), color: "from-green-500 to-blue-500" }
      ]
    },
    {
      category: t('category.nature'),
      icon: <TreePine className="w-8 h-8" />,
      apis: [
        { name: t('api.mountain'), data: t('api.mountain.data'), color: "from-green-500 to-teal-500" },
        { name: t('api.safety'), data: t('api.safety.data'), color: "from-red-500 to-orange-500" }
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background relative scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
      <AnimatedBackground />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center relative">
          <div className="flex items-center space-x-2">
            <img src="/APIBridge.png" alt="API Bridge" className={`h-6 w-6 object-contain ${isDarkMode ? 'brightness-0 invert' : ''}`} />
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
              href="#api-categories"
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
              className={`font-korean text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl ${isDarkMode ? 'text-white' : 'text-black'}`}
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
            <p className="max-w-[48rem] leading-normal text-muted-foreground text-base sm:text-xl lg:text-2xl sm:leading-8 font-korean">
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

        {/* API Categories Section */}
        <section 
          id="api-categories"
          className="min-h-screen flex items-center justify-center py-16"
        >
          <div className="container flex max-w-[90rem] flex-col items-center space-y-16 text-center">
            <div className="space-y-8">
              <h2 
                className="api-categories-title font-korean text-4xl leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent"
                style={{ willChange: 'transform, opacity, filter' }}
              >
                {t('apiCatalog.title').split('').map((char, index) => (
                  <span 
                    key={index} 
                    className={`api-title-char-${index} inline-block`}
                    style={{ 
                      opacity: 0.1, 
                      filter: 'blur(8px)',
                      transform: 'scale(0.8)',
                      willChange: 'opacity, filter, transform'
                    }}
                  >
                    {char}
                  </span>
                ))}
              </h2>
              <p className="max-w-[90%] mx-auto leading-normal text-muted-foreground text-lg sm:text-xl md:text-2xl lg:text-3xl sm:leading-8 font-korean">
                {t('apiCatalog.subtitle')}
              </p>
            </div>
            
            <div className="w-full grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {apiCategories.map((category, categoryIndex) => (
                <div 
                  key={categoryIndex}
                  className={`api-category-${categoryIndex} group relative overflow-hidden rounded-3xl border p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    isDarkMode
                      ? 'bg-white/5 backdrop-blur-sm border-white/10'
                      : 'bg-white/20 backdrop-blur-sm border-white/30'
                  }`}
                >
                  
                  {/* Category Header */}
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                        {category.icon}
                      </div>
                      <h3 className="font-bold text-xl md:text-2xl font-korean">
                        {category.category}
                      </h3>
                    </div>
                    
                    {/* API Cards */}
                    <div className="space-y-3 mt-6">
                      {category.apis.map((api, apiIndex) => (
                        <div 
                          key={apiIndex}
                          className={`relative overflow-hidden rounded-2xl p-4 shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 hover:scale-105 cursor-pointer ${
                            isDarkMode 
                              ? 'bg-white/10 backdrop-blur-md border border-white/20 text-white' 
                              : 'bg-white/30 backdrop-blur-lg border border-white/40 text-gray-900'
                          }`}
                        >
                          <div className="relative z-10">
                            <h4 className="font-bold text-xl mb-2 font-korean">
                              {api.name}
                            </h4>
                            <p className="text-sm opacity-90 leading-relaxed font-korean">
                              {api.data}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Call to Action */}
            <div className="pt-8">
              <Button 
                size="lg" 
                className="text-xl px-12 py-6 h-auto" 
                asChild
              >
                <Link href="/login" prefetch={true} className="font-korean">
                  {t('hero.cta')} <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="container py-6 md:py-0 relative z-10">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <img src="/APIBridge.png" alt="API Bridge" className={`h-6 w-6 object-contain ${!isDarkMode ? 'brightness-0' : 'brightness-0 invert'} drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)]`} />
            <p className={`text-center text-sm leading-loose ${isDarkMode ? 'text-white drop-shadow-[1px_1px_2px_rgba(0,0,0,0.4)]' : 'text-black drop-shadow-[1px_1px_2px_rgba(255,255,255,0.4)]'} md:text-left font-korean`}>
              {t('footer.built')}{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className={`font-medium underline underline-offset-4 ${isDarkMode ? 'text-white' : 'text-black'} hover:text-primary transition-colors font-korean`}
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
