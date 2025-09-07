
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
  Trash2,
} from "lucide-react";
import Link from "next/link";
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
  AlertDialogTrigger,
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
import { getCustomAPIList, shareCustomAPI } from "@/lib/api";

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
  name: string;
  description?: string;
  method?: string;
  endpoint?: string;
  path?: string;
  status?: string;
  calls?: number;
  successRate?: string;
  isShared?: boolean;
  parameters?: APIParameter[];
  pathParameters?: APIParameter[];
  queryParameters?: APIParameter[];
  requestBody?: APIParameter[];
  isImported?: boolean;
  originalAuthor?: string;
}

export default function Dashboard() {
  const { t, translateIfExists } = useLanguage();
  const [customAPIs, setCustomAPIs] = useState<CustomAPI[]>([]);
  const [sharedAPIs] = useState<CustomAPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'myApis' | 'imported'>('myApis');
  const [deleteApiName, setDeleteApiName] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState<CustomAPI | null>(null);
  const [isApiDetailOpen, setIsApiDetailOpen] = useState(false);
  
  const [apiSharedStatus, setApiSharedStatus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadCustomAPIs();
  }, []);

  const loadCustomAPIs = async () => {
    try {
      setIsLoading(true);
      const apis = await getCustomAPIList();
      setCustomAPIs(apis || []);
      
      // Initialize shared status
      const sharedStatus: Record<string, boolean> = {};
      (apis || []).forEach((api: CustomAPI) => {
        sharedStatus[api.name] = api.isShared || false;
      });
      setApiSharedStatus(sharedStatus);
    } catch (error) {
      console.error('커스텀 API 목록 조회 실패:', error);
      setCustomAPIs([]);
    } finally {
      setIsLoading(false);
    }
  };


  const toggleShare = async (apiName: string) => {
    try {
      const newSharedStatus = !apiSharedStatus[apiName];
      await shareCustomAPI(apiName, newSharedStatus);
      setApiSharedStatus(prev => ({
        ...prev,
        [apiName]: newSharedStatus
      }));
    } catch (error) {
      console.error('공유 상태 변경 실패:', error);
      alert('공유 상태 변경에 실패했습니다.');
    }
  };

  const handleDeleteApi = (apiName: string) => {
    // 실제 삭제 로직 구현
    console.log(`Deleting API: ${apiName}`);
    // TODO: API 삭제 요청을 서버에 보내기
    setDeleteApiName(null);
    setIsDeleteDialogOpen(false);
  };

  const openDeleteDialog = (apiName: string) => {
    setDeleteApiName(apiName);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteApiName(null);
    setIsDeleteDialogOpen(false);
  };

  const openApiDetail = (api: CustomAPI) => {
    setSelectedApi(api);
    setIsApiDetailOpen(true);
  };

  const closeApiDetail = () => {
    setSelectedApi(null);
    setIsApiDetailOpen(false);
  };

  const filteredApis = useMemo(() => {
    let apiList: CustomAPI[];
    if (activeFilter === 'imported') {
      apiList = sharedAPIs;
    } else {
      apiList = customAPIs;
    }
    
    // 검색어로 필터링
    if (!searchQuery) return apiList;
    return apiList.filter((api: CustomAPI) => 
      api.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customAPIs, sharedAPIs, searchQuery, activeFilter]);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('dashboard.stats.totalApis')}</CardTitle>
            <ApiIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground font-korean">
              +2 {t('dashboard.stats.lastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('dashboard.stats.activeKeys')}</CardTitle>
            <KeyRound className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground font-korean">
              +3 {t('dashboard.stats.lastWeek')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('dashboard.stats.totalCalls')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234,567</div>
            <p className="text-xs text-muted-foreground font-korean">
              +19% {t('dashboard.stats.vsLastMonth')}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('dashboard.stats.uptime')}</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.9%</div>
            <p className="text-xs text-muted-foreground font-korean">
              {t('dashboard.stats.allActiveApis')}
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
                  <TableHead className="text-center font-korean w-[15%]">{t('dashboard.table.parameters')}</TableHead>
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
                          {api.description || t('dashboard.noDescription')}
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
                        {api.parameters ? api.parameters.length : 0}{t('dashboard.parametersCount')}
                      </span>
                    </TableCell>
                    <TableCell className="text-center w-[20%]">
                      <div className="flex justify-center">
                        {activeFilter === 'myApis' ? (
                          <Button
                            size="sm"
                            variant={apiSharedStatus[api.name] ? "default" : "secondary"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleShare(api.name);
                            }}
                            className={`gap-1 w-20 font-korean font-bold ${
                              apiSharedStatus[api.name] 
                                ? "bg-sky-500 hover:bg-sky-600 text-white dark:bg-white dark:text-black dark:hover:bg-white/90" 
                                : ""
                            }`}
                          >
                            <Share2 className="h-3 w-3" />
                            {apiSharedStatus[api.name] ? t('dashboard.share.sharing') : t('dashboard.share.share')}
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground font-korean">
                            {t('dashboard.share.imported')}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-[10%] text-center">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 dark:border-white dark:text-red-400 dark:hover:bg-red-950 font-korean"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(api.name);
                        }}
                      >
                        <Trash2 className="h-4 w-4 dark:text-white" />
                      </Button>
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
              {deleteApiName && (
                <>
                  <strong className="text-lg">{deleteApiName}</strong>
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
              onClick={() => deleteApiName && handleDeleteApi(deleteApiName)}
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground font-korean">{t('dashboard.modal.apiPath')}</label>
                  <div className="px-3 py-2 bg-muted rounded-md font-mono text-sm">
                    {selectedApi?.path}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground font-korean">{t('dashboard.modal.status')}</label>
                  <div className="px-3 py-2 bg-muted rounded-md text-sm font-korean">
                    {t(`dashboard.status.${selectedApi?.status}`)}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground font-korean">{t('dashboard.modal.totalCalls')}</label>
                  <div className="px-3 py-2 bg-muted rounded-md text-sm font-korean">
                    {selectedApi?.calls}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-muted-foreground font-korean">{t('dashboard.modal.successRate')}</label>
                  <div className="px-3 py-2 bg-muted rounded-md text-sm font-korean">
                    {selectedApi?.successRate}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* API 파라미터 */}
            <div>
              <h3 className="font-semibold text-lg mb-3 font-korean">{t('dashboard.modal.parameters')}</h3>
              <Tabs defaultValue="path" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="path" className="font-korean">
                    Path Parameters ({selectedApi?.pathParameters?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="query" className="font-korean">
                    Query Parameters ({selectedApi?.queryParameters?.length || 0})
                  </TabsTrigger>
                  <TabsTrigger value="body" className="font-korean">
                    Request Body ({selectedApi?.requestBody?.length || 0})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="path" className="mt-4">
                  {selectedApi?.pathParameters && selectedApi.pathParameters.length > 0 ? (
                    <div className="space-y-3">
                      {selectedApi.pathParameters.map((param: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                              {param.name}
                            </code>
                            <span className="text-sm text-muted-foreground">
                              ({param.type})
                            </span>
                            {param.required && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-korean">
                                {t('dashboard.modal.required')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-korean">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm font-korean">Path Parameter가 없습니다.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="query" className="mt-4">
                  {selectedApi?.queryParameters && selectedApi.queryParameters.length > 0 ? (
                    <div className="space-y-3">
                      {selectedApi.queryParameters.map((param: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                              {param.name}
                            </code>
                            <span className="text-sm text-muted-foreground">
                              ({param.type})
                            </span>
                            {param.required && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-korean">
                                {t('dashboard.modal.required')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-korean">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm font-korean">Query Parameter가 없습니다.</p>
                  )}
                </TabsContent>
                
                <TabsContent value="body" className="mt-4">
                  {selectedApi?.requestBody && selectedApi.requestBody.length > 0 ? (
                    <div className="space-y-3">
                      {selectedApi.requestBody.map((param: any, index: number) => (
                        <div key={index} className="border rounded-lg p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                              {param.name}
                            </code>
                            <span className="text-sm text-muted-foreground">
                              ({param.type})
                            </span>
                            {param.required && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded font-korean">
                                {t('dashboard.modal.required')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground font-korean">
                            {param.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm font-korean">Request Body가 없습니다.</p>
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
