'use client';

import * as React from 'react';
import { Globe } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/language-context';

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('language.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage('ko')}>
          <div className="flex items-center justify-between w-full">
            <span>한국어</span>
            {language === 'ko' && (
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('en')}>
          <div className="flex items-center justify-between w-full">
            <span>English</span>
            {language === 'en' && (
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ja')}>
          <div className="flex items-center justify-between w-full">
            <span>日本語</span>
            {language === 'ja' && (
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('zh')}>
          <div className="flex items-center justify-between w-full">
            <span>中文</span>
            {language === 'zh' && (
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage('ru')}>
          <div className="flex items-center justify-between w-full">
            <span>Русский</span>
            {language === 'ru' && (
              <div className="w-2 h-2 bg-green-500 rounded-full ml-2" />
            )}
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}