import { useFormContext } from "react-hook-form";

export function BasicInfoStep() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();
  const form = watch();
  return (
    <div className="space-y-6">
      <div>
        <div className="flex space-x-4 mb-4">
          <button className="px-4 py-2 rounded bg-orange-100 text-orange-700 font-semibold">Setup</button>
          <button className="px-4 py-2 rounded bg-gray-100 text-gray-700">Appearance</button>
          <button className="px-4 py-2 rounded bg-gray-100 text-gray-700">Monetization</button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">What is your agent called?</label>
          <input
            className="w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
            {...register("name")}
            placeholder="Agent Name"
          />
          {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name.message}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">What does your agent do?</label>
          <textarea
            className="w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
            {...register("description")}
            placeholder="Describe your agent"
            rows={3}
          />
          {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description.message}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Choose a default AI model</label>
          <select
            className="w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
            {...register("model")}
          >
            <option value="">Select a model</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5">GPT-3.5</option>
            <option value="llama-2">Llama 2</option>
          </select>
          {errors.model && <div className="text-red-500 text-xs mt-1">{errors.model.message}</div>}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Set the context and behavior for this Agent</label>
          <textarea
            className="w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
            {...register("instructions")}
            placeholder="e.g. You are a travel assistant..."
            rows={3}
          />
          <button className="mt-2 px-3 py-1 rounded bg-orange-100 text-orange-700 text-xs">Optimize your prompt</button>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Knowledge Base</label>
          <input
            type="file"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            // TODO: handle file upload
          />
          <div className="text-xs text-gray-500 mt-1">Upload documents to give your agent specialized knowledge. Supported: PDF, TXT, CSV, DOCX.</div>
        </div>
      </div>
    </div>
  );
}
