"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle } from 'lucide-react';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const [errorInfo, setErrorInfo] = useState({
    code: '',
    message: '',
    orderId: ''
  });

  useEffect(() => {
    const code = searchParams.get('code') || '';
    const message = searchParams.get('message') || '결제에 실패했습니다.';
    const orderId = searchParams.get('orderId') || '';

    setErrorInfo({ code, message, orderId });
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">결제 실패</CardTitle>
          <CardDescription>
            결제 처리 중 문제가 발생했습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            {errorInfo.orderId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">주문번호:</span>
                <span className="font-medium">{errorInfo.orderId}</span>
              </div>
            )}
            {errorInfo.code && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">오류코드:</span>
                <span className="font-medium">{errorInfo.code}</span>
              </div>
            )}
            <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
              {errorInfo.message}
            </div>
          </div>
          <div className="pt-4 space-y-2">
            <Button asChild className="w-full">
              <Link href="/pricing">다시 시도</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">홈으로 이동</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}