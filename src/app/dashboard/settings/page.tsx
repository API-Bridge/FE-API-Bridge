
"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, User } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function SettingsPage() {
  const { t } = useLanguage();
  return (
    <div className="grid gap-6">
      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader>
          <CardTitle className="font-headline font-korean">{t('settings.profile')}</CardTitle>
          <CardDescription className="font-korean">
            {t('settings.profileDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 프로필 이미지 섹션 */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src="https://placehold.co/96x96.png" alt="프로필 이미지" />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                onClick={() => document.getElementById('profile-image-input')?.click()}
              >
                <Camera className="w-4 h-4" />
              </Button>
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  // 프로필 이미지 업로드 로직
                  console.log('Selected file:', e.target.files?.[0]);
                }}
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-korean">
                {t('settings.profileImageDescription') || '프로필 이미지를 변경하려면 카메라 아이콘을 클릭하세요'}
              </p>
            </div>
          </div>
          
          <Separator />
          
          {/* 기본 정보 섹션 */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-korean">{t('settings.name')}</Label>
              <Input id="name" defaultValue="홍길동" className="font-korean" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-korean">{t('settings.email')}</Label>
              <Input id="email" type="email" defaultValue="john.doe@example.com" disabled className="font-korean" />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button className="font-korean">{t('settings.save')}</Button>
        </CardFooter>
      </Card>

      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader>
          <CardTitle className="font-headline font-korean">{t('settings.security')}</CardTitle>
          <CardDescription className="font-korean">
            {t('settings.securityDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="font-korean">{t('settings.enable2fa')}</Button>
          <Separator/>
          <div className="space-y-2">
            <Label htmlFor="current-password" className="font-korean">{t('settings.currentPassword')}</Label>
            <Input id="current-password" type="password" className="font-korean" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password" className="font-korean">{t('settings.newPassword')}</Label>
            <Input id="new-password" type="password" className="font-korean" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button className="font-korean">{t('settings.updatePassword')}</Button>
        </CardFooter>
      </Card>

      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader>
          <CardTitle className="font-headline font-korean">{t('settings.notifications')}</CardTitle>
          <CardDescription className="font-korean">
            {t('settings.notificationsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="security-emails" defaultChecked />
                <label
                    htmlFor="security-emails"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-korean"
                >
                    {t('settings.securityEmails')}
                </label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="api-alerts" />
                <label
                    htmlFor="api-alerts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-korean"
                >
                    {t('settings.apiAlerts')}
                </label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="newsletter" />
                <label
                    htmlFor="newsletter"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-korean"
                >
                    {t('settings.newsletter')}
                </label>
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button className="font-korean">{t('settings.savePreferences')}</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
