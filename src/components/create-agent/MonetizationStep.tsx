import { useFormContext } from "react-hook-form";

export function MonetizationStep() {
  const { register, setValue, watch } = useFormContext();
  const form = watch();

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-4">
        <button className="px-4 py-2 rounded bg-gray-100 text-gray-700">Setup</button>
        <button className="px-4 py-2 rounded bg-gray-100 text-gray-700">Appearance</button>
        <button className="px-4 py-2 rounded bg-orange-100 text-orange-700 font-semibold">Monetization</button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Pricing</label>
        <input
          className="w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
          {...register("pricing")}
          placeholder="e.g. $9.99/month"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Model Selection</label>
        <select
          className="w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
          {...register("model")}
        >
          <option value="">Select a model</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-3.5">GPT-3.5</option>
          <option value="llama-2">Llama 2</option>
        </select>
      </div>
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          checked={!!form.subscription}
          onChange={e => setValue("subscription", e.target.checked, { shouldDirty: true })}
          className="mr-2"
        />
        <label className="text-sm font-medium">Enable subscription features</label>
      </div>
    </div>
  );
}
