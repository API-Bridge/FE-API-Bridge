
"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { suggestApis, type SuggestApisOutput } from "@/ai/flows/suggest-apis";
import { Loader2, Wand2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Switch } from "./ui/switch";

export function SuggestionsForm() {
  const [dataDescription, setDataDescription] = useState("");
  const [aiPlusEnabled, setAiPlusEnabled] = useState(false);
  const [additionalPrompt, setAdditionalPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestApisOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const suggestions = await suggestApis({
        dataDescription,
        processingPrompt: aiPlusEnabled ? additionalPrompt : undefined,
      });
      setResult(suggestions);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "오류가 발생했습니다.",
        description: "API를 생성하는데 실패했습니다. 나중에 다시 시도해 주세요.",
      })
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid w-full gap-2">
        <Label htmlFor="data-description" className="font-semibold">데이터 설명</Label>
        <Textarea
          id="data-description"
          placeholder="예: '올해 캐나다의 모든 공휴일 목록이 필요합니다.'"
          value={dataDescription}
          onChange={(e) => setDataDescription(e.target.value)}
          rows={4}
          required
          className="focus:!ring-primary focus:ring-2 transition-all"
        />
        <p className="text-sm text-muted-foreground">
          찾고 있는 데이터에 대한 명확하고 간결한 설명을 제공하십시오.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch id="ai-plus" checked={aiPlusEnabled} onCheckedChange={setAiPlusEnabled} />
          <Label htmlFor="ai-plus" className="font-semibold text-primary">AI+</Label>
        </div>

        {aiPlusEnabled && (
           <div className="grid w-full gap-2">
            <Label htmlFor="additional-prompt" className="font-semibold">추가 프롬프트</Label>
            <Textarea
              id="additional-prompt"
              placeholder="예: '데이터를 월별로 그룹화하고 JSON 형식으로 반환합니다.'"
              value={additionalPrompt}
              onChange={(e) => setAdditionalPrompt(e.target.value)}
              rows={3}
              className="focus:!ring-primary focus:ring-2 transition-all"
            />
            <p className="text-sm text-muted-foreground">
              AI가 원하는 방식으로 데이터를 처리하도록 추가 지침을 제공합니다.
            </p>
          </div>
        )}
      </div>


      <Button type="submit" className="w-full font-bold" disabled={loading || !dataDescription}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
        API 생성하기
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
            <CardTitle className="text-xl font-headline">추천 API</CardTitle>
            <CardDescription>귀하의 요구에 맞는 몇 가지 API는 다음과 같습니다.</CardDescription>
          </CardHeader>
          <CardContent>
            {result.apiSuggestions.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {result.apiSuggestions.map((api, index) => (
                  <Badge key={index} variant="secondary" className="text-base py-2 px-4 shadow-sm cursor-pointer hover:bg-primary/10 transition-colors">
                    {api}
                  </Badge>
                ))}
              </div>
            ) : (
             <Alert>
                <Wand2 className="h-4 w-4" />
                <AlertTitle>결과를 찾을 수 없음</AlertTitle>
                <AlertDescription>
                    AI가 귀하의 쿼리에 대한 API를 찾을 수 없습니다. 설명을 바꾸어 다시 시도해 보세요.
                </AlertDescription>
            </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}
