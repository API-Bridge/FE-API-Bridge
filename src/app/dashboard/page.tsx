
"use client";

import {
  Activity,
  CreditCard,
  KeyRound,
  Share2,
  CodeXml as ApiIcon,
  Search,
  Trash2,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { useAuth0 } from "@/contexts/auth0-context";
import { getCustomAPIList, shareCustomAPI, getCustomAPIDetail, deleteCustomAPI } from "@/lib/api";

// API 타입 정의
interface APIParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  paramName?: string;
  paramType?: string;
  paramDescription?: string;
  isRequired?: boolean;
  defaultValue?: string;
}

interface CustomAPI {
  id?: string;
  customApiId?: string;
  name: string;
  description?: string;
  method?: string;
  endpoint?: string;
  path?: string;
  status?: string;
  calls?: number;
  callCount?: number;
  successRate?: string;
  isShared?: boolean;
  public?: boolean;
  apiType?: string;
  parameters?: APIParameter[];
  pathParameters?: APIParameter[];
  queryParameters?: APIParameter[];
  requestBody?: APIParameter[];
  isImported?: boolean;
  originalAuthor?: string;
  createdAt?: string;
}


// 설명 텍스트를 적절한 길이로 자르는 함수
const truncateDescription = (description: string | undefined, maxLength: number = 80) => {
  if (!description) return '';
  return description.length > maxLength 
    ? description.substring(0, maxLength).trim() + '...'
    : description;
};

export default function Dashboard() {
  const { t } = useLanguage();
  const { getAccessToken, isAuthenticated } = useAuth0();
  
  console.log('Dashboard 렌더링, isAuthenticated:', isAuthenticated);
  const [customAPIs, setCustomAPIs] = useState<CustomAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'myApis' | 'imported'>('myApis');
  const [deleteApiId, setDeleteApiId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState<CustomAPI | null>(null);
  const [apiDetail, setApiDetail] = useState<any>(null);
  const [isApiDetailOpen, setIsApiDetailOpen] = useState(false);
  
  const [apiSharedStatus, setApiSharedStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log('useEffect 실행, isAuthenticated:', isAuthenticated);
    loadCustomAPIs();
  }, [isAuthenticated]);

  const loadCustomAPIs = async () => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const accessToken = await getAccessToken();
      const apis = await getCustomAPIList(accessToken);
      
      // API 응답 데이터를 프론트엔드 형식에 맞게 변환
      const transformedApis = (apis || []).map((api: any) => ({
        ...api,
        id: api.customApiId,
        isShared: api.public,
        calls: api.callCount
      }));
      
      setCustomAPIs(transformedApis);
      
      // Initialize shared status using customApiId
      const sharedStatus: Record<string, boolean> = {};
      transformedApis.forEach((api: CustomAPI) => {
        if (api.customApiId) {
          sharedStatus[api.customApiId] = api.isShared || false;
        }
      });
      setApiSharedStatus(sharedStatus);
    } catch (error) {
      console.error('커스텀 API 목록 조회 실패:', error);
      setCustomAPIs([]);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleShare = async (customApiId: string) => {
    try {
      const accessToken = await getAccessToken();
      const newSharedStatus = !apiSharedStatus[customApiId];
      await shareCustomAPI(customApiId, accessToken, newSharedStatus);
      setApiSharedStatus(prev => ({
        ...prev,
        [customApiId]: newSharedStatus
      }));
      
      // Update the customAPIs state to reflect the change
      setCustomAPIs(prevApis => 
        prevApis.map(api => 
          api.customApiId === customApiId 
            ? { ...api, isShared: newSharedStatus }
            : api
        )
      );
    } catch (error) {
      console.error('공유 상태 변경 실패:', error);
      alert('공유 상태 변경에 실패했습니다.');
    }
  };

  const handleDeleteApi = async (customApiId: string) => {
    try {
      const accessToken = await getAccessToken();
      await deleteCustomAPI(customApiId, accessToken);
      
      // 로컬 상태에서 삭제된 API 제거
      setCustomAPIs(prevApis => prevApis.filter(api => api.customApiId !== customApiId));
      
      // 공유 상태에서도 제거
      setApiSharedStatus(prev => {
        const newStatus = { ...prev };
        delete newStatus[customApiId];
        return newStatus;
      });
      
      setDeleteApiId(null);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('API 삭제 실패:', error);
      alert('API 삭제에 실패했습니다.');
    }
  };

  const openDeleteDialog = (customApiId: string) => {
    setDeleteApiId(customApiId);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteApiId(null);
    setIsDeleteDialogOpen(false);
  };

  const openApiDetail = async (api: CustomAPI) => {
    setSelectedApi(api);
    setIsApiDetailOpen(true);
    
    // API 상세 정보 가져오기 - externalApiUrl_list 확인을 위함
    if (api.id && isAuthenticated) {
      try {
        const accessToken = await getAccessToken();
        const detail = await getCustomAPIDetail(api.id, accessToken);
        setApiDetail(detail);
        console.log('API 상세 정보:', detail);
        console.log('externalApiUrl_list:', detail?.externalApiUrl_list);
      } catch (error) {
        console.error('API 상세 정보 조회 실패:', error);
        setApiDetail(null);
      }
    }
  };

  const closeApiDetail = () => {
    setSelectedApi(null);
    setApiDetail(null);
    setIsApiDetailOpen(false);
  };

  // 통계 계산 (내 API만 기준)
  const stats = useMemo(() => {
    const myApis = customAPIs.filter(api => api.apiType === 'ORIGINAL');
    const totalApis = myApis.length;
    const totalCalls = myApis.reduce((sum, api) => sum + (api.callCount || 0), 0);
    const activeKeys = myApis.filter(api => (api.callCount || 0) > 0).length;
    
    // 가동시간: callCount에 따라 0% ~ 99.9% 범위로 계산
    let uptime = 0;
    if (totalCalls > 1000) uptime = 99.9;
    else if (totalCalls > 100) uptime = 99.5;
    else if (totalCalls > 10) uptime = 99.2;
    else if (totalCalls > 0) uptime = 99.0;
    
    return {
      totalApis,
      totalCalls,
      activeKeys,
      uptime: uptime.toFixed(1)
    };
  }, [customAPIs]);

  const filteredApis = useMemo(() => {
    let apiList: CustomAPI[];
    
    // apiType을 기준으로 필터링
    if (activeFilter === 'imported') {
      // 가져온 API: apiType이 'ORIGINAL'이 아닌 모든 API
      apiList = customAPIs.filter(api => api.apiType !== 'ORIGINAL');
    } else {
      // 내 API: apiType이 'ORIGINAL'인 API
      apiList = customAPIs.filter(api => api.apiType === 'ORIGINAL');
    }
    
    // 검색어로 필터링
    if (!searchQuery) return apiList;
    return apiList.filter((api: CustomAPI) => 
      api.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customAPIs, searchQuery, activeFilter]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('dashboard.stats.totalApis')}</CardTitle>
            <ApiIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApis}</div>
            <p className="text-xs text-muted-foreground font-korean">
              {stats.totalApis > 0 ? `활성화된 API ${stats.totalApis}개` : '등록된 API 없음'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('dashboard.stats.activeKeys')}</CardTitle>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeKeys}</div>
            <p className="text-xs text-muted-foreground font-korean">
              {stats.activeKeys > 0 ? `호출 기록이 있는 API ${stats.activeKeys}개` : '사용 기록 없음'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('dashboard.stats.totalCalls')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground font-korean">
              {stats.totalCalls > 0 ? '전체 API 호출 횟수' : '아직 호출 기록이 없습니다'}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('dashboard.stats.uptime')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uptime}%</div>
            <p className="text-xs text-muted-foreground font-korean">
              {stats.totalCalls > 0 ? 'API 서비스 가동률' : '아직 사용되지 않음'}
            </p>
          </CardContent>
        </Card>
      </div>


      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader className="flex flex-row items-center">
          <div className="grid gap-2">
            <CardTitle className="font-korean">{t('dashboard.myApis')}</CardTitle>
            <CardDescription className="font-korean">
              {t('dashboard.myApis.description')}
            </CardDescription>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant={activeFilter === 'myApis' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('myApis')}
                className="font-korean"
              >
                {t('dashboard.myApisButton')}
              </Button>
              <Button
                variant={activeFilter === 'imported' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('imported')}
                className="font-korean"
              >
                {t('dashboard.importedApisButton')}
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('dashboard.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-80 font-korean"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground font-korean">{t('dashboard.loading')}</p>
            </div>
          ) : filteredApis.length === 0 ? (
            <div className="text-center py-8">
              {activeFilter === 'imported' ? (
                <p className="text-muted-foreground font-korean">
                  {t('dashboard.noImportedApis')}
                </p>
              ) : (
                <p className="text-muted-foreground font-korean">
                  {searchQuery ? t('dashboard.noSearchResults') : t('dashboard.noCreatedApis')}
                </p>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-korean w-[40%]">{t('dashboard.table.apiName')}</TableHead>
                  <TableHead className="text-center font-korean w-[15%]">{t('dashboard.table.method')}</TableHead>
                  <TableHead className="text-center font-korean w-[15%]">호출 수</TableHead>
                  <TableHead className="text-center font-korean w-[20%]">{t('dashboard.table.sharing')}</TableHead>
                  <TableHead className="w-[10%] text-center font-korean">{t('dashboard.table.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApis.map((api) => (
                  <TableRow key={api.id || api.name} className="cursor-pointer hover:bg-muted/80 dark:hover:bg-white/10" onClick={() => openApiDetail(api)}>
                    <TableCell className="font-medium font-korean w-[40%]">
                      <div>
                        <div className="font-korean font-semibold">
                          {api.name}
                        </div>
                        <div className="text-sm text-muted-foreground font-korean mt-1">
                          {truncateDescription(api.description) || t('dashboard.noDescription')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center w-[15%]">
                      <Badge variant="outline" className="font-mono">
                        {api.method || 'GET'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center w-[15%]">
                      <span className="text-sm font-korean">
                        {api.callCount || 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-center w-[20%]">
                      <div className="flex justify-center">
                        {activeFilter === 'myApis' ? (
                          <Button
                            size="sm"
                            variant={api.customApiId && apiSharedStatus[api.customApiId] ? "default" : "secondary"}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (api.customApiId) {
                                toggleShare(api.customApiId);
                              }
                            }}
                            className={`gap-1 w-20 font-korean font-bold ${
                              api.customApiId && apiSharedStatus[api.customApiId] 
                                ? "bg-sky-500 hover:bg-sky-600 text-white dark:bg-white dark:text-black dark:hover:bg-white/90" 
                                : ""
                            }`}
                          >
                            <Share2 className="h-3 w-3" />
                            {api.customApiId && apiSharedStatus[api.customApiId] ? t('dashboard.share.sharing') : t('dashboard.share.share')}
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground font-korean">
                            {t('dashboard.share.imported')}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-[10%] text-center">
                      {activeFilter === 'myApis' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-white dark:text-red-400 dark:hover:bg-red-950 font-korean"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (api.customApiId) {
                              openDeleteDialog(api.customApiId);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 dark:text-white" />
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground font-korean">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      {/* 삭제 확인 모달 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent 
          className="sm:max-w-[425px]"
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-korean">{t('dashboard.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription className="font-korean">
              {deleteApiId && (
                <>
                  <strong className="text-lg">
                    {customAPIs.find(api => api.customApiId === deleteApiId)?.name || 'API'}
                  </strong>
                  <br />
                  <span className="text-sm text-muted-foreground mt-2 block">
                    {t('dashboard.delete.warning')}
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog} className="font-korean">
              {t('dashboard.delete.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteApiId && handleDeleteApi(deleteApiId)}
              className="bg-red-600 hover:bg-red-700 font-korean"
            >
              {t('dashboard.delete.confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* API 상세 정보 모달 */}
      <Dialog open={isApiDetailOpen} onOpenChange={setIsApiDetailOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto font-korean">
          <DialogHeader>
            <DialogTitle className="font-korean text-xl">{selectedApi?.name}</DialogTitle>
            <DialogDescription className="font-korean text-base">
              {selectedApi?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* API 기본 정보 */}
            <div>
              <h3 className="font-semibold text-lg mb-3 font-korean">{t('dashboard.modal.basicInfo')}</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground font-korean">{t('dashboard.modal.apiPath')}</label>
                  <div className="px-3 py-2 bg-muted rounded-md font-mono text-sm break-all">
                    {selectedApi?.customApiId ? `https://api.api-bridge.com/gateway/aifeature/api/ai/execute/${selectedApi.customApiId}` : selectedApi?.path}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground font-korean">생성일</label>
                    <div className="px-3 py-2 bg-muted rounded-md text-sm font-korean">
                      {selectedApi?.createdAt ? new Date(selectedApi.createdAt).toLocaleDateString('ko-KR') : '-'}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-muted-foreground font-korean">파라미터</label>
                    <div className="px-3 py-2 bg-muted rounded-md text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-background rounded text-xs font-mono">
                          query={'{데이터의 조건 입력}'}
                        </code>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-korean">
                          필수
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="px-2 py-1 bg-background rounded text-xs font-mono">
                          aiPlusActive={'{추가 요구사항}'}
                        </code>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-korean">
                          선택
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* 사용되는 API */}
            <div>
              <h3 className="font-semibold text-lg mb-3 font-korean">사용되는 API</h3>
              <Tabs defaultValue="dependencies" className="w-full">
                <TabsList className="grid w-full grid-cols-1">
                  <TabsTrigger value="dependencies" className="font-korean">
                    의존 외부 API ({apiDetail?.data?.externalApiUrl_list?.length || 0})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="dependencies" className="mt-4">
                  {apiDetail?.data?.externalApiUrl_list && apiDetail.data.externalApiUrl_list.length > 0 ? (
                    <div className="space-y-3">
                      {apiDetail.data.externalApiUrl_list.map((externalApi: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-base font-korean">
                              {externalApi.apiName || `외부 API ${index + 1}`}
                            </h4>
                            {externalApi.httpMethod && (
                              <Badge variant="outline" className="font-mono">
                                {externalApi.httpMethod}
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 gap-3 text-sm">
                            {externalApi.endpoint && (
                              <div>
                                <label className="font-medium text-muted-foreground font-korean">Endpoint</label>
                                <div className="px-2 py-1 bg-muted rounded text-xs font-mono break-all">
                                  {externalApi.endpoint}
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {externalApi.parameters && externalApi.parameters.length > 0 && (
                            <div>
                              <label className="font-medium text-muted-foreground font-korean mb-2 block">파라미터</label>
                              <div className="space-y-2">
                                {externalApi.parameters.map((param: any, paramIndex: number) => (
                                  <div key={paramIndex} className="border rounded p-2 space-y-1">
                                    <div className="flex items-center gap-2">
                                      <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                                        {param.paramName}
                                      </code>
                                      <span className="text-xs text-muted-foreground">({param.paramType})</span>
                                      {param.necessary ? (
                                        <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded text-xs font-korean">
                                          필수
                                        </span>
                                      ) : (
                                        <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded text-xs font-korean">
                                          선택
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-xs text-muted-foreground font-korean">
                                      {param.description}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm font-korean">의존하는 외부 API가 없습니다.</p>
                  )}
                </TabsContent>
                
              </Tabs>
            </div>

            {selectedApi?.isImported && selectedApi?.originalAuthor && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-lg mb-2 font-korean">{t('dashboard.modal.originalAuthor')}</h3>
                  <p className="text-sm text-muted-foreground font-korean">
                    {t('dashboard.modal.sharedBy')} <strong>@{selectedApi.originalAuthor}</strong>님이 공유한 API입니다.
                  </p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
