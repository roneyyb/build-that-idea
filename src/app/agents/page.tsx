import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AgentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-xl font-bold">
              Agent Management System
            </Link>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button asChild>
              <Link href="/agents/create">Create Agent</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="container">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Your Agents</h1>
            <div className="flex gap-4">
              <input
                type="search"
                placeholder="Search agents..."
                className="px-4 py-2 border rounded-md"
              />
              <select className="px-4 py-2 border rounded-md">
                <option value="name">Sort by Name</option>
                <option value="created">Sort by Created Date</option>
                <option value="status">Sort by Status</option>
              </select>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Agent cards will be dynamically rendered here */}
            <div className="border rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold">Example Agent</h3>
                  <p className="text-sm text-gray-500">Created on April 19, 2025</p>
                </div>
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <p className="text-sm mb-4">
                This is an example agent description. Replace with actual agent data.
              </p>
              <div className="flex justify-between items-center">
                <Button variant="outline" asChild>
                  <Link href="/agents/1">View Details</Link>
                </Button>
                <Button variant="ghost" size="sm">
                  Disable
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
