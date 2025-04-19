"use client";
import { useEffect, useState } from "react";
import { Settings, ExternalLink, Trash2, CheckCircle2, XCircle, Search, Filter } from "lucide-react";

interface Agent {
    name: string;
    description?: string;
    type: string;
    tokenUsage: number;
    maxTokens: number;
    status: "active" | "inactive";
    createdAt?: string;
    isPaid?: boolean;
    messagesProcessed?: number;
    engagement?: number;
    conversionRate?: number;
}

type SortField = "name" | "createdAt" | "status";
type SortOrder = "asc" | "desc";

type Filter = {
    status?: "active" | "inactive";
};

export default function AgentDashboard() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>("createdAt");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [filter, setFilter] = useState<Filter>({});

    useEffect(() => {
        const saved = localStorage.getItem("agents");
        if (saved) {
            setAgents(JSON.parse(saved));
        }
    }, []);

    // Search, filter, sort pipeline
    const filtered = agents
        .filter((a) => {
            if (filter.status && a.status !== filter.status) return false;
            if (
                search &&
                !a.name.toLowerCase().includes(search.toLowerCase()) &&
                !(a.description || "").toLowerCase().includes(search.toLowerCase())
            )
                return false;
            return true;
        })
        .sort((a, b) => {
            let cmp = 0;
            if (sortField === "name") cmp = a.name.localeCompare(b.name);
            else if (sortField === "createdAt") cmp = (b.createdAt || "").localeCompare(a.createdAt || "");
            else if (sortField === "status") cmp = a.status.localeCompare(b.status);
            return sortOrder === "asc" ? cmp : -cmp;
        });

    // Batch actions
    const handleBatch = (action: "enable" | "disable" | "delete") => {
        let updated = [...agents];
        if (action === "delete") {
            updated = updated.filter((a) => !selected.has(a.name + a.createdAt));
        } else {
            updated = updated.map((a) =>
                selected.has(a.name + a.createdAt)
                    ? { ...a, status: action === "enable" ? "active" : "inactive" }
                    : a
            );
        }
        setAgents(updated);
        localStorage.setItem("agents", JSON.stringify(updated));
        setSelected(new Set());
    };

    // Select/deselect logic
    const toggleSelect = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <div className="space-y-8">
            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2 items-center">
                    <input
                        className="border rounded px-3 py-2 text-sm"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search agents..."
                    />
                    <button onClick={() => setFilter({ status: undefined })} className="ml-2 px-2 py-1 rounded bg-gray-100 text-gray-700 flex items-center"><Filter className="w-4 h-4 mr-1" />All</button>
                    <button onClick={() => setFilter({ status: "active" })} className="px-2 py-1 rounded bg-green-100 text-green-700 flex items-center"><CheckCircle2 className="w-4 h-4 mr-1" />Active</button>
                    <button onClick={() => setFilter({ status: "inactive" })} className="px-2 py-1 rounded bg-gray-200 text-gray-700 flex items-center"><XCircle className="w-4 h-4 mr-1" />Inactive</button>
                </div>
                <div className="flex gap-2 items-center">
                    <label className="text-sm">Sort by:</label>
                    <select className="border rounded px-2 py-1 text-sm" value={sortField} onChange={e => setSortField(e.target.value as SortField)}>
                        <option value="createdAt">Created</option>
                        <option value="name">Name</option>
                        <option value="status">Status</option>
                    </select>
                    <button onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}>{sortOrder === "asc" ? "▲" : "▼"}</button>
                </div>
            </div>
            {/* Batch actions */}
            {selected.size > 0 && (
                <div className="flex gap-2 mb-2">
                    <button className="px-3 py-1 rounded bg-green-500 text-white" onClick={() => handleBatch("enable")}>Enable</button>
                    <button className="px-3 py-1 rounded bg-gray-500 text-white" onClick={() => handleBatch("disable")}>Disable</button>
                    <button className="px-3 py-1 rounded bg-red-500 text-white" onClick={() => handleBatch("delete")}>Delete</button>
                    <span className="text-sm text-gray-600">{selected.size} selected</span>
                </div>
            )}
            {/* Analytics summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="rounded-lg bg-white shadow p-4 flex flex-col items-center">
                    <div className="text-lg font-bold">{agents.reduce((sum, a) => sum + (a.messagesProcessed || 0), 0)}</div>
                    <div className="text-gray-500 text-sm">Total Messages</div>
                </div>
                <div className="rounded-lg bg-white shadow p-4 flex flex-col items-center">
                    <div className="text-lg font-bold">{agents.length}</div>
                    <div className="text-gray-500 text-sm">Total Agents</div>
                </div>
                <div className="rounded-lg bg-white shadow p-4 flex flex-col items-center">
                    <div className="text-lg font-bold">{((agents.reduce((sum, a) => sum + (a.engagement || 0), 0) / (agents.length || 1)) * 100).toFixed(1)}%</div>
                    <div className="text-gray-500 text-sm">Avg. Engagement</div>
                </div>
                <div className="rounded-lg bg-white shadow p-4 flex flex-col items-center">
                    <div className="text-lg font-bold">{((agents.filter(a => a.isPaid).reduce((sum, a) => sum + (a.conversionRate || 0), 0) / (agents.filter(a => a.isPaid).length || 1)) * 100).toFixed(1)}%</div>
                    <div className="text-gray-500 text-sm">Avg. Conversion (Paid)</div>
                </div>
            </div>
            {/* Agent list */}
            <div className="space-y-4">
                {filtered.map((agent) => {
                    const id = agent.name + agent.createdAt;
                    return (
                        <div key={id} className={`rounded-lg border bg-white p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${selected.has(id) ? 'ring-2 ring-orange-400' : ''}`}>
                            <div className="flex items-center gap-2">
                                <input type="checkbox" checked={selected.has(id)} onChange={() => toggleSelect(id)} />
                                <div>
                                    <h3 className="text-lg font-semibold">{agent.name}</h3>
                                    <p className="text-sm text-gray-500">{agent.type}</p>
                                    <p className="text-xs text-gray-400">{agent.description}</p>
                                    <p className="text-xs text-gray-400">Created: {agent.createdAt ? new Date(agent.createdAt).toLocaleString() : "-"}</p>
                                </div>
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                                <div className="text-sm text-gray-500">Token Usage</div>
                                <div className="relative h-2 w-full rounded-full bg-gray-200">
                                    <div className="absolute h-2 rounded-full bg-orange-500" style={{ width: `${(agent.tokenUsage / agent.maxTokens) * 100}%` }} />
                                </div>
                                <div className="mt-1 text-xs text-gray-600">
                                    {agent.tokenUsage?.toLocaleString?.()} / {agent.maxTokens?.toLocaleString?.()}
                                </div>
                                <div className="flex gap-4 mt-2">
                                    <div className="text-xs text-gray-500">Messages: {agent.messagesProcessed || 0}</div>
                                    <div className="text-xs text-gray-500">Engagement: {(agent.engagement || 0).toFixed(2)}</div>
                                    {agent.isPaid && <div className="text-xs text-gray-500">Conversion: {(agent.conversionRate || 0).toFixed(2)}%</div>}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 md:items-end">
                                <div className="flex gap-2">
                                    <button className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"><Settings className="h-4 w-4" /><span>Manage</span></button>
                                    <button className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"><ExternalLink className="h-4 w-4" /><span>Live</span></button>
                                    <button className="inline-flex items-center space-x-2 text-sm text-red-500 hover:text-red-700" onClick={() => handleBatch("delete")}><Trash2 className="h-4 w-4" /><span>Delete</span></button>
                                </div>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${agent.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{agent.status}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
