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

export function SuggestionsForm() {
  const [dataDescription, setDataDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuggestApisOutput | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const suggestions = await suggestApis({ dataDescription });
      setResult(suggestions);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to fetch AI suggestions. Please try again later.",
      })
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid w-full gap-2">
        <Label htmlFor="data-description" className="font-semibold">Data Description</Label>
        <Textarea
          id="data-description"
          placeholder="e.g., 'I need a list of all public holidays in Canada for the current year.'"
          value={dataDescription}
          onChange={(e) => setDataDescription(e.target.value)}
          rows={4}
          required
          className="focus:!ring-accent focus:ring-2 transition-all"
        />
        <p className="text-sm text-muted-foreground">
          Provide a clear and concise description of the data you're looking for.
        </p>
      </div>
      <Button type="submit" className="w-full !bg-accent hover:!bg-accent/90 !text-accent-foreground font-bold" disabled={loading || !dataDescription}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
        Get Suggestions
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
            <CardTitle className="text-xl font-headline">Suggested APIs</CardTitle>
            <CardDescription>Here are some APIs that might fit your needs.</CardDescription>
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
                <AlertTitle>No Suggestions Found</AlertTitle>
                <AlertDescription>
                    Our AI couldn't find specific API suggestions for your query. Try rephrasing your description.
                </AlertDescription>
            </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </form>
  );
}
