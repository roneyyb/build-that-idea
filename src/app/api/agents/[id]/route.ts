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

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const agents = readAgents();
  const agent = agents.find((a: any) => a.createdAt === params.id);
  if (!agent) {
    return NextResponse.json({ error: "Agent not found" }, { status: 404 });
  }
  return NextResponse.json(agent);
}

// (Optional) Add POST/PUT here for saving/updating agents if needed.
