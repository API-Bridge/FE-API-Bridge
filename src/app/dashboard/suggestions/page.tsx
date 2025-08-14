import { SuggestionsForm } from "@/components/suggestions-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuggestionsPage() {
  return (
    <div className="flex justify-center items-start pt-0 md:pt-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">AI API Suggestions</CardTitle>
          <CardDescription>
            Describe the data you need, and our AI will suggest relevant APIs for you to use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SuggestionsForm />
        </CardContent>
      </Card>
    </div>
  );
}
