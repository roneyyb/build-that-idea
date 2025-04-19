import { Settings, ExternalLink } from 'lucide-react';

interface Agent {
  name: string;
  type: string;
  tokenUsage: number;
  maxTokens: number;
  status: 'active' | 'inactive';
}

const agents: Agent[] = [
  {
    name: 'Customer Support Bot',
    type: 'Support',
    tokenUsage: 7500000,
    maxTokens: 10000000,
    status: 'active',
  },
  {
    name: 'Sales Assistant',
    type: 'Sales',
    tokenUsage: 5000000,
    maxTokens: 10000000,
    status: 'active',
  },
  {
    name: 'Data Analyst',
    type: 'Analytics',
    tokenUsage: 2500000,
    maxTokens: 10000000,
    status: 'inactive',
  },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Agents</h1>
        <p className="text-gray-500">Manage and monitor your AI agents</p>
      </div>

      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.name}
            className="rounded-lg border bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{agent.name}</h3>
                <p className="text-sm text-gray-500">{agent.type}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    agent.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {agent.status}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-500">Token Usage</div>
              <div className="mt-1">
                <div className="relative h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="absolute h-2 rounded-full bg-orange-500"
                    style={{
                      width: `${(agent.tokenUsage / agent.maxTokens) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  {agent.tokenUsage.toLocaleString()} / {agent.maxTokens.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              <button className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                <Settings className="h-4 w-4" />
                <span>Manage</span>
              </button>
              <button className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900">
                <ExternalLink className="h-4 w-4" />
                <span>Live Version</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
