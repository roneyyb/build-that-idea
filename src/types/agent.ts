export interface Agent {
  id: string;
  name: string;
  description: string;
  instructions: string;
  appearance: AgentAppearance;
  monetization: AgentMonetization;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface AgentAppearance {
  logoUrl: string;
  quickReplies: string[];
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

export interface AgentMonetization {
  pricing: {
    type: 'free' | 'paid';
    amount?: number;
    currency?: string;
    interval?: 'monthly' | 'yearly';
  };
  model: {
    name: string;
    type: string;
    parameters: Record<string, string | number | boolean>;
  };
  features: string[];
}

export interface AgentAnalytics {
  totalMessages: number;
  userEngagement: {
    activeUsers: number;
    averageSessionDuration: number;
    responseRate: number;
  };
  conversionMetrics: {
    totalConversions: number;
    conversionRate: number;
    revenue: number;
  };
}

export interface AgentMessage {
  id: string;
  agentId: string;
  userId: string;
  content: string;
  timestamp: string;
  type: 'incoming' | 'outgoing';
}
