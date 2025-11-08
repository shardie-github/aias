// Comprehensive SEO optimization system
// Get base URL from environment variables dynamically
function getBaseUrl(): string {
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NEXT_PUBLIC_SITE_URL || 
           process.env.NEXT_PUBLIC_APP_URL || 
           process.env.NEXTAUTH_URL || 
           'https://aias-consultancy.com';
  }
  if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env.VITE_APP_URL || 
           import.meta.env.NEXT_PUBLIC_SITE_URL || 
           'https://aias-consultancy.com';
  }
  return 'https://aias-consultancy.com';
}

const BASE_URL = getBaseUrl();

export interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  structuredData?: any;
  robots?: string;
  alternate?: Array<{
    hreflang: string;
    href: string;
  }>;
}

export interface PageSEO {
  [key: string]: SEOConfig;
}

export const PAGE_SEO: PageSEO = {
  home: {
    title: 'AIAS - AI Agent Solutions | Enterprise AI Automation Consultancy',
    description: 'Transform your business with custom AI agents and intelligent automation. Enterprise-grade AI consultancy specializing in workflow automation, AI implementation, and digital transformation.',
    keywords: [
      'AI consultancy',
      'AI automation',
      'artificial intelligence',
      'workflow automation',
      'AI agents',
      'digital transformation',
      'AI implementation',
      'business automation',
      'AI consulting services',
      'enterprise AI'
    ],
    canonical: `${BASE_URL}`,
    ogTitle: 'AIAS - AI Agent Solutions | Enterprise AI Automation',
    ogDescription: 'Transform your business with custom AI agents and intelligent automation. Expert AI consultancy for enterprise digital transformation.',
    ogImage: `${BASE_URL}/og-image.jpg`,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '@aias_consultancy',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AIAS - AI Agent Solutions',
      url: BASE_URL,
      logo: `${BASE_URL}/logo.png`,
      description: 'Enterprise-grade AI consultancy platform showcasing custom AI agents, workflow automation, and intelligent business solutions.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-AIAS-123',
        contactType: 'customer service',
        availableLanguage: 'English'
      },
      sameAs: [
        'https://linkedin.com/company/aias-consultancy',
        'https://twitter.com/aias_consultancy',
        'https://github.com/aias-consultancy'
      ]
    },
    robots: 'index, follow'
  },
  services: {
    title: 'AI Consulting Services | Custom AI Solutions & Implementation',
    description: 'Comprehensive AI consulting services including custom AI agent development, workflow automation, and enterprise AI implementation. Expert guidance for your digital transformation.',
    keywords: [
      'AI consulting services',
      'custom AI solutions',
      'AI implementation',
      'AI strategy consulting',
      'AI transformation',
      'AI advisory services',
      'AI project management',
      'AI technology consulting'
    ],
    canonical: `${BASE_URL}/services`,
    ogTitle: 'AI Consulting Services | Custom AI Solutions',
    ogDescription: 'Expert AI consulting services for custom AI solutions, workflow automation, and enterprise implementation.',
    ogImage: `${BASE_URL}/services-og.jpg`,
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'AI Consulting Services',
      provider: {
        '@type': 'Organization',
        name: 'AIAS - AI Agent Solutions'
      },
      description: 'Comprehensive AI consulting services for enterprise digital transformation.',
      serviceType: 'AI Consulting',
      areaServed: 'Worldwide',
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'AI Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'AI Strategy Consulting'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Custom AI Agent Development'
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Workflow Automation'
            }
          }
        ]
      }
    }
  },
  pricing: {
    title: 'AI Consulting Pricing | Transparent AI Service Costs',
    description: 'Transparent pricing for AI consulting services. Choose from flexible plans for AI automation, custom AI solutions, and enterprise AI implementation.',
    keywords: [
      'AI consulting pricing',
      'AI services cost',
      'AI automation pricing',
      'AI implementation cost',
      'AI consultancy rates',
      'AI project pricing',
      'AI solution pricing'
    ],
    canonical: `${BASE_URL}/pricing`,
    ogTitle: 'AI Consulting Pricing | Transparent AI Service Costs',
    ogDescription: 'Transparent pricing for AI consulting services. Flexible plans for AI automation and custom solutions.',
    ogImage: `${BASE_URL}/pricing-og.jpg`,
    ogType: 'website'
  },
  caseStudies: {
    title: 'AI Success Stories | Real-World AI Implementation Case Studies',
    description: 'Explore real-world AI implementation success stories and case studies. See how businesses transformed with our AI consulting services.',
    keywords: [
      'AI case studies',
      'AI success stories',
      'AI implementation examples',
      'AI transformation stories',
      'AI project case studies',
      'AI automation success',
      'AI consulting results'
    ],
    canonical: `${BASE_URL}/case-studies`,
    ogTitle: 'AI Success Stories | Real-World AI Implementation',
    ogDescription: 'Real-world AI implementation success stories and case studies from our consulting projects.',
    ogImage: `${BASE_URL}/case-studies-og.jpg`,
    ogType: 'website'
  },
  platform: {
    title: 'AI Automation Platform | Self-Service AI Workflow Builder',
    description: 'Build and deploy AI workflows with our self-service platform. No-code AI automation tools for businesses of all sizes.',
    keywords: [
      'AI automation platform',
      'AI workflow builder',
      'no-code AI',
      'AI platform',
      'AI workflow automation',
      'self-service AI',
      'AI tools',
      'AI software'
    ],
    canonical: `${BASE_URL}/platform`,
    ogTitle: 'AI Automation Platform | Self-Service AI Workflow Builder',
    ogDescription: 'Build and deploy AI workflows with our self-service platform. No-code AI automation tools.',
    ogImage: `${BASE_URL}/platform-og.jpg`,
    ogType: 'website'
  }
};

export class SEOService {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || getBaseUrl();
  }

  // Generate meta tags for a page
  generateMetaTags(config: SEOConfig): Array<{ name: string; content: string }> {
    const tags = [
      { name: 'description', content: config.description },
      { name: 'keywords', content: config.keywords.join(', ') },
      { name: 'robots', content: config.robots || 'index, follow' },
      { name: 'author', content: 'AIAS - AI Agent Solutions' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { name: 'theme-color', content: '#1e40af' }
    ];

    // Open Graph tags
    if (config.ogTitle) {
      tags.push({ name: 'og:title', content: config.ogTitle });
    }
    if (config.ogDescription) {
      tags.push({ name: 'og:description', content: config.ogDescription });
    }
    if (config.ogImage) {
      tags.push({ name: 'og:image', content: config.ogImage });
    }
    if (config.ogType) {
      tags.push({ name: 'og:type', content: config.ogType });
    }
    tags.push({ name: 'og:url', content: config.canonical });
    tags.push({ name: 'og:site_name', content: 'AIAS - AI Agent Solutions' });

    // Twitter Card tags
    if (config.twitterCard) {
      tags.push({ name: 'twitter:card', content: config.twitterCard });
    }
    if (config.twitterSite) {
      tags.push({ name: 'twitter:site', content: config.twitterSite });
    }
    if (config.twitterCreator) {
      tags.push({ name: 'twitter:creator', content: config.twitterCreator });
    }

    return tags;
  }

  // Generate structured data
  generateStructuredData(config: SEOConfig): string {
    if (!config.structuredData) return '';
    
    return JSON.stringify({
      ...config.structuredData,
      '@context': 'https://schema.org'
    });
  }

  // Generate sitemap
  generateSitemap(pages: Array<{ url: string; lastmod: string; changefreq: string; priority: number }>): string {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${this.baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return sitemap;
  }

  // Generate robots.txt
  generateRobotsTxt(): string {
    return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${this.baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /private/

# Allow important pages
Allow: /
Allow: /services
Allow: /pricing
Allow: /case-studies
Allow: /platform
Allow: /about
Allow: /contact`;
  }

  // Generate breadcrumb structured data
  generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>): string {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: `${this.baseUrl}${item.url}`
      }))
    };

    return JSON.stringify(structuredData);
  }

  // Generate FAQ structured data
  generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): string {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    return JSON.stringify(structuredData);
  }

  // Generate organization structured data
  generateOrganizationStructuredData(): string {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'AIAS - AI Agent Solutions',
      url: this.baseUrl,
      logo: `${this.baseUrl}/logo.png`,
      description: 'Enterprise-grade AI consultancy platform showcasing custom AI agents, workflow automation, and intelligent business solutions.',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-AIAS-123',
        contactType: 'customer service',
        availableLanguage: 'English'
      },
      sameAs: [
        'https://linkedin.com/company/aias-consultancy',
        'https://twitter.com/aias_consultancy',
        'https://github.com/aias-consultancy'
      ]
    };

    return JSON.stringify(structuredData);
  }
}

// SEO utilities
export const generatePageTitle = (page: string, siteName: string = 'AIAS'): string => {
  const pageTitles: Record<string, string> = {
    home: 'AI Agent Solutions | Enterprise AI Automation Consultancy',
    services: 'AI Consulting Services | Custom AI Solutions & Implementation',
    pricing: 'AI Consulting Pricing | Transparent AI Service Costs',
    caseStudies: 'AI Success Stories | Real-World AI Implementation Case Studies',
    platform: 'AI Automation Platform | Self-Service AI Workflow Builder',
    about: 'About AIAS | Leading AI Consultancy & Automation Experts',
    contact: 'Contact AIAS | Get Started with AI Automation Today',
    blog: 'AI Insights & Automation Tips | AIAS Blog',
    partners: 'Partner with AIAS | AI Consultancy Partnership Program'
  };

  const pageTitle = pageTitles[page] || 'AIAS - AI Agent Solutions';
  return `${pageTitle} | ${siteName}`;
};

export const generateMetaDescription = (page: string): string => {
  const descriptions: Record<string, string> = {
    home: 'Transform your business with custom AI agents and intelligent automation. Enterprise-grade AI consultancy specializing in workflow automation, AI implementation, and digital transformation.',
    services: 'Comprehensive AI consulting services including custom AI agent development, workflow automation, and enterprise AI implementation. Expert guidance for your digital transformation.',
    pricing: 'Transparent pricing for AI consulting services. Choose from flexible plans for AI automation, custom AI solutions, and enterprise AI implementation.',
    caseStudies: 'Explore real-world AI implementation success stories and case studies. See how businesses transformed with our AI consulting services.',
    platform: 'Build and deploy AI workflows with our self-service platform. No-code AI automation tools for businesses of all sizes.',
    about: 'Learn about AIAS, the leading AI consultancy specializing in enterprise automation, custom AI solutions, and digital transformation.',
    contact: 'Get in touch with AIAS for AI consulting services. Start your AI automation journey with expert guidance and support.',
    blog: 'Stay updated with the latest AI insights, automation tips, and industry trends from AIAS experts.',
    partners: 'Join the AIAS partner program and help businesses transform with AI automation. Earn commissions and grow with us.'
  };

  return descriptions[page] || 'AIAS - AI Agent Solutions for Enterprise Automation';
};

export const generateKeywords = (page: string): string[] => {
  const keywordSets: Record<string, string[]> = {
    home: [
      'AI consultancy', 'AI automation', 'artificial intelligence', 'workflow automation',
      'AI agents', 'digital transformation', 'AI implementation', 'business automation'
    ],
    services: [
      'AI consulting services', 'custom AI solutions', 'AI implementation', 'AI strategy consulting',
      'AI transformation', 'AI advisory services', 'AI project management'
    ],
    pricing: [
      'AI consulting pricing', 'AI services cost', 'AI automation pricing', 'AI implementation cost',
      'AI consultancy rates', 'AI project pricing'
    ],
    caseStudies: [
      'AI case studies', 'AI success stories', 'AI implementation examples', 'AI transformation stories',
      'AI project case studies', 'AI automation success'
    ],
    platform: [
      'AI automation platform', 'AI workflow builder', 'no-code AI', 'AI platform',
      'AI workflow automation', 'self-service AI', 'AI tools'
    ]
  };

  return keywordSets[page] || ['AI consultancy', 'AI automation', 'artificial intelligence'];
};