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
            <h1 className="text-3xl font-extrabold text-[#020817] mb-2 tracking-tight drop-shadow-sm">My Agents</h1>
            {/* Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex gap-2 items-center">
                    <input
                        className="w-56 rounded border-[1.5px] border-[#020817]/20 px-3 py-2 text-base text-[#020817] focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-[#020817]/50 transition-all"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search agents..."
                    />
                    <button
                        onClick={() => setFilter({ status: undefined })}
                        className={`ml-2 px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold border transition-colors
                            ${filter.status === undefined ? 'bg-[#020817] text-white border-[#020817] shadow' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
                    >
                        <Filter className="w-4 h-4 mr-1" />All
                    </button>
                    <button
                        onClick={() => setFilter({ status: 'active' })}
                        className={`px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold border transition-colors
                            ${filter.status === 'active' ? 'bg-green-600 text-white border-green-600 shadow' : 'bg-green-100 text-green-700 border-green-200 hover:bg-green-200'}`}
                    >
                        <CheckCircle2 className="w-4 h-4 mr-1" />Active
                    </button>
                    <button
                        onClick={() => setFilter({ status: 'inactive' })}
                        className={`px-3 py-1 rounded-full flex items-center gap-1 text-xs font-semibold border transition-colors
                            ${filter.status === 'inactive' ? 'bg-gray-700 text-white border-gray-700 shadow' : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'}`}
                    >
                        <XCircle className="w-4 h-4 mr-1" />Inactive
                    </button>
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
                    <div className="text-lg font-bold text-[#020817]">{agents.reduce((sum, a) => sum + (a.messagesProcessed || 0), 0)}</div>
                    <div className="text-[#020817]  text-sm">Total Messages</div>
                </div>
                <div className="rounded-lg bg-white shadow p-4 flex flex-col items-center">
                    <div className="text-lg font-bold text-[#020817]">{agents.length}</div>
                    <div className="text-[#020817]  text-sm">Total Agents</div>
                </div>
                <div className="rounded-lg bg-white shadow p-4 flex flex-col items-center">
                    <div className="text-lg font-bold text-[#020817]">{((agents.reduce((sum, a) => sum + (a.engagement || 0), 0) / (agents.length || 1)) * 100).toFixed(1)}%</div>
                    <div className="text-[#020817]  text-sm">Avg. Engagement</div>
                </div>
                <div className="rounded-lg bg-white shadow p-4 flex flex-col items-center">
                    <div className="text-lg font-bold text-[#020817]">{((agents.filter(a => a.isPaid).reduce((sum, a) => sum + (a.conversionRate || 0), 0) / (agents.filter(a => a.isPaid).length || 1)) * 100).toFixed(1)}%</div>
                    <div className="text-[#020817]  text-sm">Avg. Conversion (Paid)</div>
                </div>
            </div>
            {/* Agent list */}
            <div className="space-y-4">
                {filtered.map((agent) => {
                    const id = agent.name + agent.createdAt;
                    return (
                        <div
                            key={id}
                            className={`relative rounded-xl border border-dotted border-[#d1cfcf] bg-white p-5 flex flex-col gap-3 shadow-sm transition-all hover:shadow-md min-w-[320px] animate-fade-in-up ${selected.has(id) ? 'ring-2 ring-orange-400' : ''}`}
                            style={{ animationDelay: `${0.04 * (filtered.findIndex(a => (a.name + a.createdAt) === id))}s` }}
                        >
                            <div className="flex items-center gap-3">
                                <input type="checkbox" checked={selected.has(id)} onChange={() => toggleSelect(id)} className="accent-orange-400" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-bold text-[#020817] tracking-tight">{agent.name}</h3>
                                        <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${agent.status === 'active' ? 'bg-[#e7f6ea] text-[#2e7d32]' : 'bg-gray-200 text-gray-600'}`}>{agent.status}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium">{agent.type}</div>
                                    <div className="text-xs text-gray-400">{agent.description}</div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1 mt-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-[#7c6f5c]">Token Usage</span>
                                    <span className="text-xs font-semibold text-[#7c6f5c]">{agent.tokenUsage?.toLocaleString?.()} / {agent.maxTokens?.toLocaleString?.()}</span>
                                </div>
                                <div className="w-full h-2 rounded-full bg-[#ede8e3] relative overflow-hidden">
                                    <div className="h-2 rounded-full bg-[#8d6e63] transition-all" style={{ width: `${(agent.tokenUsage / agent.maxTokens) * 100}%` }} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 md:items-end">
                                <div className="flex gap-2 items-center">
                                    <button
                                        className="px-4 py-1 rounded-full bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 border border-blue-100 shadow-sm transition-colors"
                                        onClick={() => window.location.href = `/dashboard/agents/AgentDetailPage?id=${agent.createdAt}`}
                                    >
                                        View Details
                                    </button>
                                    <button
                                        className="px-4 py-1 rounded-full bg-gray-50 text-gray-700 font-semibold text-xs hover:bg-gray-100 border border-gray-200 shadow-sm transition-colors"
                                        onClick={() => window.location.href = `/create-agent?id=${agent.createdAt}`}
                                    >
                                        Edit
                                    </button>
                                    <label className="flex items-center cursor-pointer select-none ml-2">
                                        <span className="mr-1 text-xs">{agent.status === 'active' ? 'Enabled' : 'Disabled'}</span>
                                        <input
                                            type="checkbox"
                                            checked={agent.status === 'active'}
                                            onChange={() => {
                                                const updated = agents.map(a => a.createdAt === agent.createdAt ? { ...a, status: a.status === 'active' ? 'inactive' : 'active' } : a);
                                                setAgents(updated);
                                                localStorage.setItem('agents', JSON.stringify(updated));
                                            }}
                                            className="form-checkbox h-4 w-4 text-green-600"
                                        />
                                    </label>
                                    <button
                                        className="px-4 py-1 rounded-full bg-red-50 text-red-600 font-semibold text-xs hover:bg-red-100 border border-red-100 shadow-sm transition-colors flex items-center gap-1"
                                        onClick={() => handleBatch('delete')}
                                    >
                                        <Trash2 className="h-4 w-4" /> Delete
                                    </button>
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
