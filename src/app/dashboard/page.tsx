
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
    path: "/api/weather",
    description: "현재 날씨 정보와 5일 예보를 제공하는 API입니다.",
    parameters: [
      { name: "city", type: "string", required: true, description: "도시 이름" },
      { name: "units", type: "string", required: false, description: "온도 단위 (metric, imperial)" },
      { name: "lang", type: "string", required: false, description: "언어 코드 (ko, en)" }
    ]
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
    path: "/api/stocks",
    description: "실시간 주식 시세와 거래 정보를 제공하는 API입니다.",
    parameters: [
      { name: "symbol", type: "string", required: true, description: "주식 심볼 (AAPL, GOOGL 등)" },
      { name: "interval", type: "string", required: false, description: "데이터 간격 (1m, 5m, 1h, 1d)" }
    ]
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
    path: "/api/location",
    description: "GPS 좌표를 이용하여 주소와 주변 정보를 제공하는 API입니다.",
    parameters: [
      { name: "lat", type: "number", required: true, description: "위도" },
      { name: "lng", type: "number", required: true, description: "경도" },
      { name: "radius", type: "number", required: false, description: "검색 반경 (km)" }
    ]
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
    path: "/api/products",
    description: "온라인 쇼핑몰의 제품 정보를 검색하고 관리할 수 있는 API입니다.",
    parameters: [
      { name: "category", type: "string", required: false, description: "제품 카테고리" },
      { name: "search", type: "string", required: false, description: "검색 키워드" },
      { name: "limit", type: "number", required: false, description: "결과 개수 제한" }
    ]
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
    path: "/api/payment",
    description: "다양한 결제 수단을 통합하여 안전한 결제 처리를 제공하는 API입니다.",
    parameters: [
      { name: "amount", type: "number", required: true, description: "결제 금액" },
      { name: "currency", type: "string", required: true, description: "통화 종류 (KRW, USD)" },
      { name: "method", type: "string", required: true, description: "결제 수단 (card, bank, mobile)" }
    ]
  },
];

export default function Dashboard() {
  const { t, translateIfExists } = useLanguage();
  const apis = getApiData(translateIfExists);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<'myApis' | 'imported'>('myApis');
  const [deleteApiName, setDeleteApiName] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedApi, setSelectedApi] = useState<any>(null);
  const [isApiDetailOpen, setIsApiDetailOpen] = useState(false);
  
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

  const openApiDetail = (api: any) => {
    setSelectedApi(api);
    setIsApiDetailOpen(true);
  };

  const closeApiDetail = () => {
    setSelectedApi(null);
    setIsApiDetailOpen(false);
  };

  const filteredApis = useMemo(() => {
    // 먼저 필터에 따라 API 분류
    let filteredByType = apis.filter(api => 
      activeFilter === 'myApis' ? !api.isImported : api.isImported
    );
    
    // 그 다음 검색어로 필터링
    if (!searchQuery) return filteredByType;
    return filteredByType.filter(api => 
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (api.originalAuthor && api.originalAuthor.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [apis, searchQuery, activeFilter]);

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
                내API
              </Button>
              <Button
                variant={activeFilter === 'imported' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('imported')}
                className="font-korean"
              >
                가져온API
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="API 이름을 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-80 font-korean"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-korean w-[40%]">{t('dashboard.table.apiName')}</TableHead>
                <TableHead className="text-center font-korean w-[15%]">{t('dashboard.table.status')}</TableHead>
                <TableHead className="text-right font-korean w-[15%]">{t('dashboard.table.calls')}</TableHead>
                <TableHead className="text-center font-korean w-[20%]">{t('dashboard.table.sharing')}</TableHead>
                <TableHead className="w-[10%] text-center font-korean">{t('dashboard.table.actions') || '작업'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApis.map((api) => (
                <TableRow key={api.name} className="cursor-pointer hover:bg-muted/80 dark:hover:bg-white/10" onClick={() => openApiDetail(api)}>
                  <TableCell className="font-medium font-korean w-[40%]">
                    <div>
                      <div className="font-korean">
                        {api.name}
                      </div>
                      {activeFilter === 'imported' && api.originalAuthor && (
                        <div className="text-xs text-muted-foreground mt-1 font-korean">
                          {t('dashboard.originalAuthor')}: {api.originalAuthor}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center w-[15%]">
                    <Badge
                      variant={
                        api.status === "active"
                          ? "default"
                          : api.status === "error"
                          ? "destructive"
                          : "secondary"
                      }
                      className={
                        api.status === "active"
                          ? "bg-green-400 hover:bg-green-500 text-white dark:bg-white dark:text-black dark:hover:bg-white/90"
                          : ""
                      }
                    >
                      {t(`dashboard.status.${api.status}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right w-[15%]">{api.calls}</TableCell>
                  <TableCell className="text-center w-[20%]">
                    <div className="flex justify-center">
                      {activeFilter === 'imported' ? (
                        <span className="text-sm text-muted-foreground font-medium font-korean">
                          -
                        </span>
                      ) : (
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
        </CardContent>
      </Card>
      
      {/* 삭제 확인 모달 */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent 
          className="sm:max-w-[425px]"
          onPointerDownOutside={closeDeleteDialog}
          onInteractOutside={closeDeleteDialog}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="font-korean">API를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription className="font-korean">
              {deleteApiName && (
                <>
                  <strong className="text-lg">{deleteApiName}</strong>
                  <br />
                  <span className="text-sm text-muted-foreground mt-2 block">
                    이 작업은 되돌릴 수 없습니다.
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={closeDeleteDialog} className="font-korean">
              아니오
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteApiName && handleDeleteApi(deleteApiName)}
              className="bg-red-600 hover:bg-red-700 font-korean"
            >
              예
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
              {selectedApi?.parameters && selectedApi.parameters.length > 0 ? (
                <div className="space-y-3">
                  {selectedApi.parameters.map((param: any, index: number) => (
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
                <p className="text-muted-foreground text-sm font-korean">{t('dashboard.modal.noParameters')}</p>
              )}
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
