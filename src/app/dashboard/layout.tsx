import { Sidebar } from '@/components/sidebar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-white">
            <div className="flex-shrink-0">
                <Sidebar />
            </div>
            <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
                {children}
            </main>
        </div>
    );
}
