"use client";

import {
  Calendar,
  CheckCircle,
  Download,
  MessageSquare,
  Search,
  User,
  XCircle,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth0 } from "@/contexts/auth0-context";
import { getSharedCustomAPIs, importCustomAPI } from "@/lib/api";

// 설명 텍스트를 적절한 길이로 자르는 함수
const truncateDescription = (description: string | undefined, maxLength: number = 60) => {
  if (!description) return '';
  return description.length > maxLength 
    ? description.substring(0, maxLength).trim() + '...'
    : description;
};

// 날짜를 간결한 형식으로 포맷하는 함수
const formatDate = (dateString: string | undefined) => {
  if (!dateString || dateString === '최근') return '최근';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}.${month}.${day}`;
  } catch (error) {
    return dateString;
  }
};

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
  const { getAccessToken, isAuthenticated } = useAuth0();
  const [searchTerm, setSearchTerm] = useState("");
  const [sharedApis, setSharedApis] = useState<SharedAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error'>('success');
  const [dialogMessage, setDialogMessage] = useState('');
  const [selectedApiName, setSelectedApiName] = useState('');

  useEffect(() => {
    loadSharedAPIs();
  }, [isAuthenticated]);

  const loadSharedAPIs = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const apis = await getSharedCustomAPIs(accessToken);
      setSharedApis(apis || []);
    } catch (error) {
      console.error('공유된 API 목록 조회 실패:', error);
      setSharedApis([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportAPI = async (customApiId: string, apiName: string) => {
    try {
      const accessToken = await getAccessToken();
      await importCustomAPI(customApiId, accessToken);
      setSelectedApiName(apiName);
      setDialogType('success');
      setDialogMessage('API를 성공적으로 가져왔습니다!');
      setShowDialog(true);
    } catch (error) {
      console.error('API 가져오기 실패:', error);
      setSelectedApiName(apiName);
      setDialogType('error');
      setDialogMessage('API 가져오기에 실패했습니다.');
      setShowDialog(true);
    }
  };

  const filteredApis = sharedApis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (api.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (api.author || api.creator || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 오늘 공유된 API 개수 계산
  const todaySharedCount = sharedApis.filter((api) => {
    const apiDate = api.shared || api.createdAt;
    if (!apiDate || apiDate === '최근') return false;
    
    try {
      const date = new Date(apiDate);
      const today = new Date();
      
      return date.toDateString() === today.toDateString();
    } catch (error) {
      return false;
    }
  }).length;

  return (
    <>
      {/* 상단 통계 박스 */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
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
            <CardTitle className="text-sm font-medium font-korean">오늘 공유된 API</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">{todaySharedCount}</div>
            <p className="text-xs text-muted-foreground font-korean">
              오늘 새로 공유된 API 개수
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
                <TableHead className="text-right font-korean whitespace-nowrap min-w-[60px]">{t('apiBoard.table.usageCount')}</TableHead>
                <TableHead className="text-right font-korean whitespace-nowrap">{t('apiBoard.table.sharedDate')}</TableHead>
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
                  <TableCell className="font-korean">
                    {truncateDescription(api.description) || '설명이 없습니다'}
                  </TableCell>
                  <TableCell className="text-right font-korean whitespace-nowrap min-w-[60px]">{(api.uses || api.usageCount || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground font-korean whitespace-nowrap">
                    {formatDate(api.shared || api.createdAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => {
                        console.log('API 객체:', api);
                        const customApiId = api.id || api.customApiId || '';
                        if (!customApiId) {
                          setSelectedApiName(api.name);
                          setDialogType('error');
                          setDialogMessage('API ID를 찾을 수 없습니다.');
                          setShowDialog(true);
                          return;
                        }
                        handleImportAPI(customApiId, api.name);
                      }}
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

      {/* 커스텀 결과 팝업 */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              {dialogType === 'success' ? (
                <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              ) : (
                <XCircle className="h-6 w-6 text-rose-600 dark:text-rose-400" />
              )}
              <DialogTitle className="font-korean text-lg">
                {dialogType === 'success' ? 'API 가져오기 성공' : 'API 가져오기 실패'}
              </DialogTitle>
            </div>
            <DialogDescription className="font-korean text-left">
              <span className="font-medium">{selectedApiName}</span> API에 대한 작업 결과입니다.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className={`p-4 rounded-lg border ${
              dialogType === 'success' 
                ? 'bg-blue-50/50 border-blue-200/50 dark:bg-blue-950/10 dark:border-blue-800/30' 
                : 'bg-rose-50/50 border-rose-200/50 dark:bg-rose-950/10 dark:border-rose-800/30'
            }`}>
              <p className={`font-korean ${
                dialogType === 'success' ? 'text-blue-800 dark:text-blue-200' : 'text-rose-800 dark:text-rose-200'
              }`}>
                {dialogMessage}
              </p>
              {dialogType === 'success' && (
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-2 font-korean opacity-80">
                  이제 대시보드의 "내 API" 섹션에서 확인하실 수 있습니다.
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)} className="font-korean">
              확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}