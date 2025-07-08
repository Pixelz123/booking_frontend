'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SuggestPriceOutput } from '@/ai/flows/suggest-price';
import { suggestPriceAction } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"


const suggestionSchema = z.object({
  propertyDetails: z.string().min(20, 'Please provide more details about the property.'),
  localMarketData: z.string().min(20, 'Please provide more details about the local market.'),
});

export function PriceSuggestion() {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestPriceOutput | null>(null);
  const { toast } = useToast()

  const form = useForm<z.infer<typeof suggestionSchema>>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      propertyDetails: '',
      localMarketData: '',
    },
  });

  async function onSubmit(values: z.infer<typeof suggestionSchema>) {
    setLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestPriceAction(values);
      setSuggestion(result);
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get price suggestion. Please try again.",
      })
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Wand2 className="text-accent" />
            AI Price Suggestion
        </CardTitle>
        <CardDescription>
          Let our AI help you find the optimal price for your property.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="propertyDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Details</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., 2-bedroom apartment with a city view, modern kitchen, and a balcony..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="localMarketData"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Local Market Data</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., Average price for similar properties is $150. High demand during summer..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Suggest Price'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
        {suggestion && (
            <CardFooter>
            <Alert>
                <AlertTitle className="font-headline flex items-center gap-2">
                    Suggested Price:
                    <span className="text-primary font-bold">${suggestion.suggestedPrice.toFixed(2)}</span>
                </AlertTitle>
                <AlertDescription className="mt-2 text-foreground/80">
                    <strong>Reasoning:</strong> {suggestion.reasoning}
                </AlertDescription>
            </Alert>
            </CardFooter>
        )}
    </Card>
  );
}
