import { useFormContext } from "react-hook-form";

export function MonetizationStep() {
    const { register, setValue, watch } = useFormContext();
    const form = watch();

    return (
        <div className="space-y-6">

            <div className="mb-4">
                <label className="block text-sm font-bold mb-1 text-[#020817]">Pricing</label>
                <input
                    className="w-full rounded border-[1.5px] border-[#020817]/20 px-3 py-2 text-base text-[#020817] focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-[#020817]/50"
                    {...register("pricing")}
                    placeholder="e.g. $9.99/month"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-bold mb-1 text-[#020817]">Model Selection</label>
                <select
                    className="w-full rounded border-[1.5px] border-[#020817]/20 px-3 py-2 text-base text-[#020817] focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder:text-[#020817]/50"
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
                <label className="text-sm font-bold text-[#020817]">Enable subscription features</label>
            </div>
        </div>
    );
}
