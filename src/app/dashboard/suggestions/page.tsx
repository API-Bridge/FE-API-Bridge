
import { SuggestionsForm } from "@/components/suggestions-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuggestionsPage() {
  return (
    <div className="flex justify-center items-start pt-0 md:pt-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">커스텀API 생성</CardTitle>
          <CardDescription>
            필요한 데이터를 설명하면 AI가 커스텀 API 생성을 도와드립니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SuggestionsForm />
        </CardContent>
      </Card>
    </div>
  );
}
