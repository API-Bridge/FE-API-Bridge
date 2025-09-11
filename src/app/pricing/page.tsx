
"use client";

import Link from "next/link";
import { ArrowRight, Check, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/contexts/language-context";
import { useTheme } from "@/contexts/theme-context";
import { useAuth0 } from "@/contexts/auth0-context";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { subscribeToTossPayment } from "@/lib/api";
import { requestPayment } from "@/lib/toss-payments";
import { useState, useEffect } from "react";

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
  const { theme } = useTheme();
  const { isAuthenticated, login, getAccessToken, isLoading: authLoading, auth0Client } = useAuth0();
  const freePlanFeatures = getFreePlanFeatures(t);
  const proPlanFeatures = getProPlanFeatures(t);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRedirectToPayment, setShouldRedirectToPayment] = useState(false);

  const isDarkMode = theme === 'dark' || 
    (theme === 'system' && typeof window !== 'undefined' && 
     window.matchMedia('(prefers-color-scheme: dark)').matches);

  // 결제 요청 로직 비활성화됨
  // useEffect(() => {
  //   if (shouldRedirectToPayment && isAuthenticated && !authLoading) {
  //     setShouldRedirectToPayment(false);
  //     handleProPlanSubscribe();
  //   }
  // }, [isAuthenticated, authLoading, shouldRedirectToPayment]);

  // Auth0 상태 디버깅
  useEffect(() => {
    console.log('Auth0 state changed:', { isAuthenticated, authLoading });
  }, [isAuthenticated, authLoading]);

  // 자동 결제 로직 비활성화됨
  // useEffect(() => {
  //   const checkPendingPayment = async () => {
  //     if (isAuthenticated && !authLoading) {
  //       const pendingPayment = localStorage.getItem('pendingPayment');
  //       console.log('Checking pending payment:', pendingPayment);
  //       if (pendingPayment === 'PRO') {
  //         localStorage.removeItem('pendingPayment');
  //         console.log('Starting pending payment process');
  //         // 약간의 지연을 두어 Auth0 상태가 완전히 안정화되기를 기다림
  //         setTimeout(() => {
  //           handleProPlanSubscribe();
  //         }, 500);
  //       }
  //     }
  //   };
  //   
  //   checkPendingPayment();
  // }, [isAuthenticated, authLoading]);

  const handleProPlanSubscribe = async () => {
    try {
      console.log('handleProPlanSubscribe called', { isAuthenticated, authLoading });
      setIsLoading(true);
      
      // Auth0 로딩 중이면 잠시 대기
      if (authLoading) {
        console.log('Auth0 still loading, waiting...');
        setIsLoading(false);
        return;
      }
      
      // 로그인 상태를 한 번 더 확인 (직접 체크)
      let actualAuthState = isAuthenticated;
      if (!isAuthenticated && auth0Client) {
        try {
          console.log('Double-checking authentication state...');
          actualAuthState = await auth0Client.isAuthenticated();
          console.log('Direct auth check result:', actualAuthState);
        } catch (error) {
          console.error('Error checking auth state:', error);
        }
      }
      
      // 로그인 상태 확인
      if (!actualAuthState) {
        console.log('User not authenticated, redirecting to login');
        // 결제 요청 비활성화 - localStorage 저장하지 않음
        // localStorage.setItem('pendingPayment', 'PRO');
        console.log('Payment request disabled - not saving to localStorage');
        // Auth0 로그인으로 리다이렉트
        await login();
        return;
      }

      console.log('User is authenticated, proceeding with payment');
      
      // Auth0에서 액세스 토큰 가져오기
      const accessToken = await getAccessToken();
      console.log('Got access token:', !!accessToken);
      console.log('Access token (first 50 chars):', accessToken.substring(0, 50));
      
      // 백엔드에 구독 요청을 먼저 보내서 결제 정보를 생성
      console.log('Calling backend subscription API');
      const response = await subscribeToTossPayment('PRO', accessToken);
      console.log('구독 요청 성공:', response);
      
      // 백엔드 응답에서 결제 정보 추출
      const paymentData = response.data;
      console.log('Payment data from backend:', paymentData);
      
      // 토스페이먼츠 SDK로 결제 요청 (백엔드에서 받은 데이터 사용)
      console.log('Initiating Toss Payments with backend data', {
        amount: paymentData.amount,
        orderId: paymentData.orderId,
        orderName: paymentData.orderName
      });
      
      await requestPayment(
        paymentData.amount,
        paymentData.orderId,
        paymentData.orderName,
        paymentData.customerName,
        paymentData.customerEmail,
        paymentData.clientKey
      );
      
    } catch (error) {
      console.error('결제 요청 실패:', error);
      alert('결제 요청에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      <AnimatedBackground />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center relative">
          <Link href="/" className="flex items-center space-x-2">
            <img src="/APIBridge.png" alt="API Bridge" className={`h-6 w-6 object-contain ${isDarkMode ? 'brightness-0 invert' : ''}`} />
            <span className="hidden font-bold sm:inline-block">
              {t('brand')}
            </span>
          </Link>
          
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
            {isAuthenticated ? (
              <Button size="sm" asChild>
                <Link href="/dashboard" prefetch={true}>
                  대시보드 <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <Button size="sm" onClick={login}>
                {t('nav.getstarted')} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            )}
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
                  {isAuthenticated ? (
                    <Button className="w-full font-korean" variant="outline" asChild>
                      <Link href="/dashboard" prefetch={true}>{t('pricing.free.cta')}</Link>
                    </Button>
                  ) : (
                    <Button className="w-full font-korean" variant="outline" onClick={login}>
                      {t('pricing.free.cta')}
                    </Button>
                  )}
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
                  <Button 
                    className="w-full font-korean" 
                    onClick={handleProPlanSubscribe}
                    disabled={isLoading || authLoading}
                  >
                    {isLoading ? '처리 중...' : authLoading ? '로딩 중...' : t('pricing.pro.cta')}
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
  );
}
