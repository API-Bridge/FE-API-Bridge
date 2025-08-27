
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
import { useLanguage } from "@/contexts/language-context";

export function SuggestionsForm() {
  const { t } = useLanguage();
  const [dataDescription, setDataDescription] = useState("");
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


      <Button type="submit" className="w-full font-bold font-korean" disabled={loading || !dataDescription}>
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
            <CardTitle className="text-xl font-headline font-korean">{t('suggestions.recommendedTitle') || '추천 API'}</CardTitle>
            <CardDescription className="font-korean">{t('suggestions.recommendedDescription') || '귀하의 요구에 맞는 몇 가지 API는 다음과 같습니다.'}</CardDescription>
          </CardHeader>
          <CardContent>
            {result.apiSuggestions.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {result.apiSuggestions.map((api, index) => (
                  <Badge key={index} variant="secondary" className="text-base py-2 px-4 shadow-sm cursor-pointer hover:bg-primary/10 transition-colors font-korean">
                    {api}
                  </Badge>
                ))}
              </div>
            ) : (
             <Alert>
                <Wand2 className="h-4 w-4" />
                <AlertTitle className="font-korean">{t('suggestions.noResultsTitle') || '결과를 찾을 수 없음'}</AlertTitle>
                <AlertDescription className="font-korean">
                    {t('suggestions.noResultsDescription') || 'AI가 귀하의 쿼리에 대한 API를 찾을 수 없습니다. 설명을 바꾸어 다시 시도해 보세요.'}
                </AlertDescription>
            </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}
