import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Agent Management System</h1>
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <Button asChild>
              <Link href="/agents/create">Create Agent</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
              Create and manage your AI agents
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Build powerful AI agents that can chat with your users. Customize their appearance,
              behavior, and monetization options.
            </p>
          </div>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/agents">View All Agents</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/docs">Documentation</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
