"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    DollarSign,
    HelpCircle,
    LogOut
} from 'lucide-react';

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'My Agents', href: '/dashboard/agents' },
    { icon: DollarSign, label: 'Payouts', href: '/dashboard/payouts' },
    { icon: HelpCircle, label: 'Support', href: '/dashboard/support' },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen flex-col justify-between bg-pink-50 p-4 shadow-lg border border-pink-100">
            <div className="space-y-4">
                <div className="flex items-center space-x-2 px-2 py-4">
                    <h1 className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-400 to-orange-500 text-2xl drop-shadow-lg tracking-wide" style={{ fontFamily: 'cursive, Comic Sans MS, sans-serif' }}>build that idea</h1>
                </div>
                <div className="space-y-2">
                    <Link
                        href="/create-agent"
                        className="flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-pink-500 to-orange-400 px-4 py-2 text-white font-semibold shadow-md hover:from-pink-600 hover:to-orange-500 transition-colors"
                    >
                        + Create Agent
                    </Link>
                </div>
                <nav className="space-y-2">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center space-x-2 rounded-lg px-4 py-2 hover:bg-pink-100 transition-colors',
                                    isActive && 'bg-pink-200 text-pink-700 font-bold shadow'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t pt-4">
                <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        JD
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                    </div>
                </div>
                <button className="mt-2 flex w-full items-center space-x-2 rounded-lg px-4 py-2 text-gray-600 hover:bg-gray-100">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
