
"use client";

import Link from "next/link";
import { ArrowRight, Check, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex space-x-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>
          <Link href="/" className="flex items-center space-x-2">
            <Server className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              {t('brand')}
            </span>
          </Link>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/#features"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {t('nav.features')}
              </Link>
              <Link
                href="/pricing"
                prefetch={true}
                className="transition-colors hover:text-foreground/80 text-foreground"
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
        <section className="py-20 md:py-28">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter mb-4">
              {t('pricing.title')}
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
              {t('pricing.subtitle')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="flex flex-col h-full">
                <CardHeader className="pb-4">
                  <CardTitle className="font-headline text-2xl">{t('pricing.free.title')}</CardTitle>
                  <CardDescription>{t('pricing.free.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">₩0</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {freePlanFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/login" prefetch={true}>{t('pricing.free.cta')}</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-primary shadow-2xl relative flex flex-col h-full">
                 <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        {t('pricing.pro.popular')}
                    </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="font-headline text-2xl">{t('pricing.pro.title')}</CardTitle>
                  <CardDescription>{t('pricing.pro.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">{t('pricing.pro.price')}</span>
                    <span className="text-muted-foreground">{t('pricing.pro.period')}</span>
                  </div>
                   <ul className="space-y-3 text-left">
                    {proPlanFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/login" prefetch={true}>{t('pricing.pro.cta')}</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

       <footer className="bg-card border-t">
        <div className="container mx-auto py-8 px-4 md:px-6 text-center text-muted-foreground text-sm">
          <p>{t('pricing.footer')}</p>
        </div>
      </footer>
    </div>
  );
}
