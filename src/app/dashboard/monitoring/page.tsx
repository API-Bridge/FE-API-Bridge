
"use client";

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
import { useLanguage } from "@/contexts/language-context";

const getRecentActivities = (t: (key: string) => string) => [
    { user: 'Alice', action: t('action.createProduct'), timestamp: `2 ${t('time.minutesAgo')}`, ip: '192.168.1.10' },
    { user: 'Bob', action: t('action.createKey'), timestamp: `5 ${t('time.minutesAgo')}`, ip: '203.0.113.25' },
    { user: 'Charlie', action: t('action.deleteApi'), timestamp: `1 ${t('time.hoursAgo')}`, ip: '198.51.100.3' },
    { user: 'Alice', action: t('action.updateSettings'), timestamp: `2 ${t('time.hoursAgo')}`, ip: '192.168.1.10' },
    { user: 'David', action: t('action.userLogin'), timestamp: `3 ${t('time.hoursAgo')}`, ip: '192.0.2.88' },
];

export default function MonitoringPage() {
  const { t } = useLanguage();
  const recentActivities = getRecentActivities(t);
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('monitoring.systemStatus')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary font-korean">{t('monitoring.statusHealthy')}</div>
            <p className="text-xs text-muted-foreground font-korean">{t('monitoring.lastCheck')}: 1분 전</p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('monitoring.apiSources')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">12</div>
            <p className="text-xs text-muted-foreground font-korean">{t('monitoring.connectedHealthy')}</p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('monitoring.activeUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">84</div>
            <p className="text-xs text-muted-foreground font-korean">{t('monitoring.onlineLast15')}</p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('monitoring.securityAlerts')}</CardTitle>
            <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">0</div>
            <p className="text-xs text-muted-foreground font-korean">{t('monitoring.noCriticalAlerts')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader>
            <CardTitle className="font-headline font-korean">{t('monitoring.grafanaDashboard')}</CardTitle>
            <CardDescription className="font-korean">{t('monitoring.grafanaDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border">
              <div className="text-center text-muted-foreground">
                <BarChart className="h-16 w-16 mx-auto" />
                <p className="mt-4 font-korean">{t('monitoring.grafanaEmbed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader>
            <CardTitle className="font-headline font-korean">{t('monitoring.kibanaDashboard')}</CardTitle>
            <CardDescription className="font-korean">{t('monitoring.kibanaDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border">
              <div className="text-center text-muted-foreground">
                <BarChart className="h-16 w-16 mx-auto" />
                 <p className="mt-4 font-korean">{t('monitoring.kibanaEmbed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

       <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader>
          <CardTitle className="font-headline font-korean">{t('monitoring.userActivity')}</CardTitle>
          <CardDescription className="font-korean">{t('monitoring.userActivityDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-korean">{t('monitoring.table.user')}</TableHead>
                <TableHead className="font-korean">{t('monitoring.table.action')}</TableHead>
                <TableHead className="font-korean">{t('monitoring.table.timestamp')}</TableHead>
                <TableHead className="font-korean">{t('monitoring.table.ipAddress')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivities.map((activity, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium font-korean">{activity.user}</TableCell>
                  <TableCell className="font-korean">{activity.action}</TableCell>
                  <TableCell className="text-muted-foreground font-korean">{activity.timestamp}</TableCell>
                  <TableCell className="text-muted-foreground font-korean">{activity.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
