
'use client';

import Link from "next/link";
import { ArrowRight, Server, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import SplitText from "@/components/SplitText";


export default function LandingPage() {
  const { t } = useLanguage();

  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };


  const features = [
    {
      icon: <Server className="w-10 h-10" />,
      title: t('feature.integration.title'),
      description: t('feature.integration.description'),
    },
    {
      icon: <Zap className="w-10 h-10" />,
      title: t('feature.performance.title'),
      description: t('feature.performance.description'),
    },
    {
      icon: <Shield className="w-10 h-10" />,
      title: t('feature.security.title'),
      description: t('feature.security.description'),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex space-x-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <div className="flex items-center space-x-2">
            <Server className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              {t('brand')}
            </span>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
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
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login" prefetch={true}>{t('nav.signin')}</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/login" prefetch={true}>
                  {t('nav.getstarted')} <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <SplitText
              text={`${t('hero.title')} ${t('hero.subtitle')}`}
              className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl"
              delay={50}
              duration={0.6}
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              textAlign="center"
              onLetterAnimationComplete={handleAnimationComplete}
            />
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              {t('hero.description')}
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/login" prefetch={true}>
                  {t('hero.cta')} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">
                  {t('hero.learn')}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              {t('features.title')}
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              {t('features.description')}
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="relative overflow-hidden rounded-3xl border bg-background/60 backdrop-blur-sm dark:bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <div className="text-primary">{feature.icon}</div>
                  <div className="space-y-2">
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="container py-6 md:py-0">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Server className="h-6 w-6" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              {t('footer.built')}{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
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
