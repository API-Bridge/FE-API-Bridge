'use client';

import { useEffect, useState } from 'react';
import { useAuth0 } from '@/contexts/auth0-context';
import { useRouter } from 'next/navigation';

export default function CallbackPage() {
  const { isLoading, isAuthenticated, auth0Client } = useAuth0();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 디버깅을 위한 로그
  useEffect(() => {
    console.log('Callback page - isLoading:', isLoading, 'isAuthenticated:', isAuthenticated);
    console.log('Current URL:', window.location.href);
    console.log('URL search params:', window.location.search);
  }, [isLoading, isAuthenticated]);

  // Auth0 context 처리 완료 대기 및 리디렉션
  useEffect(() => {
    if (!isLoading) {
      console.log('Auth0 loading completed, authenticated:', isAuthenticated);
      setRedirecting(true);
      setTimeout(() => {
        if (isAuthenticated) {
          // 결제 요청 로직 비활성화 - 항상 대시보드로 리다이렉트
          // const pendingPayment = localStorage.getItem('pendingPayment');
          // console.log('Callback: Checking pendingPayment:', pendingPayment);
          // if (pendingPayment) {
          //   // 결제가 대기 중이면 pricing 페이지로 리다이렉트
          //   console.log('Callback: Redirecting to pricing page for payment');
          //   router.push('/pricing');
          // } else {
          //   // 일반 로그인이면 dashboard로 리다이렉트
            console.log('Callback: Redirecting to dashboard (payment disabled)');
            router.push('/dashboard');
          // }
        } else {
          setError('로그인에 실패했습니다.');
          setTimeout(() => router.push('/'), 2000);
        }
      }, 1500);
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    // 30초 후에도 로딩 중이면 메인 페이지로 강제 리디렉션
    const timeout = setTimeout(() => {
      if (isLoading && !redirecting && !error) {
        console.error('Auth0 callback timeout - redirecting to main page');
        setError('로그인 처리 시간이 초과되었습니다.');
        setTimeout(() => router.push('/'), 2000);
      }
    }, 30000);

    return () => clearTimeout(timeout);
  }, [isLoading, redirecting, error, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold mb-3 font-korean">로그인 처리 중...</h2>
          <p className="text-muted-foreground font-korean">잠시만 기다려주세요.</p>
          <div className="mt-6">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-semibold mb-3 font-korean">
            {isAuthenticated ? '로그인 성공!' : '처리 완료'}
          </h2>
          <p className="text-muted-foreground font-korean">
            {isAuthenticated ? '대시보드로 이동합니다...' : '메인 페이지로 이동합니다...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-red-500 text-6xl mb-4">⚠</div>
          <h2 className="text-2xl font-semibold mb-3 font-korean text-red-600">오류 발생</h2>
          <p className="text-muted-foreground font-korean mb-4">{error}</p>
          <p className="text-sm text-muted-foreground font-korean">잠시 후 메인 페이지로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return null;
}