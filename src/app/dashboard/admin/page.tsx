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
          <p className="text-lg font-medium">{t('admin.accessDenied')}</p>
          <p className="text-sm text-muted-foreground">{t('admin.adminOnly')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 상단 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12 {t('admin.lastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalApis')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalApis}</div>
            <p className="text-xs text-muted-foreground">
              +5 {t('admin.lastWeek')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.totalCalls')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalCalls}</div>
            <p className="text-xs text-muted-foreground">
              +23% {t('admin.vsLastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('admin.activeUsers')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              86% {t('admin.allUsers')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 사용자 관리 테이블 */}
      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="font-headline">{t('admin.userManagement')}</CardTitle>
            <CardDescription>
              {t('admin.userManagementDescription')}
            </CardDescription>
          </div>
          <Button size="sm" className="ml-auto gap-1">
            <Settings className="h-4 w-4" />
            {t('admin.systemSettings')}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('admin.table.userName')}</TableHead>
                <TableHead>{t('admin.table.email')}</TableHead>
                <TableHead>{t('admin.table.role')}</TableHead>
                <TableHead>{t('admin.table.status')}</TableHead>
                <TableHead>{t('admin.table.joinDate')}</TableHead>
                <TableHead>
                  <span className="sr-only">작업</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.isAdmin ? "default" : "secondary"}>
                      {user.isAdmin ? t('admin.role.admin') : t('admin.role.user')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>
                      {user.status === "active" ? t('admin.status.active') : t('admin.status.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">
                      {t('admin.editButton')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}