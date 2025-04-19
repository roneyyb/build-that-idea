"use client";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Edit, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter, useSearchParams } from "next/navigation";

interface Agent {
    name: string;
    description: string;
    model: string;
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
    const searchParams = useSearchParams();
    const navigate = useRouter()
    const agentId = searchParams.get("id");
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
            navigate.push(`/create-agent?id=${agent.createdAt}`);
        }
    };

    if (!agent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="w-full max-w-4xl p-8 space-y-8">
                    <div className="relative overflow-hidden bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl shadow p-8">
                        <div className="flex items-center gap-6">
                            <Skeleton className="rounded-2xl w-20 h-20 bg-gray-300/30" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-8 w-3/4 bg-gray-300/30" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-5 w-16 rounded-full bg-gray-300/30" />
                                    <Skeleton className="h-5 w-20 rounded-full bg-gray-300/30" />
                                    <Skeleton className="h-5 w-24 rounded-full bg-gray-300/30" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-24 rounded-xl bg-gray-200/50" />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Skeleton className="h-64 rounded-xl bg-gray-200/50" />
                        <Skeleton className="h-64 rounded-xl bg-gray-200/50" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Skeleton className="h-64 rounded-xl bg-gray-200/50" />
                        <Skeleton className="h-64 rounded-xl bg-gray-200/50" />
                    </div>

                    <div className="text-center text-lg font-medium text-gray-600 mt-6 animate-pulse">
                        Loading agent details...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-6">
            {/* Hero Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                        <div className="flex items-center gap-6">
                            <div className="rounded-2xl bg-gray-100 w-20 h-20 flex items-center justify-center text-4xl font-bold text-gray-800 border border-gray-200">
                                {agent.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{agent.name}</h1>
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${agent.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                        {agent.status}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                                        {agent.type}
                                    </span>
                                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                                        {agent.model}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="secondary"
                                onClick={handleEdit}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-800 border-gray-300"
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-4 py-2">
                                <Toggle
                                    pressed={enabled}
                                    onPressedChange={handleToggle}
                                    className="data-[state=on]:bg-green-500"
                                />
                                <span className="text-gray-800 text-sm font-medium">
                                    {enabled ? "Active" : "Inactive"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Messages Processed", value: agent.messagesProcessed ?? 0 },
                    { label: "Engagement", value: `${agent.engagement ?? 0}%` },
                    { label: "Conversion Rate", value: `${agent.conversionRate ?? 0}%` },
                    { label: "Token Usage", value: `${agent.tokenUsage} / ${agent.maxTokens}` }
                ].map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300">
                        <div className="text-2xl font-bold text-gray-700 mb-2">{stat.value}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts and Info */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Agent Information</h2>
                    <div className="space-y-4">
                        {[
                            { label: "Name", value: agent.name },
                            { label: "Description", value: agent.description },
                            { label: "Type", value: agent.type },
                            { label: "Model", value: agent.model },
                            { label: "Created At", value: new Date(agent.createdAt).toLocaleString() }
                        ].map((info, index) => (
                            <div key={index} className="flex flex-col space-y-1">
                                <span className="text-sm font-medium text-gray-500">{info.label}</span>
                                <span className="text-gray-800">{info.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Usage Statistics</h2>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate.push('/dashboard/agents')}
                            className="border-gray-200 hover:bg-gray-50"
                        >
                            Go to Dashboard
                        </Button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={sampleUsageData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#666" />
                            <YAxis tick={{ fontSize: 12 }} stroke="#666" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="messages"
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={{ fill: '#8884d8' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="tokens"
                                stroke="#82ca9d"
                                strokeWidth={2}
                                dot={{ fill: '#82ca9d' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Message History and Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Message History</h2>
                    <div className="space-y-4">
                        {sampleMessageHistory.map((msg) => (
                            <div key={msg.id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-medium text-blue-600">{msg.user}</span>
                                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                </div>
                                <p className="text-gray-700">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all duration-300">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Share / Embed</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-2">Share Link</label>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                        readOnly
                                        value={`${window.location.origin}/agent?id=${agent.createdAt}`}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => navigator.clipboard.writeText(`${window.location.origin}/agent?id=${agent.createdAt}`)}
                                        className="border-gray-200 hover:bg-gray-50"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600 block mb-2">Embed Code</label>
                                <div className="flex gap-2">
                                    <input
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                                        readOnly
                                        value={`<iframe src="${window.location.origin}/agent?id=${agent.createdAt}" width="400" height="600"></iframe>`}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => navigator.clipboard.writeText(`<iframe src="${window.location.origin}/agent?id=${agent.createdAt}" width="400" height="600"></iframe>`)}
                                        className="border-gray-200 hover:bg-gray-50"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
