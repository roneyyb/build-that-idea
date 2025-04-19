import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CreateAgentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <Link href="/agents" className="text-xl font-bold">
              ← Back to Agents
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6">
        <div className="container max-w-3xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Create New Agent</h1>
            <p className="text-muted-foreground">
              Complete the following steps to create your AI agent.
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Basic Information</span>
              <span className="text-muted-foreground">Step 1 of 3</span>
            </div>
            <div className="h-2 bg-secondary rounded-full">
              <div className="h-full w-1/3 bg-primary rounded-full" />
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block font-medium mb-1">
                  Agent Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Enter agent name"
                />
              </div>
              <div>
                <label htmlFor="description" className="block font-medium mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full px-4 py-2 border rounded-md"
                  rows={3}
                  placeholder="Describe your agent's purpose"
                />
              </div>
              <div>
                <label htmlFor="instructions" className="block font-medium mb-1">
                  Instructions
                </label>
                <textarea
                  id="instructions"
                  className="w-full px-4 py-2 border rounded-md"
                  rows={5}
                  placeholder="Provide instructions for your agent"
                />
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="outline" asChild>
                <Link href="/agents">Cancel</Link>
              </Button>
              <div className="space-x-4">
                <Button variant="outline" disabled>
                  Previous
                </Button>
                <Button>
                  Next Step
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
