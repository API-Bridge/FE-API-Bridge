"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Clock, Server, Copy, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { useState, useEffect } from "react";
import { getUserCustomAPIs, executeCustomAPI } from "@/lib/api";

// API 타입 정의
interface APIParameter {
  name: string;
  type: string;
  description?: string;
  required?: boolean;
}

interface UserAPI {
  id: string;
  name: string;
  description?: string;
  method?: string;
  endpoint?: string;
  parameters?: APIParameter[];
}

export default function APIUsagePage() {
  const { t } = useLanguage();
  
  const [userAPIs, setUserAPIs] = useState<UserAPI[]>([]);
  const [selectedAPI, setSelectedAPI] = useState<UserAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState("");
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [showResponse, setShowResponse] = useState(false);

  useEffect(() => {
    loadUserAPIs();
  }, []);

  const loadUserAPIs = async () => {
    try {
      setIsLoading(true);
      const apis = await getUserCustomAPIs();
      setUserAPIs(apis || []);
    } catch (error) {
      console.error("사용자 API 목록 조회 실패:", error);
      setUserAPIs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAPISelect = (api: UserAPI) => {
    setSelectedAPI(api);
    setExecutionResult("");
    setShowResponse(false);
    
    // Initialize parameter values
    const initialParams: Record<string, string> = {};
    if (api.parameters) {
      api.parameters.forEach((param: APIParameter) => {
        initialParams[param.name] = "";
      });
    }
    setParamValues(initialParams);
  };

  const handleParameterChange = (paramName: string, value: string) => {
    setParamValues(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleExecute = async () => {
    if (!selectedAPI) return;

    setIsExecuting(true);
    try {
      const result = await executeCustomAPI(selectedAPI.id, paramValues);
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
      alert(t('apiUsage.results.copied'));
    });
  };

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-korean">{t('apiUsage.title')}</h1>
          <p className="text-muted-foreground font-korean">
            {t('apiUsage.description')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 왼쪽: API 선택 */}
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-korean">
              <Server className="w-5 h-5" />
              {t('apiUsage.myCustomApis')}
            </CardTitle>
            <CardDescription className="font-korean">
              {t('apiUsage.selectApiDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-korean">{t('apiUsage.loading')}</p>
              </div>
            ) : userAPIs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-korean">
                  {t('apiUsage.noApis')}
                </p>
                <Button 
                  className="mt-4 font-korean"
                  onClick={() => window.location.href = '/dashboard/suggestions'}
                >
                  {t('apiUsage.createApiButton')}
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {userAPIs.map((api) => (
                  <div
                    key={api.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                      selectedAPI?.id === api.id ? 'border-primary bg-primary/10' : 'border-border'
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
                            {api.method}
                          </Badge>
                          {api.parameters && api.parameters.length > 0 && (
                            <Badge variant="secondary" className="text-xs font-korean">
                              {api.parameters.length}{t('apiUsage.parametersCount')}
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
              {t('apiUsage.execution.title')}
            </CardTitle>
            <CardDescription className="font-korean">
              {t('apiUsage.execution.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedAPI ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground font-korean">
                  {t('apiUsage.execution.selectApiPrompt')}
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
                    <Badge variant="outline">{selectedAPI.method}</Badge>
                    <code className="text-xs bg-muted px-2 py-1 rounded">
                      {selectedAPI.endpoint}
                    </code>
                  </div>
                </div>

                <Separator />

                {/* 파라미터 입력 */}
                {selectedAPI.parameters && selectedAPI.parameters.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-medium font-korean">{t('apiUsage.parameters.title')}</h4>
                    {selectedAPI.parameters.map((param) => (
                      <div key={param.name} className="space-y-2">
                        <Label className="flex items-center gap-2 font-korean">
                          {param.name}
                          {param.required && <span className="text-red-500">*</span>}
                          <Badge variant="secondary" className="text-xs">
                            {param.type}
                          </Badge>
                        </Label>
                        <Input
                          placeholder={param.description || `${param.name} ${t('apiUsage.parameters.inputPlaceholder')}`}
                          value={paramValues[param.name] || ""}
                          onChange={(e) => handleParameterChange(param.name, e.target.value)}
                          className="font-korean"
                        />
                        {param.description && (
                          <p className="text-xs text-muted-foreground font-korean">
                            {param.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 실행 버튼 */}
                <div className="pt-4">
                  <Button 
                    onClick={handleExecute}
                    disabled={isExecuting}
                    className="w-full font-korean"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isExecuting ? t('apiUsage.execution.executing') : t('apiUsage.execution.executeButton')}
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
                {t('apiUsage.results.title')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(executionResult)}
                  className="font-korean"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {t('apiUsage.results.copyButton')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResponse(false)}
                  className="font-korean"
                >
                  <EyeOff className="w-4 h-4 mr-2" />
                  {t('apiUsage.results.hideButton')}
                </Button>
              </div>
            </div>
            <CardDescription className="font-korean">
              {t('apiUsage.results.description')}
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