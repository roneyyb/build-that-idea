import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to agents data file (JSON-based storage)
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

type Agent = {
  id: string;
  [key: string]: any;
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const agents: Agent[] = readAgents();
  const agent = agents.find((a) => a.id === params.id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }
  return NextResponse.json(agent);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const agents: Agent[] = readAgents();
  const idx = agents.findIndex((a) => a.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }
  agents[idx] = { ...agents[idx], ...body, id: params.id };
  fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2), "utf8");
  return NextResponse.json({ success: true, agent: agents[idx] });
}

// DELETE: Remove agent by id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const agents: Agent[] = readAgents();
  const idx = agents.findIndex((a) => a.id === params.id);
  if (idx === -1) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }
  agents.splice(idx, 1);
  fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2), "utf8");
  return NextResponse.json({ success: true });
}
