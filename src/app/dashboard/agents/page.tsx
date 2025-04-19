"use client";
import { Settings, ExternalLink } from 'lucide-react';

interface Agent {
    name: string;
    type: string;
    tokenUsage: number;
    maxTokens: number;
    status: 'active' | 'inactive';
}

import { useEffect, useState } from 'react';

import AgentDashboard from "./AgentDashboard";

export default function AgentsPage() {
  return (
    <AgentDashboard>
      {({ agents }) => (
        <div>
          {agents.map((agent) => (
            <div key={agent.createdAt}>
              <div className="flex items-center gap-2 mt-2">
                <button
                  className="text-blue-600 hover:underline text-xs"
                  onClick={() => window.location.href = `/dashboard/agents/AgentDetailPage?id=${agent.createdAt}`}
                >View Details</button>
                <button
                  className="text-blue-600 hover:underline text-xs"
                  onClick={() => window.location.href = `/create-agent?id=${agent.createdAt}`}
                >Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AgentDashboard>
  );
}
