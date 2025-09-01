
"use client";

import Link from "next/link";
import { ArrowRight, Check, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const AnimatedBackground = dynamic(() => import("@/components/animated-background"), {
  ssr: false,
  loading: () => null
});

const SplitText = dynamic(() => import("@/components/SplitText"), {
  ssr: false,
  loading: () => <div className="text-4xl md:text-5xl font-bold font-korean tracking-tighter mb-4">Loading...</div>
});

const getFreePlanFeatures = (t: (key: string) => string) => [
  t("pricing.feature.apiCreation.free"),
  t("pricing.feature.apiCalls.free"),
  t("pricing.feature.support.free"),
];

const getProPlanFeatures = (t: (key: string) => string) => [
  t("pricing.feature.apiCreation.pro"),
  t("pricing.feature.apiCalls.pro"),
  t("pricing.feature.ai"),
  t("pricing.feature.support.pro"),
  t("pricing.feature.analytics"),
];


export default function PricingPage() {
  const { t } = useLanguage();
  const freePlanFeatures = getFreePlanFeatures(t);
  const proPlanFeatures = getProPlanFeatures(t);

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
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
              href="/#features"
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
              href="/#api-categories"
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
        <section className="py-20 md:py-28">
          <div className="container mx-auto text-center px-4 md:px-6">
            <SplitText
              text={t('pricing.title')}
              className="text-4xl md:text-5xl font-bold font-korean tracking-tighter mb-4"
              delay={50}
              duration={0.6}
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              textAlign="center"
            />
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12 font-korean">
              {t('pricing.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="flex flex-col h-full bg-white/20 backdrop-blur-sm border-white/20 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
                <CardHeader className="pb-4">
                  <CardTitle className="font-korean text-2xl">{t('pricing.free.title')}</CardTitle>
                  <CardDescription className="font-korean">{t('pricing.free.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-korean">₩0</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {freePlanFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground font-korean">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full font-korean" variant="outline" asChild>
                    <Link href="/login" prefetch={true}>{t('pricing.free.cta')}</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-primary shadow-2xl relative flex flex-col h-full bg-white/20 backdrop-blur-sm border-white/20 dark:bg-white/5 dark:backdrop-blur-sm dark:border-primary/50">
                 <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold font-korean">
                        {t('pricing.pro.popular')}
                    </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="font-korean text-2xl">{t('pricing.pro.title')}</CardTitle>
                  <CardDescription className="font-korean">{t('pricing.pro.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-korean">{t('pricing.pro.price')}</span>
                    <span className="text-muted-foreground font-korean">{t('pricing.pro.period')}</span>
                  </div>
                   <ul className="space-y-3 text-left">
                    {proPlanFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground font-korean">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full font-korean" asChild>
                    <Link href="/login" prefetch={true}>{t('pricing.pro.cta')}</Link>
                  </Button>
                </CardFooter>
              </Card>
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
