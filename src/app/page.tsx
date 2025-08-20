
import Link from "next/link";
import { ArrowRight, Server, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";

const features = [
  {
    icon: <Server className="w-10 h-10" />,
    title: "API 통합",
    description: "여러 공공 API를 하나의 인터페이스로 통합합니다.",
  },
  {
    icon: <Zap className="w-10 h-10" />,
    title: "빠른 처리",
    description: "최적화된 성능으로 빠른 데이터 처리를 제공합니다.",
  },
  {
    icon: <Shield className="w-10 h-10" />,
    title: "안전한 연결",
    description: "보안이 강화된 안전한 API 연결을 보장합니다.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <ThemeToggle />
          </div>
          <div className="flex items-center space-x-2">
            <Server className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              API Bridge
            </span>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="#features"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Docs
              </Link>
            </nav>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/login">
                  Get Started <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Connect Public APIs with{" "}
              <span className="text-gradient">API Bridge</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Simplify your development by connecting multiple public APIs through a single, unified interface. Build faster, integrate easier.
            </p>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/login">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24"
        >
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to connect and manage your APIs efficiently.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            {features.map((feature, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg border bg-background p-2">
                <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                  <div className="text-primary">{feature.icon}</div>
                  <div className="space-y-2">
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="container py-6 md:py-0">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Server className="h-6 w-6" />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built by API Bridge team. The source code is available on{" "}
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
