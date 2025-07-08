'use client';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';


const propertySchema = z.object({
  name: z.string().min(5, 'Property name must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  type: z.string().min(1, 'Please select a property type.'),
  city: z.string().min(2, 'City is required.'),
  country: z.string().min(2, 'Country is required.'),
  pricePerNight: z.coerce.number().min(1, 'Price must be greater than 0.'),
  guests: z.coerce.number().min(1, 'Must accommodate at least 1 guest.'),
  bedrooms: z.coerce.number().min(1, 'Must have at least 1 bedroom.'),
  bathrooms: z.coerce.number().min(1, 'Must have at least 1 bathroom.'),
});

export function PropertySubmissionForm() {
  const [submissionPayload, setSubmissionPayload] = useState('');
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof propertySchema>>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: '',
      description: '',
      city: '',
      country: '',
      pricePerNight: 100,
      guests: 2,
      bedrooms: 1,
      bathrooms: 1,
    },
  });

  function onSubmit(values: z.infer<typeof propertySchema>) {
    setSubmissionPayload(JSON.stringify(values, null, 2));
    setIsAlertOpen(true);
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Property Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Cozy Beachfront Cottage" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us about your property" rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder="Select a property type" />
                          </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                          <SelectItem value="Apartment">Apartment</SelectItem>
                          <SelectItem value="House">House</SelectItem>
                          <SelectItem value="Cottage">Cottage</SelectItem>
                          <SelectItem value="Studio">Studio</SelectItem>
                          <SelectItem value="Cabin">Cabin</SelectItem>
                          </SelectContent>
                      </Select>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                  <FormField
                      control={form.control}
                      name="pricePerNight"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Price per night ($)</FormLabel>
                          <FormControl>
                              <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g. Paris" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
                  <FormField
                      control={form.control}
                      name="country"
                      render={({ field }) => (
                          <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                              <Input placeholder="e.g. France" {...field} />
                          </FormControl>
                          <FormMessage />
                          </FormItem>
                      )}
                  />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormField control={form.control} name="guests" render={({ field }) => (
                      <FormItem><FormLabel>Guests</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="bedrooms" render={({ field }) => (
                      <FormItem><FormLabel>Bedrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
                  <FormField control={form.control} name="bathrooms" render={({ field }) => (
                      <FormItem><FormLabel>Bathrooms</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                  )}/>
              </div>

              <Button type="submit" className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90">
                Submit Property
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogContent>
              <AlertDialogHeader>
                  <AlertDialogTitle>Property Submission Payload</AlertDialogTitle>
                  <AlertDialogDescription>
                      This is the JSON data that would be sent to the backend.
                  </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4 max-h-60 overflow-y-auto rounded-md border bg-muted p-4">
                  <pre className="text-sm text-muted-foreground">
                      <code>{submissionPayload}</code>
                  </pre>
              </div>
              <AlertDialogFooter>
                  <AlertDialogAction onClick={() => {
                      setIsAlertOpen(false);
                      form.reset();
                      toast({
                          title: "Property Submitted!",
                          description: "Your property has been successfully listed (simulation).",
                      });
                  }}>
                      Confirm & Close
                  </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
      </AlertDialog>
    </>
  );
}