'use client';

import React, { createContext, useContext, useState } from 'react';

// 한국어 / 영어
type Language = 'ko' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ko: {
    'theme.light': '밝게',
    'theme.dark': '어둡게',
    'theme.toggle': '테마 변경',
    'language.toggle': '언어 변경',
    'nav.features': '기능',
    'nav.pricing': '가격',
    'nav.docs': '문서',
    'nav.signin': '로그인',
    'nav.getstarted': '시작하기',
    'hero.title': '하나로 통합된',
    'hero.subtitle': 'API를 경험해보세요',
    'hero.description': '여러 공공 API를 단일 통합 인터페이스를 통해 연결하여 개발을 간소화하세요. 더 빠르게 구축하고, 더 쉽게 통합하세요.',
    'hero.cta': '시작하기',
    'hero.learn': '더 알아보기',
    'features.title': '기능',
    'features.description': 'API를 효율적으로 연결하고 관리하는 데 필요한 모든 것.',
    'feature.integration.title': 'API 통합',
    'feature.integration.description': '여러 공공 API를 하나의 인터페이스로 통합합니다.',
    'feature.performance.title': '빠른 처리',
    'feature.performance.description': '최적화된 성능으로 빠른 데이터 처리를 제공합니다.',
    'feature.security.title': '안전한 연결',
    'feature.security.description': '보안이 강화된 안전한 API 연결을 보장합니다.',
    'footer.built': 'API Bridge 팀에서 제작. 소스 코드는',
    'footer.github': 'GitHub',
    'footer.available': '에서 확인할 수 있습니다.',
    'brand': 'API 브릿지',
  },
  en: {
    'theme.light': 'Light',
    'theme.dark': 'Dark',
    'theme.toggle': 'Toggle theme',
    'language.toggle': 'Toggle language',
    'nav.features': 'Features',
    'nav.pricing': 'Pricing',
    'nav.docs': 'Docs',
    'nav.signin': 'Sign In',
    'nav.getstarted': 'Get Started',
    'hero.title': 'Experience Unified',
    'hero.subtitle': 'API Integration',
    'hero.description': 'Simplify your development by connecting multiple public APIs through a single, unified interface. Build faster, integrate easier.',
    'hero.cta': 'Get Started',
    'hero.learn': 'Learn More',
    'features.title': 'Features',
    'features.description': 'Everything you need to connect and manage your APIs efficiently.',
    'feature.integration.title': 'API Integration',
    'feature.integration.description': 'Integrate multiple public APIs through a single interface.',
    'feature.performance.title': 'Fast Processing',
    'feature.performance.description': 'Provides fast data processing with optimized performance.',
    'feature.security.title': 'Secure Connection',
    'feature.security.description': 'Ensures secure API connections with enhanced security.',
    'footer.built': 'Built by API Bridge team. The source code is available on',
    'footer.github': 'GitHub',
    'footer.available': '.',
    'brand': 'API Bridge',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};