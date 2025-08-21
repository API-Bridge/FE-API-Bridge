
import Link from "next/link";
import { ArrowRight, Check, CodeXml } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const freePlanFeatures = [
  "1 API 생성",
  "월 10,000건의 API 호출",
  "커뮤니티 지원",
];

const proPlanFeatures = [
  "무제한 API 생성",
  "월 1,000,000건의 API 호출",
  "AI+ 기능",
  "우선 이메일 지원",
  "고급 분석 기능",
];


export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
            <CodeXml className="h-7 w-7 text-primary" />
            <span>API 브릿지</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              기능
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-primary">
              가격
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              문서
            </Link>
          </nav>
          <div className="flex items-center gap-4">
             <Button variant="ghost" asChild>
              <Link href="/login" prefetch={true}>로그인</Link>
            </Button>
            <Button asChild>
              <Link href="/login" prefetch={true}>
                시작하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-28">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter mb-4">
              간단하고 투명한 가격
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-12">
              귀하의 필요에 맞는 플랜을 선택하고 지금 바로 구축을 시작하세요.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="font-headline text-2xl">Free</CardTitle>
                  <CardDescription>개인 프로젝트 및 학습용으로 시작하기에 좋습니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">₩0</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {freePlanFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/login" prefetch={true}>무료로 시작하기</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-primary shadow-2xl relative">
                 <div className="absolute top-0 -translate-y-1/2 w-full flex justify-center">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                        가장 인기있는
                    </div>
                </div>
                <CardHeader className="pb-4">
                  <CardTitle className="font-headline text-2xl">Pro</CardTitle>
                  <CardDescription>강력한 기능이 필요한 전문가 및 팀을 위한 플랜입니다.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold">₩9,990</span>
                    <span className="text-muted-foreground">/월</span>
                  </div>
                   <ul className="space-y-3 text-left">
                    {proPlanFeatures.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-primary" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link href="/login" prefetch={true}>Pro 플랜 시작하기</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

       <footer className="bg-card border-t">
        <div className="container mx-auto py-8 px-4 md:px-6 text-center text-muted-foreground text-sm">
          <p>&copy; 2024 API 브릿지. 모든 권리 보유.</p>
        </div>
      </footer>
    </div>
  );
}
