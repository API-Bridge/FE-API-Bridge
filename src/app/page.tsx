
import Link from "next/link";
import { ArrowRight, CodeXml, Layers, Rocket, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: <Rocket className="h-10 w-10 text-primary" />,
    title: "신속한 API 생성",
    description: "AI의 힘을 활용하여 복잡한 데이터 요구사항을 몇 분 만에 기능적인 API로 변환하세요.",
  },
  {
    icon: <Layers className="h-10 w-10 text-primary" />,
    title: "원활한 통합",
    description: "기존 데이터 소스 및 서비스와 손쉽게 연결하여 통합 워크플로우를 만드세요.",
  },
  {
    icon: <ShieldCheck className="h-10 w-10 text-primary" />,
    title: "강력한 보안",
    description: "안전하고 신뢰할 수 있는 API를 보장하기 위해 내장된 보안 기능으로 안심하고 구축하세요.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg font-headline">
            <CodeXml className="h-7 w-7 text-primary" />
            <span>API 브릿지</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              기능
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              가격
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              문서
            </Link>
          </nav>
          <div className="flex items-center gap-4">
             <Button variant="ghost" asChild>
              <Link href="/login">로그인</Link>
            </Button>
            <Button className="!bg-accent hover:!bg-accent/90 !text-accent-foreground" asChild>
              <Link href="/login">
                시작하기 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 md:py-32 lg:py-40">
          <div className="container mx-auto text-center px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter mb-6 text-primary">
              AI 기반 API 생성의 미래
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground mb-10">
              API 브릿지는 AI를 사용하여 데이터 요구사항을 즉시 안전하고 확장 가능한 API로 변환합니다. 코딩 시간을 줄이고 아이디어 실현에 더 많은 시간을 투자하세요.
            </p>
            <Button size="lg" className="!bg-primary hover:!bg-primary/90 !text-primary-foreground" asChild>
              <Link href="/login">
                무료로 시작하기 <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <section id="features" className="py-20 md:py-28 bg-muted/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold font-headline">강력한 기능으로 가득 찬</h2>
               <p className="max-w-2xl mx-auto text-muted-foreground mt-4">
                 API 브릿지가 개발 워크플로우를 어떻게 혁신할 수 있는지 알아보세요.
               </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="text-center bg-card">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        {feature.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="font-headline text-xl mb-2">{feature.title}</CardTitle>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
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
