
"use client";

import { SuggestionsForm } from "@/components/suggestions-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";

export default function SuggestionsPage() {
  const { t } = useLanguage();
  return (
    <div className="flex justify-center items-start pt-0 md:pt-8">
      <Card className="w-full max-w-2xl bg-background/60 backdrop-blur-sm border-border/50 dark:bg-white/5 dark:backdrop-blur-sm dark:border-white/10">
        <CardHeader>
          <CardTitle className="font-headline text-2xl font-korean">{t('suggestions.title')}</CardTitle>
          <CardDescription className="font-korean">
            {t('suggestions.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SuggestionsForm />
        </CardContent>
      </Card>
    </div>
  );
}
