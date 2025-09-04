"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { useLanguage } from "@/contexts/language-context";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
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
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Activity, 
  Database, 
  Settings,
  Shield,
  BarChart3
} from "lucide-react";

// 임시 데이터
const mockUsers = [
  { id: "1", name: "김철수", email: "kim@example.com", isAdmin: false, status: "active", joinDate: "2024-01-15" },
  { id: "2", name: "이영희", email: "lee@example.com", isAdmin: true, status: "active", joinDate: "2024-01-20" },
  { id: "3", name: "박민수", email: "park@example.com", isAdmin: false, status: "inactive", joinDate: "2024-02-01" },
];

const mockStats = {
  totalUsers: 156,
  totalApis: 42,
  totalCalls: "2,345,678",
  activeUsers: 134
};

export default function AdminPage() {
  const { user, isAdmin } = useUser();
  const { t } = useLanguage();
  const router = useRouter();

  // 관리자가 아닌 경우 접근 차단
  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, router]);

  // 로딩 중이거나 관리자가 아닌 경우
  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium font-korean">{t('admin.accessDenied')}</p>
          <p className="text-sm text-muted-foreground font-korean">{t('admin.adminOnly')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 상단 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3 md:gap-8">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('admin.totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">{mockStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground font-korean">
              +12 {t('admin.lastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('admin.totalApis')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">{mockStats.totalApis}</div>
            <p className="text-xs text-muted-foreground font-korean">
              +5 {t('admin.lastWeek')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('admin.totalCalls')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">{mockStats.totalCalls}</div>
            <p className="text-xs text-muted-foreground font-korean">
              +23% {t('admin.vsLastMonth')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 대시보드 카드 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader>
            <CardTitle className="font-korean">{t('monitoring.grafanaDashboard')}</CardTitle>
            <CardDescription className="font-korean">{t('monitoring.grafanaDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-96 bg-muted rounded-lg border flex flex-col items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2 font-korean">그라파나 대시보드</p>
                <p className="text-sm mb-6 font-korean">Node Exporter Full - 시스템 모니터링</p>
                <a
                  href="http://localhost:3000/d/rYdddlPWk/node-exporter-full?orgId=1&from=now-24h&to=now&timezone=browser&var-DS_PROMETHEUS=bewra9ybzyy2oc&var-job=kubernetes-service-endpoints&var-nodename=minikube&var-node=192.168.49.2:9100&var-diskdevices=%5Ba-z%5D%2B%7Cnvme%5B0-9%5D%2Bn%5B0-9%5D%2B%7Cmmcblk%5B0-9%5D%2B&refresh=1m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 font-medium transition-colors font-korean"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  대시보드 열기
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader>
            <CardTitle className="font-korean">{t('monitoring.kibanaDashboard')}</CardTitle>
            <CardDescription className="font-korean">{t('monitoring.kibanaDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto" />
                 <p className="mt-4 font-korean">{t('monitoring.kibanaEmbed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}