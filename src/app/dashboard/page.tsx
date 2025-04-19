export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to your agent management dashboard</p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Total Agents</div>
          <div className="mt-2 text-3xl font-bold">3</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Active Agents</div>
          <div className="mt-2 text-3xl font-bold">2</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Total Token Usage</div>
          <div className="mt-2 text-3xl font-bold">15,000,000</div>
        </div>
        <div className="rounded-lg border bg-white p-4">
          <div className="text-sm font-medium text-gray-500">Available Tokens</div>
          <div className="mt-2 text-3xl font-bold">25,000,000</div>
        </div>
      </div>
    </div>
  );
}