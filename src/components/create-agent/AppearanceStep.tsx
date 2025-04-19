import { useFormContext } from "react-hook-form";
import { ChangeEvent } from "react";

export function AppearanceStep() {
  const { register, setValue, watch } = useFormContext();
  const form = watch();

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setValue("logo", ev.target?.result as string, { shouldDirty: true });
      };
      reader.readAsDataURL(file);
    }
  }

  function handleQuickReplies(e: ChangeEvent<HTMLInputElement>) {
    const replies = e.target.value.split(/, ?/).map((r) => r.trim()).filter(Boolean);
    setValue("quickReplies", replies, { shouldDirty: true });
  }

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 mb-4">
        <button className="px-4 py-2 rounded bg-gray-100 text-gray-700">Setup</button>
        <button className="px-4 py-2 rounded bg-orange-100 text-orange-700 font-semibold">Appearance</button>
        <button className="px-4 py-2 rounded bg-gray-100 text-gray-700">Monetization</button>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Agent Logo</label>
        <input
          type="file"
          accept="image/*"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          onChange={handleLogoChange}
        />
        {form.logo && (
          <img src={form.logo} alt="Agent Logo" className="mt-2 h-16 w-16 rounded-full object-cover border" />
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Quick Replies</label>
        <input
          className="w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.quickReplies?.join(", ") || ""}
          onChange={handleQuickReplies}
          placeholder="e.g. Hello, How can I help you?, Thanks!"
        />
        <div className="text-xs text-gray-500 mt-1">Separate replies with commas.</div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Theme</label>
        <select
          className="w-full rounded border px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-orange-400"
          {...register("theme")}
        >
          <option value="default">Default</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="custom">Custom</option>
        </select>
      </div>
    </div>
  );
}
