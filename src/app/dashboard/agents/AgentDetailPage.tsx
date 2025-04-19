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
    <div className="max-w-4xl mx-auto p-0 md:p-8">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-orange-50 to-blue-50 rounded-2xl shadow-sm px-6 py-6 mb-10 border border-[#ececec]">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-white shadow w-16 h-16 flex items-center justify-center text-3xl font-bold text-orange-500 border border-orange-100">
            {agent.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#020817] tracking-tight mb-1">{agent.name}</h1>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${agent.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-200 text-gray-600 border border-gray-300'}`}>{agent.status}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">{agent.type}</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">{agent.model}</span>
            </div>
            <div className="text-sm text-gray-500 mt-1 max-w-md line-clamp-2">{agent.description}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0">
          <Button variant="outline" onClick={handleEdit}>Edit</Button>
          <Switch checked={enabled} onCheckedChange={handleToggle} />
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-semibold ${enabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{enabled ? "Enabled" : "Disabled"}</span>
        </div>
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl bg-white shadow-sm border p-5 flex flex-col items-center">
          <div className="text-lg font-bold text-[#020817]">{agent.messagesProcessed ?? 0}</div>
          <div className="text-gray-500 text-xs">Messages Processed</div>
        </div>
        <div className="rounded-xl bg-white shadow-sm border p-5 flex flex-col items-center">
          <div className="text-lg font-bold text-[#020817]">{agent.engagement ?? 0}%</div>
          <div className="text-gray-500 text-xs">Engagement</div>
        </div>
        <div className="rounded-xl bg-white shadow-sm border p-5 flex flex-col items-center">
          <div className="text-lg font-bold text-[#020817]">{agent.conversionRate ?? 0}%</div>
          <div className="text-gray-500 text-xs">Conversion Rate</div>
        </div>
        <div className="rounded-xl bg-white shadow-sm border p-5 flex flex-col items-center">
          <div className="text-lg font-bold text-[#020817]">{agent.tokenUsage} / {agent.maxTokens}</div>
          <div className="text-gray-500 text-xs">Token Usage</div>
        </div>
      </div>
      {/* Info + Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-[#020817]">Agent Information</h2>
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-2 text-sm">
  <div><span className="font-semibold text-gray-700">Name:</span> <span style={{ color: '#78716c' }}>{agent.name}</span></div>
  <div><span className="font-semibold text-gray-700">Description:</span> <span style={{ color: '#78716c' }}>{agent.description}</span></div>
  <div><span className="font-semibold text-gray-700">Type:</span> <span style={{ color: '#78716c' }}>{agent.type}</span></div>
  <div><span className="font-semibold text-gray-700">Status:</span> <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${agent.status === 'active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-200 text-gray-600 border border-gray-300'}`} style={{ color: '#78716c' }}>{agent.status}</span></div>
  <div><span className="font-semibold text-gray-700">Model:</span> <span style={{ color: '#78716c' }}>{agent.model}</span></div>
  <div><span className="font-semibold text-gray-700">Created At:</span> <span style={{ color: '#78716c' }}>{new Date(agent.createdAt).toLocaleString()}</span></div>
</div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-[#020817]">Usage Statistics</h2>
          <div className="bg-white rounded-xl border shadow-sm p-6 relative">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={sampleUsageData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#f3f3f3" strokeDasharray="5 5" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="messages" stroke="#8884d8" name="Messages" strokeWidth={2} />
                <Line type="monotone" dataKey="tokens" stroke="#82ca9d" name="Tokens" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <Button className="absolute top-2 right-2" size="sm" variant="secondary" onClick={() => router.push('/dashboard/agents')}>Go to Dashboard</Button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-lg font-semibold mb-2 text-[#020817]">Message History (Sample)</h2>
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <ul className="divide-y divide-gray-100">
              {sampleMessageHistory.map((msg) => (
                <li key={msg.id} className="py-2">
                  <div className="text-xs text-gray-400 mb-0.5">{msg.timestamp} - <b>{msg.user}</b></div>
                  <div className="text-sm text-[#020817]">{msg.message}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2 text-[#020817]">Performance Metrics</h2>
          <div className="bg-white rounded-xl border shadow-sm p-6 space-y-2 text-sm">
  <div><span className="font-semibold text-gray-700">Messages Processed:</span> <span style={{ color: '#78716c' }}>{agent.messagesProcessed ?? 0}</span></div>
  <div><span className="font-semibold text-gray-700">Engagement:</span> <span style={{ color: '#78716c' }}>{agent.engagement ?? 0}%</span></div>
  <div><span className="font-semibold text-gray-700">Conversion Rate:</span> <span style={{ color: '#78716c' }}>{agent.conversionRate ?? 0}%</span></div>
  <div><span className="font-semibold text-gray-700">Token Usage:</span> <span style={{ color: '#78716c' }}>{agent.tokenUsage}</span></div>
  <div><span className="font-semibold text-gray-700">Max Tokens:</span> <span style={{ color: '#78716c' }}>{agent.maxTokens}</span></div>
</div>
        </div>
      </div>
      {/* Share/Embed */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2 text-[#020817]">Share / Embed</h2>
        <div className="bg-white rounded-xl border shadow-sm p-6 flex flex-col gap-3">
          <div>
            <span className="font-semibold text-gray-700">Share Link:</span>
            <div className="flex items-center gap-2 mt-1">
              <input
  className="w-full rounded border-[1.5px] border-[#020817]/20 px-3 py-2 text-base text-[#020817] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-[#020817]/50 transition-all"
  readOnly
  value={`${window.location.origin}/agent?id=${agent.createdAt}`}
/>
              <Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText(`${window.location.origin}/agent?id=${agent.createdAt}`)}}>Copy</Button>
            </div>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Embed Code:</span>
            <div className="flex items-center gap-2 mt-1">
              <input
  className="w-full rounded border-[1.5px] border-[#020817]/20 px-3 py-2 text-base text-[#020817] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-[#020817]/50 transition-all"
  readOnly
  value={`<iframe src=\"${window.location.origin}/agent?id=${agent.createdAt}\" width=\"400\" height=\"600\"></iframe>`}
/>
              <Button size="sm" variant="outline" onClick={() => {navigator.clipboard.writeText(`<iframe src=\"${window.location.origin}/agent?id=${agent.createdAt}\" width=\"400\" height=\"600\"></iframe>`)}}>Copy</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
