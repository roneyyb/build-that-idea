"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AgentFormSchema } from "@/components/create-agent/schema";
import { useRouter } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

interface Agent extends AgentFormSchema {
  createdAt: string;
  status: "active" | "inactive";
  tokenUsage: number;
  maxTokens: number;
  type: string;
  messagesProcessed?: number;
  engagement?: number;
  conversionRate?: number;
}

const sampleMessageHistory = [
  { id: 1, user: "Alice", message: "Hello agent!", timestamp: "2025-04-18 10:00" },
  { id: 2, user: "Agent", message: "Hi Alice, how can I help you today?", timestamp: "2025-04-18 10:00" },
  { id: 3, user: "Alice", message: "Tell me a joke.", timestamp: "2025-04-18 10:01" },
  { id: 4, user: "Agent", message: "Why did the AI cross the road? To optimize the chicken!", timestamp: "2025-04-18 10:01" },
];

const sampleUsageData = [
  { date: "2025-04-13", messages: 10, tokens: 1200 },
  { date: "2025-04-14", messages: 25, tokens: 3200 },
  { date: "2025-04-15", messages: 18, tokens: 2100 },
  { date: "2025-04-16", messages: 30, tokens: 4200 },
  { date: "2025-04-17", messages: 22, tokens: 2800 },
  { date: "2025-04-18", messages: 35, tokens: 5000 },
  { date: "2025-04-19", messages: 28, tokens: 3700 },
];

export default function AgentDetailPage() {
  const params = useSearchParams();
  const router = useRouter();
  const agentId = params.get("id");
  const [agent, setAgent] = useState<Agent | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (agentId) {
      const agents = JSON.parse(localStorage.getItem("agents") || "[]");
      const found = agents.find((a: Agent) => a.createdAt === agentId);
      if (found) {
        setAgent(found);
        setEnabled(found.status === "active");
      }
    }
  }, [agentId]);

  const handleToggle = () => {
    if (!agent) return;
    const agents = JSON.parse(localStorage.getItem("agents") || "[]");
    const updated = agents.map((a: Agent) =>
      a.createdAt === agent.createdAt ? { ...a, status: enabled ? "inactive" : "active" } : a
    );
    localStorage.setItem("agents", JSON.stringify(updated));
    setEnabled((prev) => !prev);
    setAgent((prev) => prev && { ...prev, status: enabled ? "inactive" : "active" });
  };

  const handleEdit = () => {
    if (agent) {
      router.push(`/create-agent?id=${agent.createdAt}`);
    }
  };

  if (!agent) {
    return <div className="p-8">Loading agent details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Agent Detail</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleEdit}>Edit</Button>
          <Switch checked={enabled} onCheckedChange={handleToggle} />
          <span className="ml-2 text-sm">{enabled ? "Enabled" : "Disabled"}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Agent Information</h2>
          <div className="bg-white rounded shadow p-4">
            <div><b>Name:</b> {agent.name}</div>
            <div><b>Description:</b> {agent.description}</div>
            <div><b>Type:</b> {agent.type}</div>
            <div><b>Status:</b> {agent.status}</div>
            <div><b>Model:</b> {agent.model}</div>
            <div><b>Created At:</b> {new Date(agent.createdAt).toLocaleString()}</div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Usage Statistics</h2>
          <div className="bg-white rounded shadow p-4 relative">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sampleUsageData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="messages" stroke="#8884d8" name="Messages" />
                <Line type="monotone" dataKey="tokens" stroke="#82ca9d" name="Tokens" />
              </LineChart>
            </ResponsiveContainer>
            <Button className="absolute top-2 right-2" size="sm" variant="secondary" onClick={() => router.push('/dashboard/agents')}>Go to Dashboard</Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Message History (Sample)</h2>
          <div className="bg-white rounded shadow p-4">
            <ul className="divide-y divide-gray-200">
              {sampleMessageHistory.map((msg) => (
                <li key={msg.id} className="py-2">
                  <div className="text-xs text-gray-500">{msg.timestamp} - <b>{msg.user}</b></div>
                  <div>{msg.message}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Performance Metrics</h2>
          <div className="bg-white rounded shadow p-4">
            <div><b>Messages Processed:</b> {agent.messagesProcessed ?? 0}</div>
            <div><b>Engagement:</b> {agent.engagement ?? 0}%</div>
            <div><b>Conversion Rate:</b> {agent.conversionRate ?? 0}%</div>
            <div><b>Token Usage:</b> {agent.tokenUsage}</div>
            <div><b>Max Tokens:</b> {agent.maxTokens}</div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Share / Embed</h2>
        <div className="bg-white rounded shadow p-4 flex flex-col gap-2">
          <div>
            <b>Share Link:</b>
            <div className="flex items-center gap-2 mt-1">
              <input className="border rounded px-2 py-1 w-full" readOnly value={`${window.location.origin}/agent?id=${agent.createdAt}`} />
              <Button onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/agent?id=${agent.createdAt}`)}}>Copy</Button>
            </div>
          </div>
          <div>
            <b>Embed Code:</b>
            <div className="flex items-center gap-2 mt-1">
              <input className="border rounded px-2 py-1 w-full" readOnly value={`<iframe src=\"${window.location.origin}/agent?id=${agent.createdAt}\" width=\"400\" height=\"600\"></iframe>`} />
              <Button onClick={() => {navigator.clipboard.writeText(`<iframe src=\"${window.location.origin}/agent?id=${agent.createdAt}\" width=\"400\" height=\"600\"></iframe>`)}}>Copy</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
