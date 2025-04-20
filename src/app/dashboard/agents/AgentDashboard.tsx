"use client";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Filter, Search, Trash2, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface Agent {
    id: string;
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
    const [loading, setLoading] = useState(false);
    const [toggleLoading, setToggleLoading] = useState<string | null>(null);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [search, setSearch] = useState("");
    const [sortField, setSortField] = useState<SortField>("createdAt");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [filter, setFilter] = useState<Filter>({});

    useEffect(() => {
        setLoading(true);
        fetch('/api/agents')
            .then(res => res.json())
            .then(data => {
                setAgents(data);
                setLoading(false);
            });


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
    const handleBatch = async (action: "enable" | "disable" | "delete") => {
        if (action === "delete") {
            // Batch delete selected agents
            const toDelete = agents.filter((a) => selected.has(a.id));
            await Promise.all(toDelete.map(async (agent) => {
                await handleDeleteAgent(agent);
            }));
            setSelected(new Set());
        } else {
            // Batch enable/disable selected agents
            const updates = agents.map((a) => {
                if (selected.has(a.id)) {
                    return { ...a, status: (action === "enable" ? "active" : "inactive") as "active" | "inactive" };
                }
                return a;
            });
            await Promise.all(
                updates.filter((a) => selected.has(a.id)).map(async (agent) => {
                    await fetch(`/api/agents/${agent.id}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(agent),
                    });
                })
            );
            setAgents(updates);
            setSelected(new Set());
        }
    };


    // Delete a single agent
    const handleDeleteAgent = async (agent: Agent) => {
        try {
            await fetch(`/api/agents/${agent.id}`, {
                method: 'DELETE',
            });
            setAgents((prev) => prev.filter((a) => a.id !== agent.id));
        } catch (err) {
            console.error('Failed to delete agent:', err);
            alert('Failed to delete agent.');
        }
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
            {/* Header Section */}
            <div className="mb-12">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    My Agents
                </h1>
                <p className="text-gray-600 mt-2">Manage and monitor your AI agents in one place</p>
            </div>

            {/* Controls */}
            <div className="bg-white/70 backdrop-blur-lg rounded-2xl p-6 mb-8 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex flex-wrap gap-3 items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                className="w-64 rounded-lg border border-gray-200 pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 placeholder:text-gray-400 transition-all bg-white/50"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search agents..."
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilter({ status: undefined })}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all
                                    ${filter.status === undefined
                                        ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/10'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                            >
                                <Filter className="w-4 h-4" />All
                            </button>
                            <button
                                onClick={() => setFilter({ status: 'active' })}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all
                                    ${filter.status === 'active'
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100'}`}
                            >
                                <CheckCircle2 className="w-4 h-4" />Active
                            </button>
                            <button
                                onClick={() => setFilter({ status: 'inactive' })}
                                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all
                                    ${filter.status === 'inactive'
                                        ? 'bg-gray-700 text-white shadow-lg shadow-gray-700/10'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'}`}
                            >
                                <XCircle className="w-4 h-4" />Inactive
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-3 items-center">
                        <label className="text-sm text-gray-600 font-medium">Sort by:</label>
                        <select
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white/50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                            value={sortField}
                            onChange={e => setSortField(e.target.value as SortField)}
                        >
                            <option value="createdAt">Created</option>
                            <option value="name">Name</option>
                            <option value="status">Status</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}
                            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white/50 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {sortOrder === "asc" ? "▲" : "▼"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Batch actions */}
            {selected.size > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/90 backdrop-blur border border-gray-100 rounded-xl p-4 mb-8 shadow-lg flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600">{selected.size} agents selected</span>
                        <div className="h-4 w-px bg-gray-200" />
                        <div className="flex gap-2">
                            <button
                                className="px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/10"
                                onClick={() => handleBatch("enable")}
                            >
                                Enable
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-500 text-white text-sm font-medium hover:bg-gray-600 transition-colors shadow-lg shadow-gray-500/10"
                                onClick={() => handleBatch("disable")}
                            >
                                Disable
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors shadow-lg shadow-red-500/10"
                                onClick={() => handleBatch("delete")}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Analytics summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {[
                    {
                        label: "Total Messages",
                        value: agents.reduce((sum, a) => sum + (a.messagesProcessed || 0), 0),
                        gradient: "from-blue-500 to-indigo-600"
                    },
                    {
                        label: "Total Agents",
                        value: agents.length,
                        gradient: "from-emerald-500 to-teal-600"
                    },
                    {
                        label: "Avg. Engagement",
                        value: `${((agents.reduce((sum, a) => sum + (a.engagement || 0), 0) / (agents.length || 1)) * 100).toFixed(1)}%`,
                        gradient: "from-orange-500 to-pink-600"
                    },
                    {
                        label: "Avg. Conversion (Paid)",
                        value: `${((agents.filter(a => a.isPaid).reduce((sum, a) => sum + (a.conversionRate || 0), 0) / (agents.filter(a => a.isPaid).length || 1)) * 100).toFixed(1)}%`,
                        gradient: "from-purple-500 to-indigo-600"
                    }
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl bg-white shadow-sm border border-gray-100 p-6 relative overflow-hidden group hover:shadow-lg transition-shadow"
                    >
                        <div className="relative z-10">
                            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                            <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                        </div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    </motion.div>
                ))}
            </div>

            {/* Agent list */}
            <div className="space-y-4">
                <AnimatePresence>
                    {filtered.map((agent, idx) => {
                        const id = agent.name + agent.id;
                        return (
                            <motion.div
                                key={agent.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{
                                    type: 'spring',
                                    stiffness: 100,
                                    damping: 15,
                                    delay: idx * 0.05
                                }}
                                className={`group relative rounded-2xl bg-white p-6 transition-all
                                    ${selected.has(id)
                                        ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/5'
                                        : 'shadow-sm hover:shadow-md border border-gray-100'}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            checked={selected.has(id)}
                                            onChange={() => toggleSelect(id)}
                                            className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500/20 transition-colors"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${agent.status === 'active'
                                                ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/10'
                                                : 'bg-gray-100 text-gray-700 ring-1 ring-gray-600/10'
                                                }`}>
                                                {agent.status}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 font-medium mt-0.5">{agent.type}</div>
                                        {agent.description && (
                                            <div className="text-sm text-gray-500 mt-1">{agent.description}</div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 border border-gray-200 transition-colors"
                                            onClick={() => window.location.href = `/dashboard/agents/AgentDetailPage?id=${agent.id}`}
                                        >
                                            View Details
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded-lg bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 border border-gray-200 transition-colors"
                                            onClick={() => window.location.href = `/create-agent?id=${agent.id}`}
                                        >
                                            Edit
                                        </button>
                                        <div className="flex items-center gap-1 ml-2">
                                            <span className={`text-xs font-semibold ${agent.status === 'active' ? 'text-emerald-600' : 'text-gray-400'}`}>{agent.status === 'active' ? 'Active' : 'Inactive'}</span>
                                            <Switch
                                                checked={agent.status === 'active'}
                                                disabled={toggleLoading === agent.id}
                                                onChange={async () => {
                                                    setToggleLoading(agent.id);
                                                    const newStatus = agent.status === 'active' ? 'inactive' : 'active';
                                                    const updatedAgent = { ...agent, status: newStatus };
                                                    await fetch(`/api/agents/${agent.id}`, {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(updatedAgent),
                                                    });
                                                    setAgents(agents.map(a => a.id === agent.id ? { ...updatedAgent, status: newStatus as 'active' | 'inactive' } : a));
                                                    setToggleLoading(null);
                                                }}
                                                className="ml-2"
                                            />
                                        </div>
                                        <button
                                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                            onClick={async () => {
                                                if (window.confirm(`Are you sure you want to delete agent '${agent.name}'? This action cannot be undone.`)) {
                                                    await handleDeleteAgent(agent);
                                                }
                                            }}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Token Usage</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {agent.tokenUsage?.toLocaleString()} / {agent.maxTokens?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all"
                                            style={{ width: `${(agent.tokenUsage / agent.maxTokens) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
