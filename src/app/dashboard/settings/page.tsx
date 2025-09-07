
"use client";

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Camera, User, Key, Plus, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useState, useEffect } from "react"
import { registerUserAIKey, getUserAIKeys, deleteUserAIKey } from "@/lib/api"

// AI 키 타입 정의
interface AIKey {
  id?: string;
  name?: string;
  secretName?: string;
  description?: string;
}

export default function SettingsPage() {
  const { t } = useLanguage();
  
  // 등록된 AI 키 목록
  const [registeredKeys, setRegisteredKeys] = useState<AIKey[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);

  // 폼 입력 상태
  const [formData, setFormData] = useState({
    secretName: '',
    secretValue: '',
    description: ''
  });

  // 오류 상태
  const [errors, setErrors] = useState({
    secretName: '',
    secretValue: ''
  });

  // 등록 중 상태
  const [isRegistering, setIsRegistering] = useState(false);

  // 페이지 로드 시 AI 키 목록 조회
  useEffect(() => {
    loadAIKeys();
  }, []);

  const loadAIKeys = async () => {
    try {
      setIsLoadingKeys(true);
      const keys = await getUserAIKeys();
      setRegisteredKeys(keys || []);
    } catch (error) {
      console.error('AI 키 목록 조회 실패:', error);
      // 실패 시 빈 배열로 설정
      setRegisteredKeys([]);
    } finally {
      setIsLoadingKeys(false);
    }
  };

  const removeKey = async (keyId: string) => {
    if (!confirm('이 AI 키를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteUserAIKey(keyId);
      await loadAIKeys(); // 삭제 후 목록 새로고침
      console.log('AI 키가 성공적으로 삭제되었습니다');
    } catch (error) {
      console.error('AI 키 삭제 실패:', error);
      alert('AI 키 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const validateForm = () => {
    const newErrors = { secretName: '', secretValue: '' };
    let isValid = true;

    if (!formData.secretName.trim()) {
      newErrors.secretName = t('settings.aiKey.validation.keyNameRequired');
      isValid = false;
    }

    if (!formData.secretValue.trim()) {
      newErrors.secretValue = t('settings.aiKey.validation.apiKeyRequired');
      isValid = false;
    }

    if (registeredKeys.some((key: AIKey) => (key.name || key.secretName || '').toLowerCase() === formData.secretName.toLowerCase())) {
      newErrors.secretName = t('settings.aiKey.validation.keyNameExists');
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsRegistering(true);
    
    try {
      await registerUserAIKey(
        formData.secretName,
        formData.secretValue,
        formData.description
      );

      // 등록 성공 후 목록 새로고침
      await loadAIKeys();

      // 폼 초기화
      setFormData({ secretName: '', secretValue: '', description: '' });
      setErrors({ secretName: '', secretValue: '' });

      console.log('AI 키가 성공적으로 등록되었습니다');
      alert('AI 키가 성공적으로 등록되었습니다!');

    } catch (error) {
      console.error('AI 키 등록 실패:', error);
      alert('AI 키 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsRegistering(false);
    }
  };

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
          {/* 프로필 정보 섹션 */}
          <div className="flex items-center gap-8">
            {/* 왼쪽: 기본 정보 섹션 */}
            <div className="w-1/2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-korean">{t('settings.name')}</Label>
                <Input id="name" defaultValue="홍길동" className="font-korean" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-korean">{t('settings.email')}</Label>
                <Input id="email" type="email" defaultValue="john.doe@example.com" disabled className="font-korean" />
              </div>
            </div>
            
            {/* 오른쪽: 프로필 이미지 섹션 */}
            <div className="w-1/2 flex flex-col items-center justify-center space-y-4">
              <div className="relative">
                <Avatar className="w-40 h-40">
                  <AvatarImage src="https://placehold.co/160x160.png" alt="프로필 이미지" />
                  <AvatarFallback>
                    <User className="w-20 h-20" />
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -bottom-2 -right-2 rounded-full w-12 h-12 p-0"
                  onClick={() => document.getElementById('profile-image-input')?.click()}
                >
                  <Camera className="w-6 h-6" />
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
              <div className="text-center max-w-[160px]">
                <p className="text-xs text-muted-foreground font-korean">
                  {t('settings.profileImageDescription') || '프로필 이미지를 변경하려면 카메라 아이콘을 클릭하세요'}
                </p>
              </div>
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
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <Button className="font-korean">변경</Button>
        </CardFooter>
      </Card>

      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                <CardTitle className="font-headline font-korean">{t('settings.aiKey.title')}</CardTitle>
              </div>
              <CardDescription className="font-korean mt-1">
                {t('settings.aiKey.description')}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 max-w-xs">
              {isLoadingKeys ? (
                <span className="text-xs text-muted-foreground font-korean">{t('settings.aiKey.loading')}</span>
              ) : registeredKeys.length > 0 ? (
                registeredKeys.map((key) => (
                  <Badge 
                    key={key.id || key.secretName || key.name} 
                    variant="secondary" 
                    className="flex items-center gap-1 px-3 py-2 text-base"
                  >
                    {key.secretName || key.name}
                    <button
                      onClick={() => removeKey(key.id || key.secretName || key.name || '')}
                      className="ml-1 hover:bg-destructive/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground font-korean">{t('settings.aiKey.noKeys')}</span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secret-name" className="font-korean">{t('settings.aiKey.form.keyName')}</Label>
            <Input 
              id="secret-name" 
              placeholder={t('settings.aiKey.form.keyNamePlaceholder')} 
              className={`font-korean ${errors.secretName ? 'border-red-500' : ''}`}
              value={formData.secretName}
              onChange={(e) => setFormData(prev => ({ ...prev, secretName: e.target.value }))}
            />
            {errors.secretName && (
              <p className="text-xs text-red-500 font-korean">{errors.secretName}</p>
            )}
            <p className="text-xs text-muted-foreground font-korean">
              {t('settings.aiKey.form.keyNameHelp')}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secret-value" className="font-korean">{t('settings.aiKey.form.apiKey')}</Label>
            <Input 
              id="secret-value" 
              type="password" 
              placeholder={t('settings.aiKey.form.apiKeyPlaceholder')} 
              className={`font-korean ${errors.secretValue ? 'border-red-500' : ''}`}
              value={formData.secretValue}
              onChange={(e) => setFormData(prev => ({ ...prev, secretValue: e.target.value }))}
            />
            {errors.secretValue && (
              <p className="text-xs text-red-500 font-korean">{errors.secretValue}</p>
            )}
            <p className="text-xs text-muted-foreground font-korean">
              {t('settings.aiKey.form.apiKeyHelp')}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="secret-description" className="font-korean">{t('settings.aiKey.form.description')}</Label>
            <Textarea 
              id="secret-description" 
              placeholder={t('settings.aiKey.form.descriptionPlaceholder')} 
              className="font-korean resize-none" 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button 
            className="font-korean" 
            onClick={handleRegister}
            disabled={isRegistering}
          >
            <Plus className="w-4 h-4 mr-2" />
            {isRegistering ? t('settings.aiKey.form.registering') : t('settings.aiKey.form.registerButton')}
          </Button>
        </CardFooter>
      </Card>

    </div>
  )
}
