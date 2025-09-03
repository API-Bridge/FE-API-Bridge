
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CodeXml, Server } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import AnimatedBackground from "@/components/animated-background"

export default function LoginPage() {
  const { t } = useLanguage();
  const { theme } = useTheme();

  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && typeof window !== 'undefined' && 
     window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <AnimatedBackground />
      <main className="flex items-center justify-center flex-1 p-4 relative z-10">
        <Card className="mx-auto max-w-sm w-full shadow-2xl bg-white/20 backdrop-blur-sm border-white/20 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="space-y-1 text-center">
            <div className="inline-block bg-primary text-primary-foreground p-3 rounded-lg mb-4 mx-auto">
               <img src="/APIBridge.png" alt="API Bridge" className={`h-8 w-8 object-contain ${isDarkMode ? 'brightness-0 invert' : ''}`} />
            </div>
            <CardTitle className="text-3xl font-korean">{t('login.title')}</CardTitle>
            <CardDescription className="font-korean">{t('login.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-korean">{t('login.email')}</Label>
                <Input id="email" type="email" placeholder={t('login.emailPlaceholder')} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="font-korean">{t('login.password')}</Label>
                  <Link href="#" className="ml-auto inline-block text-sm underline hover:text-primary font-korean">
                    {t('login.forgotPassword')}
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold font-korean" asChild>
                <Link href="/dashboard">{t('login.signIn')}</Link>
              </Button>
              <Button variant="outline" className="w-full font-korean">
                {t('login.signInGoogle')}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm font-korean">
              {t('login.noAccount')}{" "}
              <Link href="#" className="underline hover:text-primary font-korean">
                {t('login.signUp')}
              </Link>
            </div>
          </CardContent>
        </Card>
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
  )
}
