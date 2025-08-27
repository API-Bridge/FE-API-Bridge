
"use client";

import {
  Activity,
  ArrowUpRight,
  Copy,
  CreditCard,
  KeyRound,
  MoreVertical,
  Share2,
  CodeXml as ApiIcon,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLanguage } from "@/contexts/language-context";

const getApiData = (translateIfExists: (key: string, fallback: string) => string) => [
  {
    name: translateIfExists("api.weather", "날씨 데이터 API"),
    nameKey: "api.weather",
    status: "active",
    calls: "1,203,489",
    successRate: "99.8%",
    isShared: true,
    isImported: false,
    originalAuthor: null,
  },
  {
    name: translateIfExists("api.stockMarket", "주식 시장 피드"),
    nameKey: "api.stockMarket", 
    status: "active",
    calls: "8,456,123",
    successRate: "99.5%",
    isShared: false,
    isImported: false,
    originalAuthor: null,
  },
  {
    name: translateIfExists("api.locationService", "사용자 위치정보 서비스"),
    nameKey: "api.locationService",
    status: "inactive",
    calls: "50,123",
    successRate: "100%",
    isShared: false,
    isImported: true,
    originalAuthor: "locationdev",
  },
  {
    name: translateIfExists("api.productCatalog", "제품 카탈로그 API"),
    nameKey: "api.productCatalog",
    status: "active",
    calls: "2,345,678",
    successRate: "98.9%",
    isShared: true,
    isImported: false,
    originalAuthor: null,
  },
  {
    name: translateIfExists("api.paymentGateway", "결제 게이트웨이 브릿지"),
    nameKey: "api.paymentGateway",
    status: "error",
    calls: "987,654",
    successRate: "92.1%",
    isShared: false,
    isImported: true,
    originalAuthor: "paymentexpert",
  },
];

export default function Dashboard() {
  const { t, translateIfExists } = useLanguage();
  const apis = getApiData(translateIfExists);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [apiSharedStatus, setApiSharedStatus] = useState(
    apis.reduce((acc, api) => {
      acc[api.name] = api.isShared;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const toggleShare = (apiName: string) => {
    setApiSharedStatus(prev => ({
      ...prev,
      [apiName]: !prev[apiName]
    }));
  };

  const filteredApis = useMemo(() => {
    if (!searchQuery) return apis;
    return apis.filter(api => 
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (api.originalAuthor && api.originalAuthor.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [apis, searchQuery]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.totalApis')}</CardTitle>
            <ApiIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">
              +2 {t('dashboard.stats.lastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.activeKeys')}</CardTitle>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +3 {t('dashboard.stats.lastWeek')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.totalCalls')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234,567</div>
            <p className="text-xs text-muted-foreground">
              +19% {t('dashboard.stats.vsLastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.uptime')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.stats.allActiveApis')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="dark:bg-card/30 dark:backdrop-blur-md dark:border-white/10">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="font-headline">{t('dashboard.myApis')}</CardTitle>
            <CardDescription>
              {t('dashboard.myApis.description')}
            </CardDescription>
          </div>
          <div className="ml-auto">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('dashboard.search.placeholder') || "API 검색..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('dashboard.table.apiName')}</TableHead>
                <TableHead className="text-center">{t('dashboard.table.status')}</TableHead>
                <TableHead className="text-right">{t('dashboard.table.calls')}</TableHead>
                <TableHead className="text-center">{t('dashboard.table.sharing')}</TableHead>
                <TableHead>
                  <span className="sr-only">{t('dashboard.table.actions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApis.map((api) => (
                <TableRow key={api.name}>
                  <TableCell className="font-medium">
                    <div>
                      <div className="flex items-center gap-2">
                        {api.name}
                        {api.isImported ? (
                          <Badge variant="outline" className="text-xs bg-orange-50 text-orange-600 border-orange-200">
                            {t('dashboard.badge.imported')}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                            {t('dashboard.badge.myApi')}
                          </Badge>
                        )}
                      </div>
                      {api.isImported && api.originalAuthor && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {t('dashboard.originalAuthor')}: {api.originalAuthor}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        api.status === "active"
                          ? "default"
                          : api.status === "error"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {t(`dashboard.status.${api.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{api.calls}</TableCell>
                  <TableCell className="text-center">
                    {api.isImported ? (
                      <span className="text-sm text-muted-foreground font-medium">
                        {t('dashboard.share.imported')}
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        variant={apiSharedStatus[api.name] ? "default" : "secondary"}
                        onClick={() => toggleShare(api.name)}
                        className="gap-1 w-20"
                      >
                        <Share2 className="h-3 w-3" />
                        {apiSharedStatus[api.name] ? t('dashboard.share.sharing') : t('dashboard.share.share')}
                      </Button>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">{t('dashboard.menu.toggle')}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('dashboard.menu.actions')}</DropdownMenuLabel>
                        <DropdownMenuItem>{t('dashboard.menu.viewAnalytics')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('dashboard.menu.keyManagement')}</DropdownMenuItem>
                        <DropdownMenuItem>{t('dashboard.menu.settings')}</DropdownMenuItem>
                        <DropdownMenuLabel>{t('dashboard.menu.apiKey')}</DropdownMenuLabel>
                        <DropdownMenuItem className="flex justify-between items-center cursor-pointer">
                          sk_...a4f2 <Copy className="h-4 w-4 text-muted-foreground" />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
