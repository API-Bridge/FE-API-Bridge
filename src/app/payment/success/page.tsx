"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [paymentInfo, setPaymentInfo] = useState({
    orderId: '',
    paymentKey: '',
    amount: ''
  });

  useEffect(() => {
    const orderId = searchParams.get('orderId') || '';
    const paymentKey = searchParams.get('paymentKey') || '';
    const amount = searchParams.get('amount') || '';

    setPaymentInfo({ orderId, paymentKey, amount });

    // 여기서 백엔드에 결제 승인 요청을 보낼 수 있습니다
    // confirmPayment(paymentKey, orderId, amount);
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">결제 완료</CardTitle>
          <CardDescription>
            API 브릿지 Pro 플랜 결제가 성공적으로 완료되었습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">주문번호:</span>
              <span className="font-medium">{paymentInfo.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">결제금액:</span>
              <span className="font-medium">₩{Number(paymentInfo.amount).toLocaleString()}</span>
            </div>
          </div>
          <div className="pt-4 space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">대시보드로 이동</Link>
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