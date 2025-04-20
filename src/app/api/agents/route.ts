import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to agents data file
const AGENTS_FILE = path.join(process.cwd(), "src/storage/agents.json");

function readAgents() {
  if (!fs.existsSync(AGENTS_FILE)) return [];
  const data = fs.readFileSync(AGENTS_FILE, "utf8");
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const agents = readAgents();
  return NextResponse.json(agents);
}

import { v4 as uuidv4 } from 'uuid';

type Agent = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  logo?: string;
  quickReplies?: string[];
  theme?: string;
  pricing?: string;
  model: string;
  subscription?: boolean;
  createdAt?: string;
  status?: string;
  type?: string;
  tokenUsage?: number;
  maxTokens?: number;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const agents: Agent[] = readAgents();
  const agentId = body.id || uuidv4();
  const idx = agents.findIndex((a) => a.id === agentId);
  if (idx !== -1) {
    agents[idx] = { ...agents[idx], ...body, id: agentId };
  } else {
    agents.push({ ...body, id: agentId, createdAt: body.createdAt || new Date().toISOString() });
  }
  fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2), "utf8");
  return NextResponse.json({ success: true, agent: { ...body, id: agentId } });
}
