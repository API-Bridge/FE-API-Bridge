
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CodeXml } from "lucide-react"

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="mx-auto max-w-sm w-full shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="inline-block bg-primary text-primary-foreground p-3 rounded-lg mb-4 mx-auto">
             <CodeXml className="h-8 w-8" />
          </div>
          <CardTitle className="text-3xl font-headline">API 브릿지</CardTitle>
          <CardDescription>계정에 로그인하려면 아래에 이메일을 입력하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input id="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <Label htmlFor="password">비밀번호</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline hover:text-primary">
                  비밀번호를 잊으셨나요?
                </Link>
              </div>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold" asChild>
              <Link href="/dashboard">로그인</Link>
            </Button>
            <Button variant="outline" className="w-full">
              Google로 로그인
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            계정이 없으신가요?{" "}
            <Link href="#" className="underline hover:text-primary">
              가입하기
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
