> Archived on 2025-11-12. Superseded by: (see docs/final index)

# Momen Integration Guide for AIAS

## Overview
This document outlines the backend integrations needed from Momen to complete the AIAS platform.

## Required API Endpoints

### 1. Chat API
- **Endpoint**: POST /api/chat
- **Purpose**: Handle AI chatbot conversations
- **Request**: `{ message: string, conversationId?: string }`
- **Response**: `{ reply: string, conversationId: string }`

### 2. Booking API
- **Endpoint**: POST /api/bookings
- **Purpose**: Process consultation bookings
- **Fields**: name, email, phone, company, meetingType, date, time, notes

### 3. Lead Generation API
- **Endpoint**: POST /api/leads
- **Purpose**: Capture leads and send PDF guide
- **Action**: Store lead, generate PDF, send email

### 4. FAQ Bot API
- **Endpoint**: POST /api/faq
- **Purpose**: Answer common questions

## Supabase Connection
- Project ID: gzadczzgyghnrshszyft
- All tables configured with RLS
- Use provided anon key for authenticated requests

## Frontend Integration Points
- ChatbotWidget component
- BookingInterface component
- LeadGenForm component
- FAQSection component

See README.md for complete architecture details.
