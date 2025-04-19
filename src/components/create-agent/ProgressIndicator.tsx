interface ProgressIndicatorProps {
    step: number;
    steps: { label: string }[];
}

export function ProgressIndicator({ step, steps }: ProgressIndicatorProps) {
    return (
        <div className="w-full flex justify-center mb-6">
            <div className="flex w-full max-w-xl rounded-xl bg-[#000000]/5 ">
                {steps.map((s, idx) => (
                    <div
                        key={s.label}
                        className={`flex-1 text-center py-2 px-4 m-[4px]  cursor-pointer transition-all
              ${idx === step
                                ? 'bg-white text-black font-bold shadow rounded-xl'
                                : 'text-gray-400 font-semibold'}
              ${idx === 0 ? 'rounded-l-xl' : ''}
              ${idx === steps.length - 1 ? 'rounded-r-xl' : ''}
            `}
                    >
                        {s.label}
                    </div>
                ))}
            </div>
        </div>
    );
}
