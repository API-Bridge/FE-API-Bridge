// 토스페이먼츠 SDK 타입 정의
declare global {
  interface Window {
    TossPayments: (clientKey: string) => TossPaymentsInstance;
  }
}

interface TossPaymentsInstance {
  requestPayment: (method: string, options: PaymentOptions) => Promise<any>;
  requestBillingAuth: (method: string, options: BillingAuthOptions) => Promise<any>;
  brandpay: {
    requestPayment: (options: BrandPayOptions) => Promise<any>;
  };
}

interface PaymentOptions {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
  customerEmail?: string;
  successUrl: string;
  failUrl: string;
}

interface BillingAuthOptions {
  customerKey: string;
  successUrl: string;
  failUrl: string;
}

interface BrandPayOptions {
  amount: number;
  orderId: string;
  orderName: string;
  successUrl: string;
  failUrl: string;
}

// 토스페이먼츠 SDK 초기화 (동적 클라이언트 키 지원)
export const initializeTossPayments = (clientKey?: string): TossPaymentsInstance | null => {
  if (typeof window === 'undefined' || !window.TossPayments) {
    console.error('토스페이먼츠 SDK가 로드되지 않았습니다.');
    return null;
  }

  const keyToUse = clientKey || process.env.NEXT_PUBLIC_TOSS_PAYMENTS_CLIENT_KEY;
  if (!keyToUse) {
    console.error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.');
    return null;
  }

  console.log('Initializing TossPayments with client key:', keyToUse.substring(0, 20) + '...');
  return window.TossPayments(keyToUse);
};

// 결제 요청 헬퍼 함수 (동적 클라이언트 키 지원)
export const requestPayment = async (
  amount: number,
  orderId: string,
  orderName: string,
  customerName?: string,
  customerEmail?: string,
  clientKey?: string
) => {
  const tossPayments = initializeTossPayments(clientKey);
  if (!tossPayments) {
    throw new Error('토스페이먼츠 SDK 초기화에 실패했습니다.');
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  
  return await tossPayments.requestPayment('카드', {
    amount,
    orderId,
    orderName,
    customerName,
    customerEmail,
    successUrl: `${baseUrl}/payment/success`,
    failUrl: `${baseUrl}/payment/fail`,
  });
};