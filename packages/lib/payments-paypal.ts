import { config } from '@ai-consultancy/config';
import { prisma } from './database';

export interface PayPalConfig {
  clientId: string;
  clientSecret: string;
  environment: 'sandbox' | 'production';
  webhookId?: string;
}

export interface CreatePayPalOrderParams {
  amount: number;
  currency: string;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  customId?: string;
  metadata?: Record<string, string>;
}

export interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    href: string;
    rel: string;
    method: string;
  }>;
}

export class PayPalService {
  private config: PayPalConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      clientId: config.paypal?.clientId || '',
      clientSecret: config.paypal?.clientSecret || '',
      environment: config.paypal?.environment || 'sandbox',
      webhookId: config.paypal?.webhookId,
    };
    
    this.baseUrl = this.config.environment === 'production' 
      ? 'https://api-m.paypal.com'
      : 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      throw new Error(`PayPal authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  async createOrder(params: CreatePayPalOrderParams): Promise<PayPalOrderResponse> {
    const accessToken = await this.getAccessToken();

    const orderData = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: params.currency,
            value: params.amount.toFixed(2),
          },
          description: params.description,
          custom_id: params.customId,
          soft_descriptor: 'AI Consultancy',
        },
      ],
      application_context: {
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
        brand_name: 'AI Consultancy',
        landing_page: 'NO_PREFERENCE',
        user_action: 'PAY_NOW',
      },
    };

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `order-${Date.now()}`,
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal order creation failed: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  async captureOrder(orderId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `capture-${Date.now()}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal order capture failed: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  async getOrder(orderId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v2/checkout/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PayPal order retrieval failed: ${response.statusText}`);
    }

    return response.json();
  }

  async createSubscription(params: {
    planId: string;
    returnUrl: string;
    cancelUrl: string;
    customId?: string;
  }): Promise<any> {
    const accessToken = await this.getAccessToken();

    const subscriptionData = {
      plan_id: params.planId,
      start_time: new Date(Date.now() + 60000).toISOString(), // Start in 1 minute
      subscriber: {
        name: {
          given_name: 'Customer',
          surname: 'Name',
        },
        email_address: 'customer@example.com',
      },
      application_context: {
        brand_name: 'AI Consultancy',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        payment_method: {
          payer_selected: 'PAYPAL',
          payee_preferred: 'IMMEDIATE_PAYMENT_REQUIRED',
        },
        return_url: params.returnUrl,
        cancel_url: params.cancelUrl,
      },
    };

    const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'PayPal-Request-Id': `subscription-${Date.now()}`,
      },
      body: JSON.stringify(subscriptionData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal subscription creation failed: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  async getSubscription(subscriptionId: string): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`PayPal subscription retrieval failed: ${response.statusText}`);
    }

    return response.json();
  }

  async cancelSubscription(subscriptionId: string, reason: string = 'Customer requested cancellation'): Promise<any> {
    const accessToken = await this.getAccessToken();

    const response = await fetch(`${this.baseUrl}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        reason,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`PayPal subscription cancellation failed: ${error.message || response.statusText}`);
    }

    return response.json();
  }

  async verifyWebhookSignature(payload: string, signature: string, webhookId?: string): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    const id = webhookId || this.config.webhookId;

    if (!id) {
      throw new Error('PayPal webhook ID not configured');
    }

    const response = await fetch(`${this.baseUrl}/v1/notifications/verify-webhook-signature`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth_algo: 'SHA256withRSA',
        cert_id: 'webhook-cert-id', // This would need to be retrieved from PayPal
        transmission_id: 'webhook-transmission-id', // This would need to be extracted from headers
        transmission_sig: signature,
        transmission_time: new Date().toISOString(),
        webhook_id: id,
        webhook_event: JSON.parse(payload),
      }),
    });

    if (!response.ok) {
      console.error('PayPal webhook verification failed:', response.statusText);
      return false;
    }

    const result = await response.json();
    return result.verification_status === 'SUCCESS';
  }

  async handleWebhookEvent(event: any) {
    switch (event.event_type) {
      case 'CHECKOUT.ORDER.APPROVED':
        await this.handleOrderApproved(event);
        break;
      case 'PAYMENT.CAPTURE.COMPLETED':
        await this.handlePaymentCompleted(event);
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        await this.handlePaymentDenied(event);
        break;
      case 'BILLING.SUBSCRIPTION.CREATED':
        await this.handleSubscriptionCreated(event);
        break;
      case 'BILLING.SUBSCRIPTION.ACTIVATED':
        await this.handleSubscriptionActivated(event);
        break;
      case 'BILLING.SUBSCRIPTION.CANCELLED':
        await this.handleSubscriptionCancelled(event);
        break;
      case 'BILLING.SUBSCRIPTION.SUSPENDED':
        await this.handleSubscriptionSuspended(event);
        break;
      default:
        console.log(`Unhandled PayPal event type: ${event.event_type}`);
    }
  }

  private async handleOrderApproved(event: any) {
    const orderId = event.resource.id;
    console.log('PayPal order approved:', orderId);
    
    // Store the order approval event
    await prisma.webhookEvent.create({
      data: {
        source: 'paypal',
        event: 'order.approved',
        payload: event,
        orgId: event.resource.custom_id || 'unknown',
      },
    });
  }

  private async handlePaymentCompleted(event: any) {
    const paymentId = event.resource.id;
    const orderId = event.resource.supplementary_data?.related_ids?.order_id;
    
    console.log('PayPal payment completed:', paymentId, 'for order:', orderId);
    
    // Update subscription status in database
    if (orderId) {
      await prisma.subscription.updateMany({
        where: { 
          stripeSubscriptionId: orderId, // Using this field to store PayPal order ID
        },
        data: {
          status: 'ACTIVE',
        },
      });
    }
  }

  private async handlePaymentDenied(event: any) {
    const paymentId = event.resource.id;
    console.log('PayPal payment denied:', paymentId);
    
    // Handle payment failure
    await prisma.webhookEvent.create({
      data: {
        source: 'paypal',
        event: 'payment.denied',
        payload: event,
        orgId: 'unknown',
      },
    });
  }

  private async handleSubscriptionCreated(event: any) {
    const subscriptionId = event.resource.id;
    console.log('PayPal subscription created:', subscriptionId);
    
    // Store subscription creation event
    await prisma.webhookEvent.create({
      data: {
        source: 'paypal',
        event: 'subscription.created',
        payload: event,
        orgId: 'unknown',
      },
    });
  }

  private async handleSubscriptionActivated(event: any) {
    const subscriptionId = event.resource.id;
    console.log('PayPal subscription activated:', subscriptionId);
    
    // Update subscription status
    await prisma.subscription.updateMany({
      where: { 
        stripeSubscriptionId: subscriptionId, // Using this field to store PayPal subscription ID
      },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  private async handleSubscriptionCancelled(event: any) {
    const subscriptionId = event.resource.id;
    console.log('PayPal subscription cancelled:', subscriptionId);
    
    // Update subscription status
    await prisma.subscription.updateMany({
      where: { 
        stripeSubscriptionId: subscriptionId, // Using this field to store PayPal subscription ID
      },
      data: {
        status: 'CANCELED',
      },
    });
  }

  private async handleSubscriptionSuspended(event: any) {
    const subscriptionId = event.resource.id;
    console.log('PayPal subscription suspended:', subscriptionId);
    
    // Update subscription status
    await prisma.subscription.updateMany({
      where: { 
        stripeSubscriptionId: subscriptionId, // Using this field to store PayPal subscription ID
      },
      data: {
        status: 'PAST_DUE',
      },
    });
  }
}

export const paypalService = new PayPalService();
