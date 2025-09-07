"use client";

import { useEffect, useState } from "react";
import { registerExternalAPI, deleteExternalAPI } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { useLanguage } from "@/contexts/language-context";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter 
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Users, 
  Activity, 
  Database, 
  Settings,
  Shield,
  BarChart3,
  Server,
  Plus,
  Trash2,
  Globe
} from "lucide-react";

// 인터페이스 정의
interface APIParameter {
  paramName: string;
  paramType: string;
  isRequired: boolean;
  paramDescription: string;
  defaultValue: string;
}

interface ExternalAPI {
  id: string;
  name: string;
  description?: string;
  issuer: string;
  url: string;
  method: string;
  credentialId: string;
  status: 'active' | 'inactive';
  addedDate: string;
  parameters: APIParameter[];
}

interface APIForm {
  apiName: string;
  apiDescription: string;
  apiIssuer: string;
  apiUrl: string;
  httpMethod: string;
  credentialId: string;
  parameters: APIParameter[];
}

// 임시 데이터
const mockUsers = [
  { id: "1", name: "김철수", email: "kim@example.com", isAdmin: false, status: "active", joinDate: "2024-01-15" },
  { id: "2", name: "이영희", email: "lee@example.com", isAdmin: true, status: "active", joinDate: "2024-01-20" },
  { id: "3", name: "박민수", email: "park@example.com", isAdmin: false, status: "inactive", joinDate: "2024-02-01" },
];

const mockStats = {
  totalUsers: 156,
  totalApis: 42,
  totalCalls: "2,345,678",
  activeUsers: 134
};

// 외부 API 임시 데이터
const mockExternalApis: ExternalAPI[] = [];

export default function AdminPage() {
  const { user, isAdmin } = useUser();
  const { t } = useLanguage();
  const router = useRouter();

  // 외부 API 상태 관리
  const [externalApis, setExternalApis] = useState(mockExternalApis);
  const [apiForm, setApiForm] = useState<APIForm>({
    apiName: '',
    apiDescription: '',
    apiIssuer: '',
    apiUrl: '',
    httpMethod: 'GET',
    credentialId: '',
    parameters: [] as APIParameter[]
  });
  const [apiErrors, setApiErrors] = useState({
    apiName: '',
    apiUrl: '',
    apiIssuer: '',
    credentialId: ''
  });
  const [isAddingApi, setIsAddingApi] = useState(false);
  
  // 파라미터 관리 상태
  const [currentParam, setCurrentParam] = useState({
    paramName: '',
    paramType: 'string',
    isRequired: true,
    paramDescription: '',
    defaultValue: ''
  });
  const [showParamForm, setShowParamForm] = useState(false);

  // API 폼 검증
  const validateApiForm = () => {
    const newErrors = { apiName: '', apiUrl: '', apiIssuer: '', credentialId: '' };
    let isValid = true;

    if (!apiForm.apiName.trim()) {
      newErrors.apiName = t('admin.externalApi.validation.nameRequired');
      isValid = false;
    }

    if (!apiForm.apiUrl.trim()) {
      newErrors.apiUrl = t('admin.externalApi.validation.urlRequired');
      isValid = false;
    } else if (!/^https?:\/\/.+/.test(apiForm.apiUrl)) {
      newErrors.apiUrl = t('admin.externalApi.validation.urlInvalid');
      isValid = false;
    }

    if (!apiForm.apiIssuer.trim()) {
      newErrors.apiIssuer = t('admin.externalApi.validation.issuerRequired');
      isValid = false;
    }

    if (!apiForm.credentialId.trim()) {
      newErrors.credentialId = t('admin.externalApi.validation.credentialRequired');
      isValid = false;
    }

    if (externalApis.some(api => api.name.toLowerCase() === apiForm.apiName.toLowerCase())) {
      newErrors.apiName = t('admin.externalApi.validation.nameExists');
      isValid = false;
    }

    setApiErrors(newErrors);
    return isValid;
  };

  // 파라미터 추가
  const addParameter = () => {
    if (!currentParam.paramName.trim() || !currentParam.paramDescription.trim()) {
      return;
    }

    setApiForm(prev => ({
      ...prev,
      parameters: [...prev.parameters, { ...currentParam }]
    }));

    setCurrentParam({
      paramName: '',
      paramType: 'string',
      isRequired: true,
      paramDescription: '',
      defaultValue: ''
    });
    setShowParamForm(false);
  };

  // 파라미터 삭제
  const removeParameter = (index: number) => {
    setApiForm(prev => ({
      ...prev,
      parameters: prev.parameters.filter((_, i) => i !== index)
    }));
  };

  // API 추가
  const handleAddApi = async () => {
    if (!validateApiForm()) {
      return;
    }

    setIsAddingApi(true);

    try {
      const requestBody = {
        apiName: apiForm.apiName,
        apiDescription: apiForm.apiDescription,
        apiIssuer: apiForm.apiIssuer,
        apiUrl: apiForm.apiUrl,
        httpMethod: apiForm.httpMethod,
        credentialId: apiForm.credentialId,
        parameters: apiForm.parameters.map(param => ({
          paramName: param.paramName,
          paramType: param.paramType,
          isRequired: param.isRequired,
          paramDescription: param.paramDescription,
          defaultValue: param.defaultValue,
          additionalFields: null
        }))
      };

      await registerExternalAPI(requestBody);

      // 성공 시 임시로 클라이언트 목록에 추가 (실제로는 API에서 목록을 다시 가져와야 함)
      const newApi: ExternalAPI = {
        id: Date.now().toString(),
        name: apiForm.apiName,
        url: apiForm.apiUrl,
        description: apiForm.apiDescription || `${apiForm.apiName} 외부 API`,
        issuer: apiForm.apiIssuer,
        method: apiForm.httpMethod,
        credentialId: apiForm.credentialId,
        parameters: apiForm.parameters,
        status: 'active' as 'active',
        addedDate: new Date().toISOString().split('T')[0]
      };

      setExternalApis(prev => [...prev, newApi]);
      
      // 폼 초기화
      setApiForm({ 
        apiName: '', 
        apiDescription: '', 
        apiIssuer: '', 
        apiUrl: '', 
        httpMethod: 'GET',
        credentialId: '',
        parameters: [] as APIParameter[]
      });
      setApiErrors({ apiName: '', apiUrl: '', apiIssuer: '', credentialId: '' });

      console.log(t('admin.externalApi.success.registered'));
      alert(t('admin.externalApi.success.registeredAlert'));

    } catch (error) {
      console.error(t('admin.externalApi.error.registrationFailed'), error);
      alert(t('admin.externalApi.error.registrationAlert'));
    } finally {
      setIsAddingApi(false);
    }
  };

  // API 삭제
  const handleDeleteApi = async (apiId: string) => {
    if (!confirm(t('admin.externalApi.confirm.delete'))) {
      return;
    }

    try {
      await deleteExternalAPI(apiId);
      setExternalApis(prev => prev.filter(api => api.id !== apiId));
      console.log(t('admin.externalApi.success.deleted'));
      alert(t('admin.externalApi.success.deletedAlert'));
    } catch (error) {
      console.error(t('admin.externalApi.error.deletionFailed'), error);
      alert(t('admin.externalApi.error.deletionAlert'));
    }
  };

  // 관리자가 아닌 경우 접근 차단
  useEffect(() => {
    if (user && !isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, router]);

  // 로딩 중이거나 관리자가 아닌 경우
  if (!user || !isAdmin) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium font-korean">{t('admin.accessDenied')}</p>
          <p className="text-sm text-muted-foreground font-korean">{t('admin.adminOnly')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 상단 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3 md:gap-8">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('admin.totalUsers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">{mockStats.totalUsers}</div>
            <p className="text-xs text-muted-foreground font-korean">
              +12 {t('admin.lastMonth')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('admin.totalApis')}</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">{mockStats.totalApis}</div>
            <p className="text-xs text-muted-foreground font-korean">
              +5 {t('admin.lastWeek')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium font-korean">{t('admin.totalCalls')}</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-korean">{mockStats.totalCalls}</div>
            <p className="text-xs text-muted-foreground font-korean">
              +23% {t('admin.vsLastMonth')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 대시보드 카드 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader>
            <CardTitle className="font-korean">{t('monitoring.grafanaDashboard')}</CardTitle>
            <CardDescription className="font-korean">{t('monitoring.grafanaDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-96 bg-muted rounded-lg border flex flex-col items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                <p className="text-lg font-semibold mb-2 font-korean">그라파나 대시보드</p>
                <p className="text-sm mb-6 font-korean">Node Exporter Full - 시스템 모니터링</p>
                <a
                  href="http://localhost:3000/d/rYdddlPWk/node-exporter-full?orgId=1&from=now-24h&to=now&timezone=browser&var-DS_PROMETHEUS=bewra9ybzyy2oc&var-job=kubernetes-service-endpoints&var-nodename=minikube&var-node=192.168.49.2:9100&var-diskdevices=%5Ba-z%5D%2B%7Cnvme%5B0-9%5D%2Bn%5B0-9%5D%2B%7Cmmcblk%5B0-9%5D%2B&refresh=1m"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2 font-medium transition-colors font-korean"
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  대시보드 열기
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
          <CardHeader>
            <CardTitle className="font-korean">{t('monitoring.kibanaDashboard')}</CardTitle>
            <CardDescription className="font-korean">{t('monitoring.kibanaDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center border">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-16 w-16 mx-auto" />
                 <p className="mt-4 font-korean">{t('monitoring.kibanaEmbed')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 외부 API 관리 카드 */}
      <Card className="bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <CardTitle className="font-korean">{t('admin.externalApi.title')}</CardTitle>
          </div>
          <CardDescription className="font-korean">
            {t('admin.externalApi.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* API 등록 폼 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-korean">{t('admin.externalApi.form.title')}</h3>
              
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="api-name" className="font-korean">{t('admin.externalApi.form.name')} *</Label>
                  <Input
                    id="api-name"
                    placeholder={t('admin.externalApi.form.namePlaceholder')}
                    className={`font-korean ${apiErrors.apiName ? 'border-red-500' : ''}`}
                    value={apiForm.apiName}
                    onChange={(e) => setApiForm(prev => ({ ...prev, apiName: e.target.value }))}
                  />
                  {apiErrors.apiName && (
                    <p className="text-xs text-red-500 font-korean">{apiErrors.apiName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-description" className="font-korean">{t('admin.externalApi.form.description')}</Label>
                  <Textarea
                    id="api-description"
                    placeholder={t('admin.externalApi.form.descriptionPlaceholder')}
                    className="font-korean resize-none"
                    rows={2}
                    value={apiForm.apiDescription}
                    onChange={(e) => setApiForm(prev => ({ ...prev, apiDescription: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="api-issuer" className="font-korean">{t('admin.externalApi.form.issuer')} *</Label>
                    <Input
                      id="api-issuer"
                      placeholder={t('admin.externalApi.form.issuerPlaceholder')}
                      className={`font-korean ${apiErrors.apiIssuer ? 'border-red-500' : ''}`}
                      value={apiForm.apiIssuer}
                      onChange={(e) => setApiForm(prev => ({ ...prev, apiIssuer: e.target.value }))}
                    />
                    {apiErrors.apiIssuer && (
                      <p className="text-xs text-red-500 font-korean">{apiErrors.apiIssuer}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="credential-id" className="font-korean">{t('admin.externalApi.form.credentialId')} *</Label>
                    <Input
                      id="credential-id"
                      placeholder={t('admin.externalApi.form.credentialIdPlaceholder')}
                      className={`font-korean ${apiErrors.credentialId ? 'border-red-500' : ''}`}
                      value={apiForm.credentialId}
                      onChange={(e) => setApiForm(prev => ({ ...prev, credentialId: e.target.value }))}
                    />
                    {apiErrors.credentialId && (
                      <p className="text-xs text-red-500 font-korean">{apiErrors.credentialId}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-url" className="font-korean">{t('admin.externalApi.form.url')} *</Label>
                  <Input
                    id="api-url"
                    placeholder={t('admin.externalApi.form.urlPlaceholder')}
                    className={`font-korean ${apiErrors.apiUrl ? 'border-red-500' : ''}`}
                    value={apiForm.apiUrl}
                    onChange={(e) => setApiForm(prev => ({ ...prev, apiUrl: e.target.value }))}
                  />
                  {apiErrors.apiUrl && (
                    <p className="text-xs text-red-500 font-korean">{apiErrors.apiUrl}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="http-method" className="font-korean">{t('admin.externalApi.form.httpMethod')}</Label>
                  <Select
                    value={apiForm.httpMethod}
                    onValueChange={(value) => setApiForm(prev => ({ ...prev, httpMethod: value }))}
                  >
                    <SelectTrigger className="font-korean">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 파라미터 관리 */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold font-korean">{t('admin.externalApi.parameters.title')} ({apiForm.parameters.length}{t('admin.externalApi.parameters.count')})</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowParamForm(true)}
                    className="font-korean"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {t('admin.externalApi.parameters.add')}
                  </Button>
                </div>

                {/* 파라미터 목록 */}
                {apiForm.parameters.length > 0 && (
                  <div className="space-y-2">
                    {apiForm.parameters.map((param, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-muted/20 rounded border">
                        <div className="flex-1">
                          <span className="font-medium font-korean">{param.paramName}</span>
                          <span className="text-sm text-muted-foreground ml-2">({param.paramType})</span>
                          {param.isRequired && <Badge variant="destructive" className="ml-2 text-xs">{t('admin.externalApi.parameters.required')}</Badge>}
                          <p className="text-xs text-muted-foreground mt-1 font-korean">{param.paramDescription}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParameter(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* 파라미터 추가 폼 */}
                {showParamForm && (
                  <div className="p-4 border rounded-lg bg-muted/10 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="font-korean">{t('admin.externalApi.parameters.form.name')}</Label>
                        <Input
                          placeholder={t('admin.externalApi.parameters.form.namePlaceholder')}
                          value={currentParam.paramName}
                          onChange={(e) => setCurrentParam(prev => ({ ...prev, paramName: e.target.value }))}
                          className="font-korean"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="font-korean">{t('admin.externalApi.parameters.form.type')}</Label>
                        <Select
                          value={currentParam.paramType}
                          onValueChange={(value) => setCurrentParam(prev => ({ ...prev, paramType: value }))}
                        >
                          <SelectTrigger className="font-korean">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">string</SelectItem>
                            <SelectItem value="number">number</SelectItem>
                            <SelectItem value="boolean">boolean</SelectItem>
                            <SelectItem value="object">object</SelectItem>
                            <SelectItem value="array">array</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="font-korean">{t('admin.externalApi.parameters.form.description')}</Label>
                      <Input
                        placeholder={t('admin.externalApi.parameters.form.descriptionPlaceholder')}
                        value={currentParam.paramDescription}
                        onChange={(e) => setCurrentParam(prev => ({ ...prev, paramDescription: e.target.value }))}
                        className="font-korean"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="font-korean">{t('admin.externalApi.parameters.form.defaultValue')}</Label>
                        <Input
                          placeholder={t('admin.externalApi.parameters.form.defaultValuePlaceholder')}
                          value={currentParam.defaultValue}
                          onChange={(e) => setCurrentParam(prev => ({ ...prev, defaultValue: e.target.value }))}
                          className="font-korean"
                        />
                      </div>
                      <div className="flex items-center space-x-2 pt-6">
                        <Checkbox
                          id="required"
                          checked={currentParam.isRequired}
                          onCheckedChange={(checked) => setCurrentParam(prev => ({ ...prev, isRequired: checked as boolean }))}
                        />
                        <Label htmlFor="required" className="font-korean">{t('admin.externalApi.parameters.form.requiredParam')}</Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={addParameter} className="font-korean">
                        {t('admin.externalApi.parameters.form.addButton')}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowParamForm(false)} className="font-korean">
                        {t('admin.externalApi.parameters.form.cancelButton')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleAddApi}
                disabled={isAddingApi}
                className="w-full font-korean"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isAddingApi ? t('admin.externalApi.form.registering') : t('admin.externalApi.form.registerButton')}
              </Button>
            </div>

            {/* 등록된 API 목록 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold font-korean">{t('admin.externalApi.list.title')} ({externalApis.length}{t('admin.externalApi.list.count')})</h3>
              <div className="max-h-96 overflow-y-auto space-y-2">
                {externalApis.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Server className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-korean">{t('admin.externalApi.list.empty')}</p>
                  </div>
                ) : (
                  externalApis.map((api) => (
                    <div key={api.id} className="p-4 border rounded-lg bg-muted/20 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold font-korean">{api.name}</h4>
                            <Badge variant={api.status === 'active' ? 'default' : 'secondary'}>
                              {api.status === 'active' ? t('admin.externalApi.list.active') : t('admin.externalApi.list.inactive')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-korean mt-1">
                            {api.url}
                          </p>
                          {api.description && (
                            <p className="text-xs text-muted-foreground font-korean mt-1">
                              {api.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground font-korean mt-2">
                            {t('admin.externalApi.list.registeredDate')}: {api.addedDate}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteApi(api.id)}
                          className="ml-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}