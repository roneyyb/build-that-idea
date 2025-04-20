interface LivePreviewProps {
    form: any;
    step: number;
}

export function LivePreview({ form }: LivePreviewProps) {
    return (
        <div className="relative w-full h-[600px] max-w-2xl bg-gradient-to-br from-white via-[#f8fafc] to-[#e0e7ef] border border-gray-200 rounded-2xl flex flex-col justify-between items-center mx-auto p-0 overflow-hidden shadow-lg">
            {/* Login button */}
            <div className="absolute top-6 right-8 z-10">
                <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-full px-7 py-2 shadow transition-all">Login</button>
            </div>
            {/* Main content */}
            <div className="flex-1 flex flex-col justify-center items-center px-4">
                <div className="flex flex-col items-center justify-center mt-4">
                    <div className="mb-6 mt-10">
                        {form.logo ? (
                            <img src={form.logo} alt="Agent Logo" className="h-24 w-24 rounded-full object-cover border-4 border-[#020817] shadow-lg transition-transform hover:scale-105" />
                        ) : (
                            <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-[#f1f5f9] to-[#dbeafe] flex items-center justify-center text-5xl shadow-lg border-4 border-[#020817]">
                                <span className="text-[#020817]">🤖</span>
                            </div>
                        )}
                    </div>
                    <div className="text-2xl font-extrabold text-center mb-1 text-[#020817] tracking-tight drop-shadow-sm">{form.name || "Your AI Agent"}</div>
                    <div className="text-gray-600 text-center text-base max-w-md mb-4 italic">
                        {form.description || "Create a unique, branded AI agent to engage users and automate conversations. See your agent's appearance and messaging here before going live."}
                    </div>
                </div>
            </div>
            {/* Chat input at bottom */}
            <div className="w-full px-6 pb-6 flex flex-col">
                <div className="w-full flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <input
                        className="flex-1 px-4 py-3 text-base focus:outline-none placeholder-gray-400 bg-transparent"
                        placeholder={`Message ${form.name || "AstroGPT"}`}
                        disabled
                    />
                    <button className="bg-orange-400 hover:bg-orange-500 text-white p-2 rounded-r-lg flex items-center justify-center transition-all">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                </div>
                <div className="text-xs text-gray-400 text-center mt-2">
                    Powered by <span className="font-bold">Build that idea.</span> AI generated.
                </div>
            </div>
        </div>
    );
}
