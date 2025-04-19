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
        <div className="flex h-screen flex-col justify-between bg-white p-4 min-w-[260px] border border-[#020817]">
            <div className="space-y-4">
                <div className="flex justify-center py-4">
                    <img src="https://buildthatidea.com/_next/static/media/logo.093f0b47.png" alt="Build That Idea Logo" className="h-10 w-auto" />
                </div>
                <div className="space-y-2">
                    <Link
                        href="/create-agent"
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-orange-700 px-4 py-2 text-white font-bold text-base shadow-lg hover:from-yellow-500 hover:to-orange-800 transition-colors"
                    >
                        <span className="text-lg font-bold">+</span> Create Agent
                    </Link>
                </div>
                <nav className="space-y-1 mt-4">
                    {sidebarItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium text-[#020817] hover:bg-[#F7F7F7] transition-colors',
                                    isActive && 'bg-[#F7F7F7]'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
            <div className="border-t border-[#020817] pt-4 mt-6">
                <div className="flex items-center gap-3 px-4 py-2">
                    <div className="h-9 w-9 rounded-full bg-[#F7F7F7] flex items-center justify-center font-bold text-[#020817] text-base border border-[#D1D5DB]">
                        JD
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-[#020817] leading-tight">John Doe</p>
                        <p className="text-xs text-gray-500">john@example.com</p>
                    </div>
                </div>
                <button className="mt-2 flex w-full items-center gap-2 rounded-lg px-4 py-2 text-gray-600 hover:bg-[#F7F7F7] font-medium transition-colors">
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
