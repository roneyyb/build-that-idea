import { Agent, AgentAnalytics, AgentMessage } from '@/types/agent';

// Mock data storage
let agents: Agent[] = [];
const analytics: Record<string, AgentAnalytics> = {};
const messages: AgentMessage[] = [];

// Helper function to generate IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

export const api = {
  // Agent CRUD operations
  createAgent: async (agentData: Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAgent: Agent = {
      ...agentData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    agents.push(newAgent);
    return newAgent;
  },

  getAgents: async (filters?: {
    search?: string;
    sortBy?: 'name' | 'createdAt' | 'status';
    sortOrder?: 'asc' | 'desc';
  }) => {
    let filteredAgents = [...agents];

    if (filters?.search) {
      filteredAgents = filteredAgents.filter(
        (agent) =>
          agent.name.toLowerCase().includes(filters.search!.toLowerCase()) ||
          agent.description.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }

    if (filters?.sortBy) {
      filteredAgents.sort((a, b) => {
        const aValue = a[filters.sortBy!];
        const bValue = b[filters.sortBy!];
        const order = filters.sortOrder === 'desc' ? -1 : 1;
        return aValue > bValue ? order : -order;
      });
    }

    return filteredAgents;
  },

  getAgent: async (id: string) => {
    return agents.find((agent) => agent.id === id);
  },

  updateAgent: async (id: string, updates: Partial<Agent>) => {
    const index = agents.findIndex((agent) => agent.id === id);
    if (index === -1) throw new Error('Agent not found');

    agents[index] = {
      ...agents[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return agents[index];
  },

  deleteAgent: async (id: string) => {
    const index = agents.findIndex((agent) => agent.id === id);
    if (index === -1) throw new Error('Agent not found');
    agents = agents.filter((agent) => agent.id !== id);
    return true;
  },

  // Analytics operations
  getAgentAnalytics: async (agentId: string) => {
    if (!analytics[agentId]) {
      // Generate mock analytics if none exist
      analytics[agentId] = {
        totalMessages: Math.floor(Math.random() * 1000),
        userEngagement: {
          activeUsers: Math.floor(Math.random() * 100),
          averageSessionDuration: Math.floor(Math.random() * 600),
          responseRate: Math.random() * 100,
        },
        conversionMetrics: {
          totalConversions: Math.floor(Math.random() * 50),
          conversionRate: Math.random() * 10,
          revenue: Math.floor(Math.random() * 1000),
        },
      };
    }
    return analytics[agentId];
  },

  // Message operations
  getAgentMessages: async (agentId: string, limit = 10) => {
    return messages
      .filter((message) => message.agentId === agentId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  },
};
