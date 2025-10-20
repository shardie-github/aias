import { config } from '@ai-consultancy/config';

export interface CRMContact {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  company?: string;
  title?: string;
  tags?: string[];
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMOpportunity {
  id: string;
  name: string;
  amount: number;
  currency: string;
  stage: string;
  probability: number;
  closeDate: Date;
  contactId: string;
  customFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMConfig {
  apiKey: string;
  baseUrl: string;
  version?: string;
}

export abstract class CRMConnector {
  protected config: CRMConfig;

  constructor(config: CRMConfig) {
    this.config = config;
  }

  abstract getContacts(limit?: number, offset?: number): Promise<CRMContact[]>;
  abstract getContact(id: string): Promise<CRMContact | null>;
  abstract createContact(contact: Partial<CRMContact>): Promise<CRMContact>;
  abstract updateContact(id: string, contact: Partial<CRMContact>): Promise<CRMContact>;
  abstract deleteContact(id: string): Promise<boolean>;

  abstract getOpportunities(limit?: number, offset?: number): Promise<CRMOpportunity[]>;
  abstract getOpportunity(id: string): Promise<CRMOpportunity | null>;
  abstract createOpportunity(opportunity: Partial<CRMOpportunity>): Promise<CRMOpportunity>;
  abstract updateOpportunity(id: string, opportunity: Partial<CRMOpportunity>): Promise<CRMOpportunity>;
  abstract deleteOpportunity(id: string): Promise<boolean>;

  abstract searchContacts(query: string): Promise<CRMContact[]>;
  abstract searchOpportunities(query: string): Promise<CRMOpportunity[]>;
}

export class HubSpotConnector extends CRMConnector {
  private baseUrl: string;

  constructor(config: CRMConfig) {
    super(config);
    this.baseUrl = `${config.baseUrl}/crm/v3`;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getContacts(limit = 100, offset = 0): Promise<CRMContact[]> {
    const response = await this.makeRequest(`/objects/contacts?limit=${limit}&offset=${offset}`);
    
    return response.results.map((contact: any) => ({
      id: contact.id,
      email: contact.properties.email,
      firstName: contact.properties.firstname,
      lastName: contact.properties.lastname,
      phone: contact.properties.phone,
      company: contact.properties.company,
      title: contact.properties.jobtitle,
      tags: contact.properties.tags?.split(',').map((tag: string) => tag.trim()) || [],
      customFields: contact.properties,
      createdAt: new Date(contact.createdAt),
      updatedAt: new Date(contact.updatedAt),
    }));
  }

  async getContact(id: string): Promise<CRMContact | null> {
    try {
      const contact = await this.makeRequest(`/objects/contacts/${id}`);
      
      return {
        id: contact.id,
        email: contact.properties.email,
        firstName: contact.properties.firstname,
        lastName: contact.properties.lastname,
        phone: contact.properties.phone,
        company: contact.properties.company,
        title: contact.properties.jobtitle,
        tags: contact.properties.tags?.split(',').map((tag: string) => tag.trim()) || [],
        customFields: contact.properties,
        createdAt: new Date(contact.createdAt),
        updatedAt: new Date(contact.updatedAt),
      };
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createContact(contact: Partial<CRMContact>): Promise<CRMContact> {
    const properties = {
      email: contact.email,
      firstname: contact.firstName,
      lastname: contact.lastName,
      phone: contact.phone,
      company: contact.company,
      jobtitle: contact.title,
      tags: contact.tags?.join(','),
      ...contact.customFields,
    };

    const response = await this.makeRequest('/objects/contacts', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    });

    return {
      id: response.id,
      email: response.properties.email,
      firstName: response.properties.firstname,
      lastName: response.properties.lastname,
      phone: response.properties.phone,
      company: response.properties.company,
      title: response.properties.jobtitle,
      tags: response.properties.tags?.split(',').map((tag: string) => tag.trim()) || [],
      customFields: response.properties,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  }

  async updateContact(id: string, contact: Partial<CRMContact>): Promise<CRMContact> {
    const properties = {
      email: contact.email,
      firstname: contact.firstName,
      lastname: contact.lastName,
      phone: contact.phone,
      company: contact.company,
      jobtitle: contact.title,
      tags: contact.tags?.join(','),
      ...contact.customFields,
    };

    const response = await this.makeRequest(`/objects/contacts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    });

    return {
      id: response.id,
      email: response.properties.email,
      firstName: response.properties.firstname,
      lastName: response.properties.lastname,
      phone: response.properties.phone,
      company: response.properties.company,
      title: response.properties.jobtitle,
      tags: response.properties.tags?.split(',').map((tag: string) => tag.trim()) || [],
      customFields: response.properties,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      await this.makeRequest(`/objects/contacts/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      if (error.message.includes('404')) {
        return false;
      }
      throw error;
    }
  }

  async getOpportunities(limit = 100, offset = 0): Promise<CRMOpportunity[]> {
    const response = await this.makeRequest(`/objects/deals?limit=${limit}&offset=${offset}`);
    
    return response.results.map((deal: any) => ({
      id: deal.id,
      name: deal.properties.dealname,
      amount: parseFloat(deal.properties.amount || '0'),
      currency: deal.properties.currency || 'USD',
      stage: deal.properties.dealstage,
      probability: parseInt(deal.properties.hs_deal_stage_probability || '0'),
      closeDate: new Date(deal.properties.closedate),
      contactId: deal.properties.associated_contact_id,
      customFields: deal.properties,
      createdAt: new Date(deal.createdAt),
      updatedAt: new Date(deal.updatedAt),
    }));
  }

  async getOpportunity(id: string): Promise<CRMOpportunity | null> {
    try {
      const deal = await this.makeRequest(`/objects/deals/${id}`);
      
      return {
        id: deal.id,
        name: deal.properties.dealname,
        amount: parseFloat(deal.properties.amount || '0'),
        currency: deal.properties.currency || 'USD',
        stage: deal.properties.dealstage,
        probability: parseInt(deal.properties.hs_deal_stage_probability || '0'),
        closeDate: new Date(deal.properties.closedate),
        contactId: deal.properties.associated_contact_id,
        customFields: deal.properties,
        createdAt: new Date(deal.createdAt),
        updatedAt: new Date(deal.updatedAt),
      };
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createOpportunity(opportunity: Partial<CRMOpportunity>): Promise<CRMOpportunity> {
    const properties = {
      dealname: opportunity.name,
      amount: opportunity.amount?.toString(),
      currency: opportunity.currency,
      dealstage: opportunity.stage,
      hs_deal_stage_probability: opportunity.probability?.toString(),
      closedate: opportunity.closeDate?.toISOString(),
      associated_contact_id: opportunity.contactId,
      ...opportunity.customFields,
    };

    const response = await this.makeRequest('/objects/deals', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    });

    return {
      id: response.id,
      name: response.properties.dealname,
      amount: parseFloat(response.properties.amount || '0'),
      currency: response.properties.currency || 'USD',
      stage: response.properties.dealstage,
      probability: parseInt(response.properties.hs_deal_stage_probability || '0'),
      closeDate: new Date(response.properties.closedate),
      contactId: response.properties.associated_contact_id,
      customFields: response.properties,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  }

  async updateOpportunity(id: string, opportunity: Partial<CRMOpportunity>): Promise<CRMOpportunity> {
    const properties = {
      dealname: opportunity.name,
      amount: opportunity.amount?.toString(),
      currency: opportunity.currency,
      dealstage: opportunity.stage,
      hs_deal_stage_probability: opportunity.probability?.toString(),
      closedate: opportunity.closeDate?.toISOString(),
      associated_contact_id: opportunity.contactId,
      ...opportunity.customFields,
    };

    const response = await this.makeRequest(`/objects/deals/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    });

    return {
      id: response.id,
      name: response.properties.dealname,
      amount: parseFloat(response.properties.amount || '0'),
      currency: response.properties.currency || 'USD',
      stage: response.properties.dealstage,
      probability: parseInt(response.properties.hs_deal_stage_probability || '0'),
      closeDate: new Date(response.properties.closedate),
      contactId: response.properties.associated_contact_id,
      customFields: response.properties,
      createdAt: new Date(response.createdAt),
      updatedAt: new Date(response.updatedAt),
    };
  }

  async deleteOpportunity(id: string): Promise<boolean> {
    try {
      await this.makeRequest(`/objects/deals/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      if (error.message.includes('404')) {
        return false;
      }
      throw error;
    }
  }

  async searchContacts(query: string): Promise<CRMContact[]> {
    const response = await this.makeRequest(`/objects/contacts/search`, {
      method: 'POST',
      body: JSON.stringify({
        query,
        limit: 100,
      }),
    });

    return response.results.map((contact: any) => ({
      id: contact.id,
      email: contact.properties.email,
      firstName: contact.properties.firstname,
      lastName: contact.properties.lastname,
      phone: contact.properties.phone,
      company: contact.properties.company,
      title: contact.properties.jobtitle,
      tags: contact.properties.tags?.split(',').map((tag: string) => tag.trim()) || [],
      customFields: contact.properties,
      createdAt: new Date(contact.createdAt),
      updatedAt: new Date(contact.updatedAt),
    }));
  }

  async searchOpportunities(query: string): Promise<CRMOpportunity[]> {
    const response = await this.makeRequest(`/objects/deals/search`, {
      method: 'POST',
      body: JSON.stringify({
        query,
        limit: 100,
      }),
    });

    return response.results.map((deal: any) => ({
      id: deal.id,
      name: deal.properties.dealname,
      amount: parseFloat(deal.properties.amount || '0'),
      currency: deal.properties.currency || 'USD',
      stage: deal.properties.dealstage,
      probability: parseInt(deal.properties.hs_deal_stage_probability || '0'),
      closeDate: new Date(deal.properties.closedate),
      contactId: deal.properties.associated_contact_id,
      customFields: deal.properties,
      createdAt: new Date(deal.createdAt),
      updatedAt: new Date(deal.updatedAt),
    }));
  }
}

export class SalesforceConnector extends CRMConnector {
  private baseUrl: string;

  constructor(config: CRMConfig) {
    super(config);
    this.baseUrl = `${config.baseUrl}/services/data/v${config.version || '58.0'}`;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Salesforce API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getContacts(limit = 200, offset = 0): Promise<CRMContact[]> {
    const response = await this.makeRequest(`/query/?q=SELECT Id, Email, FirstName, LastName, Phone, Company, Title FROM Contact LIMIT ${limit} OFFSET ${offset}`);
    
    return response.records.map((contact: any) => ({
      id: contact.Id,
      email: contact.Email,
      firstName: contact.FirstName,
      lastName: contact.LastName,
      phone: contact.Phone,
      company: contact.Company,
      title: contact.Title,
      tags: [],
      customFields: contact,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  async getContact(id: string): Promise<CRMContact | null> {
    try {
      const response = await this.makeRequest(`/sobjects/Contact/${id}`);
      
      return {
        id: response.Id,
        email: response.Email,
        firstName: response.FirstName,
        lastName: response.LastName,
        phone: response.Phone,
        company: response.Company,
        title: response.Title,
        tags: [],
        customFields: response,
        createdAt: new Date(response.CreatedDate),
        updatedAt: new Date(response.LastModifiedDate),
      };
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createContact(contact: Partial<CRMContact>): Promise<CRMContact> {
    const response = await this.makeRequest('/sobjects/Contact', {
      method: 'POST',
      body: JSON.stringify({
        Email: contact.email,
        FirstName: contact.firstName,
        LastName: contact.lastName,
        Phone: contact.phone,
        Company: contact.company,
        Title: contact.title,
        ...contact.customFields,
      }),
    });

    return this.getContact(response.id)!;
  }

  async updateContact(id: string, contact: Partial<CRMContact>): Promise<CRMContact> {
    await this.makeRequest(`/sobjects/Contact/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        Email: contact.email,
        FirstName: contact.firstName,
        LastName: contact.lastName,
        Phone: contact.phone,
        Company: contact.company,
        Title: contact.title,
        ...contact.customFields,
      }),
    });

    return this.getContact(id)!;
  }

  async deleteContact(id: string): Promise<boolean> {
    try {
      await this.makeRequest(`/sobjects/Contact/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      if (error.message.includes('404')) {
        return false;
      }
      throw error;
    }
  }

  async getOpportunities(limit = 200, offset = 0): Promise<CRMOpportunity[]> {
    const response = await this.makeRequest(`/query/?q=SELECT Id, Name, Amount, CurrencyIsoCode, StageName, Probability, CloseDate, ContactId FROM Opportunity LIMIT ${limit} OFFSET ${offset}`);
    
    return response.records.map((opp: any) => ({
      id: opp.Id,
      name: opp.Name,
      amount: opp.Amount || 0,
      currency: opp.CurrencyIsoCode || 'USD',
      stage: opp.StageName,
      probability: opp.Probability || 0,
      closeDate: new Date(opp.CloseDate),
      contactId: opp.ContactId,
      customFields: opp,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  async getOpportunity(id: string): Promise<CRMOpportunity | null> {
    try {
      const response = await this.makeRequest(`/sobjects/Opportunity/${id}`);
      
      return {
        id: response.Id,
        name: response.Name,
        amount: response.Amount || 0,
        currency: response.CurrencyIsoCode || 'USD',
        stage: response.StageName,
        probability: response.Probability || 0,
        closeDate: new Date(response.CloseDate),
        contactId: response.ContactId,
        customFields: response,
        createdAt: new Date(response.CreatedDate),
        updatedAt: new Date(response.LastModifiedDate),
      };
    } catch (error) {
      if (error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async createOpportunity(opportunity: Partial<CRMOpportunity>): Promise<CRMOpportunity> {
    const response = await this.makeRequest('/sobjects/Opportunity', {
      method: 'POST',
      body: JSON.stringify({
        Name: opportunity.name,
        Amount: opportunity.amount,
        CurrencyIsoCode: opportunity.currency,
        StageName: opportunity.stage,
        Probability: opportunity.probability,
        CloseDate: opportunity.closeDate?.toISOString().split('T')[0],
        ContactId: opportunity.contactId,
        ...opportunity.customFields,
      }),
    });

    return this.getOpportunity(response.id)!;
  }

  async updateOpportunity(id: string, opportunity: Partial<CRMOpportunity>): Promise<CRMOpportunity> {
    await this.makeRequest(`/sobjects/Opportunity/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        Name: opportunity.name,
        Amount: opportunity.amount,
        CurrencyIsoCode: opportunity.currency,
        StageName: opportunity.stage,
        Probability: opportunity.probability,
        CloseDate: opportunity.closeDate?.toISOString().split('T')[0],
        ContactId: opportunity.contactId,
        ...opportunity.customFields,
      }),
    });

    return this.getOpportunity(id)!;
  }

  async deleteOpportunity(id: string): Promise<boolean> {
    try {
      await this.makeRequest(`/sobjects/Opportunity/${id}`, {
        method: 'DELETE',
      });
      return true;
    } catch (error) {
      if (error.message.includes('404')) {
        return false;
      }
      throw error;
    }
  }

  async searchContacts(query: string): Promise<CRMContact[]> {
    const response = await this.makeRequest(`/query/?q=SELECT Id, Email, FirstName, LastName, Phone, Company, Title FROM Contact WHERE Name LIKE '%${query}%' OR Email LIKE '%${query}%'`);
    
    return response.records.map((contact: any) => ({
      id: contact.Id,
      email: contact.Email,
      firstName: contact.FirstName,
      lastName: contact.LastName,
      phone: contact.Phone,
      company: contact.Company,
      title: contact.Title,
      tags: [],
      customFields: contact,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  async searchOpportunities(query: string): Promise<CRMOpportunity[]> {
    const response = await this.makeRequest(`/query/?q=SELECT Id, Name, Amount, CurrencyIsoCode, StageName, Probability, CloseDate, ContactId FROM Opportunity WHERE Name LIKE '%${query}%'`);
    
    return response.records.map((opp: any) => ({
      id: opp.Id,
      name: opp.Name,
      amount: opp.Amount || 0,
      currency: opp.CurrencyIsoCode || 'USD',
      stage: opp.StageName,
      probability: opp.Probability || 0,
      closeDate: new Date(opp.CloseDate),
      contactId: opp.ContactId,
      customFields: opp,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }
}

export class CRMConnectorFactory {
  static createConnector(type: 'hubspot' | 'salesforce', config: CRMConfig): CRMConnector {
    switch (type) {
      case 'hubspot':
        return new HubSpotConnector(config);
      case 'salesforce':
        return new SalesforceConnector(config);
      default:
        throw new Error(`Unsupported CRM type: ${type}`);
    }
  }
}
