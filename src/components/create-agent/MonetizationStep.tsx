import { useFormContext } from "react-hook-form";
import { CustomCheckbox } from "../ui/CustomCheckbox";
import "../ui/custom-checkbox.css";

import "../ui/custom-radio.css";

export function MonetizationStep() {
    const { setValue, watch } = useFormContext();
    const form = watch();

    // Default values for new fields
    if (!form.accessType) setValue('accessType', 'free', { shouldDirty: false });
    if (form.public === undefined) setValue('public', false, { shouldDirty: false });

    return (
        <div className="space-y-6">

            {/* Access Type Selection */}
            <div className="grid gap-4">
                <label className="block text-sm font-bold mb-2 text-[#020817]">Access</label>
                <div className="grid gap-2">
                    <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-150 ${form.accessType === 'free' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}
                        htmlFor="accessType-free">
                        <CustomCheckbox
                            id="accessType-free"
                            checked={form.accessType === 'free'}
                            onChange={() => setValue('accessType', 'free', { shouldDirty: true })}
                            name="accessType"
                        />
                        <div>
                            <div className="font-semibold text-[#020817]">Free Access</div>
                            <div className="text-gray-600 text-sm">Anyone can use your agent for free.</div>
                        </div>
                    </label>
                    <label className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-all duration-150 ${form.accessType === 'paid' ? 'border-orange-500 bg-orange-50' : 'border-gray-200 bg-white'}`}
                        htmlFor="accessType-paid">
                        <CustomCheckbox
                            id="accessType-paid"
                            checked={form.accessType === 'paid'}
                            onChange={() => setValue('accessType', 'paid', { shouldDirty: true })}
                            name="accessType"
                        />
                        <div>
                            <div className="font-semibold text-[#020817]">Paid Subscription</div>
                            <div className="text-gray-600 text-sm">Charge users a monthly fee to access your chatbot.</div>
                        </div>
                    </label>
                </div>
            </div>
            {/* Public Visibility Toggle */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 flex items-center justify-between">
                <div>
                    <div className="font-semibold text-[#020817]">Public Visibility</div>
                    <div className="text-gray-600 text-sm">Make your agent discoverable to everyone.</div>
                </div>
                <CustomCheckbox
                    checked={!!form.public}
                    onChange={e => setValue('public', e.target.checked, { shouldDirty: true })}
                />
            </div>
        </div>
    );
}
