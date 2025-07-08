import { PropertySubmissionForm } from "@/components/property-submission-form";
import { PriceSuggestion } from "@/components/price-suggestion";

export default function SubmitPropertyPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">List your Property</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Join our community of hosts and start earning today.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
             <PropertySubmissionForm />
          </div>
          <div className="lg:col-span-1">
             <PriceSuggestion />
          </div>
        </div>
      </div>
    </div>
  );
}
