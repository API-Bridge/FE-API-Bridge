"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Clock, Server, Copy, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useAuth0 } from "@/contexts/auth0-context";
import { useState, useEffect } from "react";
import { getCustomAPIList, executeCustomAPISimple } from "@/lib/api";

// API 타입 정의
interface APIParameter {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
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
}

export default function APIUsagePage() {
  const { t } = useLanguage();
  const { getAccessToken, isAuthenticated } = useAuth0();
  
  const [customAPIs, setCustomAPIs] = useState<CustomAPI[]>([]);
  const [selectedAPI, setSelectedAPI] = useState<CustomAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState("");
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
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
    } catch (error) {
      console.error('커스텀 API 목록 조회 실패:', error);
      setCustomAPIs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAPISelect = (api: CustomAPI) => {
    setSelectedAPI(api);
    setExecutionResult("");
    setShowResponse(false);
    
    // Initialize parameter values - 기본 파라미터로 query와 aiPlusActive 설정
    const initialParams: Record<string, string> = {
      query: "",
      aiPlusActive: ""
    };
    setParamValues(initialParams);
  };

  const handleParameterChange = (paramName: string, value: string) => {
    setParamValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleExecute = async () => {
    if (!selectedAPI || !selectedAPI.customApiId) return;

    setIsExecuting(true);
    try {
      const accessToken = await getAccessToken();
      const result = await executeCustomAPISimple(
        selectedAPI.customApiId, 
        paramValues.query || "", 
        accessToken,
        paramValues.aiPlusActive || undefined
      );
      setExecutionResult(JSON.stringify(result, null, 2));
      setShowResponse(true);
    } catch (error) {
      console.error("API 실행 실패:", error);
      setExecutionResult(`Error: ${(error as Error).message || "API 실행에 실패했습니다."}`);
      setShowResponse(true);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('결과가 클립보드에 복사되었습니다.');
    });
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-korean">API 사용</h1>
          <p className="text-muted-foreground font-korean">
            내 커스텀 API들을 직접 테스트해보세요
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: API 선택 */}
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-korean">
              <Server className="w-5 h-5" />
              내 커스텀 API
            </CardTitle>
            <CardDescription className="font-korean">
              테스트할 API를 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-korean">로딩 중...</p>
              </div>
            ) : customAPIs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-korean">
                  등록된 커스텀 API가 없습니다
                </p>
                <Button 
                  className="mt-4 font-korean"
                  onClick={() => window.location.href = '/dashboard/suggestions'}
                >
                  API 생성하기
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {customAPIs.map((api) => (
                  <div
                    key={api.customApiId || api.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                      selectedAPI?.customApiId === api.customApiId ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                    onClick={() => handleAPISelect(api)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium font-korean">{api.name}</h3>
                        <p className="text-sm text-muted-foreground font-korean mt-1">
                          {api.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {api.method || 'GET'}
                          </Badge>
                          <Badge variant="secondary" className="text-xs font-korean">
                            호출 수: {api.callCount || 0}
                          </Badge>
                          {api.apiType && (
                            <Badge variant={api.apiType === 'ORIGINAL' ? 'default' : 'secondary'} className="text-xs font-korean">
                              {api.apiType === 'ORIGINAL' ? '내 API' : '가져온 API'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* 오른쪽: API 실행 */}
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-korean">
              <Play className="w-5 h-5" />
              API 실행
            </CardTitle>
            <CardDescription className="font-korean">
              선택한 API에 파라미터를 입력하여 실행하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedAPI ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-korean">
                  왼쪽에서 테스트할 API를 선택해주세요
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* API 정보 */}
                <div className="space-y-2">
                  <h3 className="font-medium font-korean">{selectedAPI.name}</h3>
                  <p className="text-sm text-muted-foreground font-korean">
                    {selectedAPI.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{selectedAPI.method || 'GET'}</Badge>
                    <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                      {selectedAPI.customApiId ? 
                        `https://api.api-bridge.com/gateway/aifeature/api/ai/execute/${selectedAPI.customApiId}` :
                        selectedAPI.endpoint || selectedAPI.path
                      }
                    </code>
                  </div>
                </div>

                <Separator />

                {/* 파라미터 입력 */}
                <div className="space-y-4">
                  <h4 className="font-medium font-korean">파라미터</h4>
                  <div className="space-y-4">
                    {/* query 파라미터 (필수) */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 font-korean">
                        query
                        <span className="text-red-500">*</span>
                        <Badge variant="secondary" className="text-xs">
                          string
                        </Badge>
                      </Label>
                      <Input
                        placeholder="데이터의 조건을 입력해주세요"
                        value={paramValues.query || ""}
                        onChange={(e) => handleParameterChange("query", e.target.value)}
                        className="font-korean"
                      />
                      <p className="text-xs text-muted-foreground font-korean">
                        API가 처리할 데이터 조건이나 요청 내용을 입력하세요
                      </p>
                    </div>
                    
                    {/* aiPlusActive 파라미터 (선택) */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2 font-korean">
                        aiPlusActive
                        <Badge variant="outline" className="text-xs">
                          선택
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          string
                        </Badge>
                      </Label>
                      <Input
                        placeholder="추가 요구사항을 입력해주세요 (선택)"
                        value={paramValues.aiPlusActive || ""}
                        onChange={(e) => handleParameterChange("aiPlusActive", e.target.value)}
                        className="font-korean"
                      />
                      <p className="text-xs text-muted-foreground font-korean">
                        AI가 추가로 고려해야 할 요구사항이나 조건을 입력하세요
                      </p>
                    </div>
                  </div>
                </div>

                {/* 실행 버튼 */}
                <div className="pt-4">
                  <Button 
                    onClick={handleExecute}
                    disabled={isExecuting || !paramValues.query}
                    className="w-full font-korean"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isExecuting ? 'API 실행 중...' : 'API 실행하기'}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 실행 결과 */}
      {selectedAPI && showResponse && (
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 font-korean">
                <Clock className="w-5 h-5" />
                실행 결과
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(executionResult)}
                  className="font-korean"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  복사
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResponse(false)}
                  className="font-korean"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  숨기기
                </Button>
              </div>
            </div>
            <CardDescription className="font-korean">
              API 실행 결과를 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-auto font-mono max-h-96">
                {executionResult}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}