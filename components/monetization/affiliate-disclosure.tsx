"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function AffiliateDisclosure() {
  return (
    <Alert className="border-primary/20 bg-primary/5">
      <Info className="h-4 w-4 text-primary" />
      <AlertTitle className="text-sm font-semibold">Affiliate Disclosure</AlertTitle>
      <AlertDescription className="text-xs text-muted-foreground">
        Some links on this site are affiliate links. We may earn a commission if you make a purchase through these links. 
        This helps us continue providing valuable content and maintaining our platform. We only recommend products and services 
        we believe in and that align with our systems thinking approach.
      </AlertDescription>
    </Alert>
  );
}
