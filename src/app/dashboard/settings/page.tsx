
"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/contexts/language-context"

export default function SettingsPage() {
  const { t } = useLanguage();
  return (
    <div className="grid gap-6">
      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader>
          <CardTitle className="font-headline">{t('settings.profile')}</CardTitle>
          <CardDescription>
            {t('settings.profileDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('settings.name')}</Label>
            <Input id="name" defaultValue="홍길동" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">{t('settings.email')}</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" disabled />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>{t('settings.save')}</Button>
        </CardFooter>
      </Card>

      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader>
          <CardTitle className="font-headline">{t('settings.security')}</CardTitle>
          <CardDescription>
            {t('settings.securityDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">{t('settings.enable2fa')}</Button>
          <Separator/>
          <div className="space-y-2">
            <Label htmlFor="current-password">{t('settings.currentPassword')}</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">{t('settings.newPassword')}</Label>
            <Input id="new-password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>{t('settings.updatePassword')}</Button>
        </CardFooter>
      </Card>

      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader>
          <CardTitle className="font-headline">{t('settings.notifications')}</CardTitle>
          <CardDescription>
            {t('settings.notificationsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="security-emails" defaultChecked />
                <label
                    htmlFor="security-emails"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {t('settings.securityEmails')}
                </label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="api-alerts" />
                <label
                    htmlFor="api-alerts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {t('settings.apiAlerts')}
                </label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="newsletter" />
                <label
                    htmlFor="newsletter"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    {t('settings.newsletter')}
                </label>
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>{t('settings.savePreferences')}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
