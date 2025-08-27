"use client";

import {
  Copy,
  Download,
  KeyRound,
  MessageSquare,
  Search,
  Share2,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { useLanguage } from "@/contexts/language-context";

const getSharedApis = (t: (key: string) => string) => [
  {
    name: t('api.movieRecommendation'),
    author: "user123",
    description: t('api.movieRecommendationDesc'),
    uses: 245,
    shared: `2 ${t('time.daysAgo')}`,
  },
  {
    name: t('api.cryptoPriceTracker'),
    author: "cryptodev",
    description: t('api.cryptoPriceTrackerDesc'),
    uses: 892,
    shared: `5 ${t('time.daysAgo')}`,
  },
  {
    name: t('api.socialMediaAnalyzer'),
    author: "dataanalyst",
    description: t('api.socialMediaAnalyzerDesc'),
    uses: 156,
    shared: `1 ${t('time.weeksAgo')}`,
  },
  {
    name: t('api.deliveryOptimizer'),
    author: "foodtech",
    description: t('api.deliveryOptimizerDesc'),
    uses: 67,
    shared: `3 ${t('time.daysAgo')}`,
  },
];

export default function APIBoard() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const sharedApis = getSharedApis(t);

  const filteredApis = sharedApis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      api.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyAPI = (apiName: string) => {
    // API 복사 로직
    alert(`${apiName}${t('apiBoard.importButton')}`);
  };

  return (
    <>
      {/* 상단 통계 박스 3개 */}
      <div className="grid gap-4 md:grid-cols-3 md:gap-8">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('apiBoard.myShared')}</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              +1 {t('apiBoard.thisMonth')}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('apiBoard.imported')}</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              +2 {t('apiBoard.thisMonth')}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('apiBoard.totalBoard')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +23 {t('apiBoard.thisWeek')}
            </p>
          </CardContent>
        </Card>
      </div>


      {/* 공유된 API 목록 */}
      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="font-headline">{t('apiBoard.sharedApis')}</CardTitle>
            <CardDescription>
              {t('apiBoard.description')}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('apiBoard.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('apiBoard.table.apiName')}</TableHead>
                <TableHead>{t('apiBoard.table.author')}</TableHead>
                <TableHead>{t('apiBoard.table.description')}</TableHead>
                <TableHead className="text-right">{t('apiBoard.table.usageCount')}</TableHead>
                <TableHead className="text-right">{t('apiBoard.table.sharedDate')}</TableHead>
                <TableHead>
                  <span className="sr-only">작업</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApis.map((api) => (
                <TableRow key={api.name}>
                  <TableCell className="font-medium">{api.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {api.author}
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {api.description}
                  </TableCell>
                  <TableCell className="text-right">{api.uses.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {api.shared}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyAPI(api.name)}
                      className="gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      {t('apiBoard.importButton')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredApis.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">{t('apiBoard.noResults')}</p>
              <p className="text-sm text-muted-foreground">
                {t('apiBoard.noResultsDescription')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}