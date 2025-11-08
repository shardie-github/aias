// Partnership and lead generation system
export interface PartnershipTier {
  id: string;
  name: string;
  description: string;
  requirements: {
    minRevenue: number;
    minCustomers: number;
    minReferrals: number;
  };
  benefits: {
    commission: number; // Percentage
    bonus: number; // Fixed amount per qualified lead
    support: string;
    resources: string[];
    coMarketing: boolean;
    whiteLabel: boolean;
  };
  status: 'active' | 'inactive';
}

export interface Lead {
  id: string;
  email: string;
  name: string;
  company: string;
  title: string;
  source: 'website' | 'referral' | 'partnership' | 'advertising' | 'content';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed_won' | 'closed_lost';
  value: number; // Estimated deal value
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
  tags: string[];
  customFields: Record<string, any>;
}

export interface Referral {
  id: string;
  partnerId: string;
  leadId: string;
  commission: number;
  status: 'pending' | 'qualified' | 'paid' | 'cancelled';
  createdAt: Date;
  paidAt?: Date;
}

export interface Partner {
  id: string;
  name: string;
  email: string;
  company: string;
  website: string;
  tier: PartnershipTier;
  status: 'active' | 'inactive' | 'suspended';
  joinedAt: Date;
  totalReferrals: number;
  totalCommission: number;
  pendingCommission: number;
  customTrackingCode: string;
  whiteLabelConfig?: {
    domain: string;
    branding: {
      logo: string;
      colors: {
        primary: string;
        secondary: string;
      };
      companyName: string;
    };
  };
}

export const PARTNERSHIP_TIERS: PartnershipTier[] = [
  {
    id: 'bronze',
    name: 'Bronze Partner',
    description: 'Entry-level partnership for small agencies and consultants',
    requirements: {
      minRevenue: 0,
      minCustomers: 0,
      minReferrals: 0
    },
    benefits: {
      commission: 0.15, // 15%
      bonus: 50,
      support: 'Email support',
      resources: ['Basic marketing materials', 'Product documentation'],
      coMarketing: false,
      whiteLabel: false
    },
    status: 'active'
  },
  {
    id: 'silver',
    name: 'Silver Partner',
    description: 'Mid-tier partnership for established agencies',
    requirements: {
      minRevenue: 10000,
      minCustomers: 5,
      minReferrals: 3
    },
    benefits: {
      commission: 0.20, // 20%
      bonus: 100,
      support: 'Priority support',
      resources: [
        'Advanced marketing materials',
        'Product documentation',
        'Sales training',
        'Demo environment'
      ],
      coMarketing: true,
      whiteLabel: false
    },
    status: 'active'
  },
  {
    id: 'gold',
    name: 'Gold Partner',
    description: 'Premium partnership for large agencies and system integrators',
    requirements: {
      minRevenue: 50000,
      minCustomers: 20,
      minReferrals: 10
    },
    benefits: {
      commission: 0.25, // 25%
      bonus: 250,
      support: 'Dedicated account manager',
      resources: [
        'All marketing materials',
        'Product documentation',
        'Sales training',
        'Demo environment',
        'Custom integrations',
        'Joint webinars'
      ],
      coMarketing: true,
      whiteLabel: true
    },
    status: 'active'
  },
  {
    id: 'platinum',
    name: 'Platinum Partner',
    description: 'Elite partnership for strategic partners and enterprise resellers',
    requirements: {
      minRevenue: 100000,
      minCustomers: 50,
      minReferrals: 25
    },
    benefits: {
      commission: 0.30, // 30%
      bonus: 500,
      support: 'Dedicated team',
      resources: [
        'All resources',
        'Custom development',
        'Joint go-to-market',
        'Executive briefings',
        'Early access to features'
      ],
      coMarketing: true,
      whiteLabel: true
    },
    status: 'active'
  }
];

export class PartnershipService {
  private supabase: any;
  private analytics: any;

  constructor(supabase: any, analytics: any) {
    this.supabase = supabase;
    this.analytics = analytics;
  }

  // Partner management
  async createPartner(partnerData: Omit<Partner, 'id' | 'joinedAt' | 'totalReferrals' | 'totalCommission' | 'pendingCommission' | 'customTrackingCode'>): Promise<Partner> {
    const customTrackingCode = this.generateTrackingCode();
    
    const { data, error } = await this.supabase
      .from('partners')
      .insert({
        ...partnerData,
        custom_tracking_code: customTrackingCode,
        joined_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    await this.analytics.trackEvent('partner_created', {
      partner_id: data.id,
      tier: partnerData.tier.id,
      company: partnerData.company
    });

    return data;
  }

  async updatePartner(partnerId: string, updates: Partial<Partner>): Promise<Partner> {
    const { data, error } = await this.supabase
      .from('partners')
      .update(updates)
      .eq('id', partnerId)
      .select()
      .single();

    if (error) throw error;

    await this.analytics.trackEvent('partner_updated', {
      partner_id: partnerId,
      updates: Object.keys(updates)
    });

    return data;
  }

  // Lead management
  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const { data, error } = await this.supabase
      .from('leads')
      .insert({
        ...leadData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    await this.analytics.trackEvent('lead_created', {
      lead_id: data.id,
      source: leadData.source,
      value: leadData.value,
      priority: leadData.priority
    });

    return data;
  }

  async updateLeadStatus(leadId: string, status: Lead['status'], notes?: string): Promise<Lead> {
    const { data, error } = await this.supabase
      .from('leads')
      .update({
        status,
        updated_at: new Date().toISOString(),
        notes: notes ? `${data?.notes || ''}\n${new Date().toISOString()}: ${notes}` : data?.notes
      })
      .eq('id', leadId)
      .select()
      .single();

    if (error) throw error;

    await this.analytics.trackEvent('lead_status_updated', {
      lead_id: leadId,
      status,
      previous_status: data?.status
    });

    return data;
  }

  // Referral tracking
  async trackReferral(partnerId: string, leadId: string, commission: number): Promise<Referral> {
    const { data, error } = await this.supabase
      .from('referrals')
      .insert({
        partner_id: partnerId,
        lead_id: leadId,
        commission,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;

    await this.analytics.trackRevenue('referral_created', commission, 'USD', {
      partner_id: partnerId,
      lead_id: leadId
    });

    return data;
  }

  async qualifyReferral(referralId: string): Promise<Referral> {
    const { data, error } = await this.supabase
      .from('referrals')
      .update({ status: 'qualified' })
      .eq('id', referralId)
      .select()
      .single();

    if (error) throw error;

    await this.analytics.trackEvent('referral_qualified', {
      referral_id: referralId,
      partner_id: data.partner_id,
      commission: data.commission
    });

    return data;
  }

  async payReferral(referralId: string): Promise<Referral> {
    const { data, error } = await this.supabase
      .from('referrals')
      .update({ 
        status: 'paid',
        paid_at: new Date().toISOString()
      })
      .eq('id', referralId)
      .select()
      .single();

    if (error) throw error;

    await this.analytics.trackRevenue('referral_paid', data.commission, 'USD', {
      referral_id: referralId,
      partner_id: data.partner_id
    });

    return data;
  }

  // Lead scoring and qualification
  async scoreLead(lead: Lead): Promise<{ score: number; factors: string[] }> {
    let score = 0;
    const factors: string[] = [];

    // Company size scoring
    if (lead.company) {
      const companySize = await this.getCompanySize(lead.company);
      if (companySize > 1000) {
        score += 30;
        factors.push('Large company');
      } else if (companySize > 100) {
        score += 20;
        factors.push('Medium company');
      } else if (companySize > 10) {
        score += 10;
        factors.push('Small company');
      }
    }

    // Title scoring
    const executiveTitles = ['ceo', 'cto', 'cfo', 'vp', 'director', 'head of'];
    if (executiveTitles.some(title => lead.title?.toLowerCase().includes(title))) {
      score += 25;
      factors.push('Executive title');
    }

    // Industry scoring
    const highValueIndustries = ['technology', 'finance', 'healthcare', 'manufacturing'];
    if (highValueIndustries.some(industry => 
      lead.company?.toLowerCase().includes(industry) || 
      lead.notes?.toLowerCase().includes(industry)
    )) {
      score += 20;
      factors.push('High-value industry');
    }

    // Engagement scoring
    if (lead.tags.includes('demo_requested')) {
      score += 15;
      factors.push('Requested demo');
    }
    if (lead.tags.includes('pricing_inquired')) {
      score += 10;
      factors.push('Pricing inquiry');
    }
    if (lead.tags.includes('enterprise')) {
      score += 20;
      factors.push('Enterprise interest');
    }

    // Source scoring
    if (lead.source === 'referral') {
      score += 15;
      factors.push('Referral source');
    }

    return { score: Math.min(score, 100), factors };
  }

  // White-label configuration
  async createWhiteLabelConfig(partnerId: string, config: Partner['whiteLabelConfig']): Promise<void> {
    const { error } = await this.supabase
      .from('partners')
      .update({ white_label_config: config })
      .eq('id', partnerId);

    if (error) throw error;

    await this.analytics.trackEvent('white_label_configured', {
      partner_id: partnerId,
      domain: config?.domain
    });
  }

  // Analytics and reporting
  async getPartnerPerformance(partnerId: string, period: 'month' | 'quarter' | 'year' = 'month') {
    const startDate = this.getPeriodStart(period);
    const endDate = new Date();

    const { data: referrals } = await this.supabase
      .from('referrals')
      .select('commission, status, created_at')
      .eq('partner_id', partnerId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const { data: leads } = await this.supabase
      .from('leads')
      .select('id, value, status, created_at')
      .eq('source', 'referral')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString());

    const totalReferrals = referrals?.length || 0;
    const qualifiedReferrals = referrals?.filter(r => r.status === 'qualified').length || 0;
    const paidReferrals = referrals?.filter(r => r.status === 'paid').length || 0;
    const totalCommission = referrals?.reduce((sum, r) => sum + r.commission, 0) || 0;
    const totalLeadValue = leads?.reduce((sum, l) => sum + l.value, 0) || 0;

    return {
      totalReferrals,
      qualifiedReferrals,
      paidReferrals,
      totalCommission,
      totalLeadValue,
      conversionRate: totalReferrals > 0 ? (qualifiedReferrals / totalReferrals) * 100 : 0,
      averageCommission: totalReferrals > 0 ? totalCommission / totalReferrals : 0
    };
  }

  private generateTrackingCode(): string {
    return 'aias_' + Math.random().toString(36).substr(2, 9);
  }

  private async getCompanySize(companyName: string): Promise<number> {
    // This would typically integrate with a company data API like Clearbit or ZoomInfo
    // For now, return a mock value
    return Math.floor(Math.random() * 5000) + 10;
  }

  private getPeriodStart(period: string): Date {
    const now = new Date();
    switch (period) {
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1);
      case 'quarter':
        const quarter = Math.floor(now.getMonth() / 3);
        return new Date(now.getFullYear(), quarter * 3, 1);
      case 'year':
        return new Date(now.getFullYear(), 0, 1);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }
}

// Lead generation utilities
export const generateLeadMagnet = (type: 'ebook' | 'webinar' | 'template' | 'demo') => {
  const magnets = {
    ebook: {
      title: 'The Complete Guide to AI Automation for Business',
      description: 'Learn how to implement AI automation in your business with our comprehensive guide.',
      value: 'High-value content that positions AIAS as thought leaders'
    },
    webinar: {
      title: 'AI Automation Masterclass: From Strategy to Implementation',
      description: 'Join our experts for a live session on AI automation best practices.',
      value: 'Interactive content that allows for direct engagement and qualification'
    },
    template: {
      title: 'AI Workflow Template Library',
      description: 'Get instant access to 50+ proven AI workflow templates.',
      value: 'Immediate value that showcases product capabilities'
    },
    demo: {
      title: 'Personalized AI Automation Demo',
      description: 'See how AI automation can transform your specific business processes.',
      value: 'High-intent lead generation with immediate qualification opportunity'
    }
  };

  return magnets[type];
};

export const createReferralLink = (partnerId: string, campaign?: string): string => {
  // Get base URL from environment variables dynamically
  let baseUrl: string;
  if (typeof process !== 'undefined' && process.env) {
    baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
              process.env.NEXT_PUBLIC_APP_URL || 
              process.env.NEXTAUTH_URL || 
              process.env.VITE_APP_URL || 
              'https://aias-consultancy.com';
  } else if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    baseUrl = import.meta.env.VITE_APP_URL || 
              import.meta.env.NEXT_PUBLIC_SITE_URL || 
              'https://aias-consultancy.com';
  } else {
    baseUrl = 'https://aias-consultancy.com';
  }
  
  const params = new URLSearchParams({
    ref: partnerId,
    ...(campaign && { campaign })
  });
  
  return `${baseUrl}?${params.toString()}`;
};