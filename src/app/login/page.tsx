
"use client";

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CodeXml } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function LoginPage() {
  const { t } = useLanguage();

  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="inline-block bg-primary text-primary-foreground p-3 rounded-lg mb-4 mx-auto">
             <CodeXml className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-headline">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('login.email')}</Label>
              <Input id="email" type="email" placeholder={t('login.emailPlaceholder')} required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">{t('login.password')}</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline hover:text-primary">
                  {t('login.forgotPassword')}
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" asChild>
              <Link href="/dashboard">{t('login.signIn')}</Link>
            </Button>
            <Button variant="outline" className="w-full">
              {t('login.signInGoogle')}
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {t('login.noAccount')}{" "}
            <Link href="#" className="underline hover:text-primary">
              {t('login.signUp')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
