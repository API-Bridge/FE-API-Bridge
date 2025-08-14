
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">프로필</CardTitle>
          <CardDescription>
            개인 정보를 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input id="name" defaultValue="홍길동" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" type="email" defaultValue="john.doe@example.com" disabled />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>저장</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">보안</CardTitle>
          <CardDescription>
            비밀번호 및 2단계 인증을 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline">2단계 인증 활성화</Button>
          <Separator/>
          <div className="space-y-2">
            <Label htmlFor="current-password">현재 비밀번호</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">새 비밀번호</Label>
            <Input id="new-password" type="password" />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>비밀번호 업데이트</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">알림</CardTitle>
          <CardDescription>
            알림 기본 설정을 관리합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
            <div className="flex items-center space-x-2">
                <Checkbox id="security-emails" defaultChecked />
                <label
                    htmlFor="security-emails"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    보안 이메일
                </label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="api-alerts" />
                <label
                    htmlFor="api-alerts"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    API 사용량 알림
                </label>
            </div>
             <div className="flex items-center space-x-2">
                <Checkbox id="newsletter" />
                <label
                    htmlFor="newsletter"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                    뉴스레터 및 업데이트
                </label>
            </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>기본 설정 저장</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
