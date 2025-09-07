
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { createCustomAPISimple } from "@/lib/api";
import { Loader2, Wand2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useLanguage } from "@/contexts/language-context";

export function SuggestionsForm() {
  const { t } = useLanguage();
  const [dataDescription, setDataDescription] = useState("");
  const [apiName, setApiName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dataDescription.trim() || !apiName.trim()) {
      toast({
        variant: "destructive",
        title: "입력 오류",
        description: "API 이름과 설명을 모두 입력해주세요.",
      });
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const response = await createCustomAPISimple(dataDescription, apiName);
      setResult(response);
      toast({
        title: "성공",
        description: "커스텀 API가 성공적으로 생성되었습니다!",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다.",
        description: "API를 생성하는데 실패했습니다. 나중에 다시 시도해 주세요.",
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid w-full gap-2">
        <Label htmlFor="api-name" className="font-semibold font-korean">API 이름</Label>
        <Input
          id="api-name"
          placeholder="예: weather-clothing-recommendation"
          value={apiName}
          onChange={(e) => setApiName(e.target.value)}
          required
          className="focus:!ring-primary focus:ring-2 transition-all font-korean"
        />
        <p className="text-sm text-muted-foreground font-korean">
          생성할 API의 고유한 이름을 입력하세요
        </p>
      </div>

      <div className="grid w-full gap-2">
        <Label htmlFor="data-description" className="font-semibold font-korean">{t('suggestions.dataDescription')}</Label>
        <Textarea
          id="data-description"
          placeholder={t('suggestions.examplePlaceholder')}
          value={dataDescription}
          onChange={(e) => setDataDescription(e.target.value)}
          rows={4}
          required
          className="focus:!ring-primary focus:ring-2 transition-all font-korean"
        />
        <p className="text-sm text-muted-foreground font-korean">
          {t('suggestions.helpText')}
        </p>
      </div>

      <Button type="submit" className="w-full font-bold font-korean" disabled={loading || !dataDescription || !apiName}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
        {t('suggestions.createButton')}
      </Button>

      {loading && (
        <Card>
          <CardHeader>
             <Skeleton className="h-6 w-1/2" />
             <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="bg-gradient-to-br from-card to-muted/50">
          <CardHeader>
            <CardTitle className="text-xl font-headline font-korean">API 생성 완료</CardTitle>
            <CardDescription className="font-korean">커스텀 API가 성공적으로 생성되었습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Alert>
              <Wand2 className="h-4 w-4" />
              <AlertTitle className="font-korean">생성 성공</AlertTitle>
              <AlertDescription className="font-korean">
                API "{apiName}"가 성공적으로 생성되었습니다. 대시보드에서 확인하고 관리할 수 있습니다.
              </AlertDescription>
            </Alert>
            {result.message && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-korean">{result.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}
