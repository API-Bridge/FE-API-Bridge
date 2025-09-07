"use client";

import {
  Download,
  MessageSquare,
  Search,
  User,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { getSharedCustomAPIs } from "@/lib/api";

// 공유된 API 타입 정의
interface SharedAPI {
  id?: string;
  name: string;
  author?: string;
  authorName?: string;
  authorImage?: string;
  description?: string;
  uses?: number;
  shared?: string;
  usageCount?: number;
  createdAt?: string;
  creator?: string;
}

export default function APIBoard() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [sharedApis, setSharedApis] = useState<SharedAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSharedAPIs();
  }, []);

  const loadSharedAPIs = async () => {
    try {
      setIsLoading(true);
      const apis = await getSharedCustomAPIs();
      setSharedApis(apis || []);
    } catch (error) {
      console.error('공유된 API 목록 조회 실패:', error);
      setSharedApis([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApis = sharedApis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (api.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (api.author || api.creator || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* 상단 통계 박스 */}
      <div className="grid gap-4 md:grid-cols-3 md:gap-8">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('apiBoard.stats.sharedApis')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">{sharedApis.length}</div>
            <p className="text-xs text-muted-foreground font-korean">
              {t('apiBoard.stats.sharedApisDesc')}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('apiBoard.stats.activeUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">1,360</div>
            <p className="text-xs text-muted-foreground font-korean">
              {t('apiBoard.stats.activeUsersDesc')}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('apiBoard.stats.totalDownloads')}</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">12,234</div>
            <p className="text-xs text-muted-foreground font-korean">
              {t('apiBoard.stats.totalDownloadsDesc')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 공유된 API 목록 */}
      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="font-headline font-korean">{t('apiBoard.title')}</CardTitle>
            <CardDescription className="font-korean">
              {t('apiBoard.description')}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('apiBoard.searchPlaceholder')}
                className="pl-8 w-64 font-korean"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-korean">{t('dashboard.loading')}</p>
            </div>
          ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-korean">{t('apiBoard.table.apiName')}</TableHead>
                <TableHead className="font-korean">{t('apiBoard.table.author')}</TableHead>
                <TableHead className="font-korean">{t('apiBoard.table.description')}</TableHead>
                <TableHead className="text-right font-korean">{t('apiBoard.table.usageCount')}</TableHead>
                <TableHead className="text-right font-korean">{t('apiBoard.table.sharedDate')}</TableHead>
                <TableHead>
                  <span className="sr-only">{t('apiBoard.table.actions')}</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApis.map((api) => (
                <TableRow key={api.id || api.name}>
                  <TableCell className="font-medium font-korean">{api.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={api.authorImage || "https://placehold.co/40x40.png"} alt={`${api.authorName || api.creator} 프로필`} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium font-korean">{api.authorName || api.creator || '익명'}</span>
                        <span className="text-xs text-muted-foreground font-korean">@{api.author || api.creator || 'anonymous'}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate font-korean">
                    {api.description || '설명이 없습니다'}
                  </TableCell>
                  <TableCell className="text-right font-korean">{(api.uses || api.usageCount || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground font-korean">
                    {api.shared || api.createdAt || '최근'}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      <span className="font-korean">{t('apiBoard.useButton')}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          )}
          
          {!isLoading && filteredApis.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium font-korean">{t('apiBoard.noResults')}</p>
              <p className="text-sm text-muted-foreground font-korean">
                {t('apiBoard.noResultsDesc')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}