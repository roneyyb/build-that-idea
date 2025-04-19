interface LivePreviewProps {
  form: any;
  step: number;
}

export function LivePreview({ form }: LivePreviewProps) {
  return (
    <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8 flex flex-col items-center">
      {/* Logo */}
      <div className="mb-4 flex flex-col items-center">
        {form.logo ? (
          <img src={form.logo} alt="Agent Logo" className="h-16 w-16 rounded-full object-cover border mb-2" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-2 text-3xl">
            <span>▲</span>
          </div>
        )}
        <div className="text-xl font-semibold text-center">{form.name || "Agent Name"}</div>
        <div className="text-gray-500 text-center mt-1">
          {form.description || "Describe your agent's purpose here."}
        </div>
      </div>
      {/* Quick Replies */}
      {form.quickReplies && form.quickReplies.length > 0 && (
        <div className="mb-4 w-full">
          <div className="flex flex-wrap gap-2 justify-center">
            {form.quickReplies.map((reply: string, idx: number) => (
              <span key={idx} className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                {reply}
              </span>
            ))}
          </div>
        </div>
      )}
      {/* Chat Input */}
      <div className="mt-8 w-full">
        <input
          className="w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder={`Message ${form.name || "Agent"}`}
          disabled
        />
      </div>
      {/* Footer */}
      <div className="mt-6 text-xs text-gray-400 text-center">
        Powered by <span className="font-semibold">Build that idea.</span> AI generated.
      </div>
    </div>
  );
}
