import Script from "next/script";

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  email?: string;
  phone?: string;
}

export function OrganizationSchema({
  name = "AIAS Platform",
  url = "https://aias-platform.com",
  logo = "https://aias-platform.com/logo.png",
  email = "support@aias-platform.com",
  phone = "+1-800-AIAS-HELP",
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    email,
    telephone: phone,
    address: {
      "@type": "PostalAddress",
      addressCountry: "CA",
    },
    sameAs: [
      "https://twitter.com/aias_platform",
      "https://linkedin.com/company/aias-platform",
    ],
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface SoftwareApplicationSchemaProps {
  name?: string;
  description?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
  };
}

export function SoftwareApplicationSchema({
  name = "AIAS Platform",
  description = "AI automation that speaks Canadian business. Save 10+ hours/week with no-code AI agents.",
  applicationCategory = "BusinessApplication",
  operatingSystem = "Web",
  offers = {
    price: "49",
    priceCurrency: "CAD",
  },
}: SoftwareApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "500",
    },
  };

  return (
    <Script
      id="software-application-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
}

export function WebSiteSchema({
  name = "AIAS Platform",
  url = "https://aias-platform.com",
  description = "AI automation that speaks Canadian business",
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
