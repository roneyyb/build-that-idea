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
  return <AgentDashboard />;
}
