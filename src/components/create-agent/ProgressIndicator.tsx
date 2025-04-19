interface ProgressIndicatorProps {
  step: number;
  steps: { label: string }[];
}

export function ProgressIndicator({ step, steps }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center mb-4">
      {steps.map((s, idx) => (
        <div key={s.label} className="flex items-center">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              idx === step
                ? 'border-orange-500 bg-orange-100 text-orange-700 font-bold'
                : 'border-gray-300 bg-white text-gray-400'
            }`}
          >
            {idx + 1}
          </div>
          {idx < steps.length - 1 && (
            <div className="w-8 h-1 bg-gray-200 mx-2 rounded" />
          )}
        </div>
      ))}
    </div>
  );
}
