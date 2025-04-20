import { useFormContext } from "react-hook-form";
import { ChangeEvent } from "react";

import { useState } from "react";

export function AppearanceStep() {
    const { register, setValue, watch } = useFormContext();
    const form = watch();
    const [quickRepliesInput, setQuickRepliesInput] = useState(form.quickReplies?.join(", ") || "");

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

    function handleQuickRepliesInput(e: ChangeEvent<HTMLInputElement>) {
        setQuickRepliesInput(e.target.value);
    }
    function handleQuickRepliesBlur() {
        const replies = quickRepliesInput.split(',').map((r) => r.trim()).filter(Boolean);
        setValue("quickReplies", replies, { shouldDirty: true });
    }

    return (
        <div className="space-y-6">

            <div className="mb-4">
                <label className="block text-sm font-bold mb-1 text-[#020817]">Agent Logo</label>
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
                <label className="block text-sm font-bold mb-1 text-[#020817]">Quick Replies</label>
                <input
                    className="w-full rounded border-[1.5px] border-[#020817]/20 px-3 py-2 text-base text-[#020817] focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-[#020817]/50"
                    value={quickRepliesInput}
                    onChange={handleQuickRepliesInput}
                    onBlur={handleQuickRepliesBlur}
                    placeholder="e.g. Hello, How can I help you?, Thanks!"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.quickReplies && form.quickReplies.map((reply: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-200">
                      {reply}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-[#020817] mt-1">Separate replies with commas.</div>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-1 text-[#020817]">Theme</label>
                <select
                    className="w-full rounded border-[1.5px] border-[#020817]/20 px-3 py-2 text-base text-[#020817] focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-[#020817]/50"
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
