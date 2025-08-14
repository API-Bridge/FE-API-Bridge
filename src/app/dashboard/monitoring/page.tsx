
import { BarChart, CheckCircle, Database, ShieldAlert, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const recentActivities = [
    { user: 'Alice', action: '"제품 피드" API 생성', timestamp: '2분 전', ip: '192.168.1.10' },
    { user: 'Bob', action: '"날씨 API"에 대한 새 키 생성', timestamp: '5분 전', ip: '203.0.113.25' },
    { user: 'Charlie', action: '"오래된 사용자 서비스" API 삭제', timestamp: '1시간 전', ip: '198.51.100.3' },
    { user: 'Alice', action: '"제품 피드" 설정 업데이트', timestamp: '2시간 전', ip: '192.168.1.10' },
    { user: 'David', action: '사용자 로그인', timestamp: '3시간 전', ip: '192.0.2.88' },
];

export default function MonitoringPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">시스템 상태</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">정상 작동</div>
            <p className="text-xs text-muted-foreground">마지막 확인: 1분 전</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API 소스</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">연결되었고 건강함</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 사용자</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84</div>
            <p className="text-xs text-muted-foreground">지난 15분 동안 온라인</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">보안 경고</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">오늘 중요한 경고 없음</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Grafana 대시보드</CardTitle>
            <CardDescription>실시간 시스템 메트릭 및 성능.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border">
              <div className="text-center text-muted-foreground">
                <BarChart className="h-16 w-16 mx-auto" />
                <p className="mt-4">Grafana 대시보드가 여기에 포함됩니다</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Kibana 대시보드</CardTitle>
            <CardDescription>로그 분석 및 애플리케이션 추적.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border">
              <div className="text-center text-muted-foreground">
                <BarChart className="h-16 w-16 mx-auto" />
                 <p className="mt-4">Kibana 대시보드가 여기에 포함됩니다</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader>
          <CardTitle className="font-headline">사용자 활동 스트림</CardTitle>
          <CardDescription>플랫폼 전반의 최근 사용자 활동 개요.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>사용자</TableHead>
                <TableHead>작업</TableHead>
                <TableHead>타임스탬프</TableHead>
                <TableHead>IP 주소</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{activity.user}</TableCell>
                  <TableCell>{activity.action}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.timestamp}</TableCell>
                  <TableCell className="text-muted-foreground">{activity.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
