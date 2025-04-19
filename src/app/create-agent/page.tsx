"use client";
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BasicInfoStep } from "@/components/create-agent/BasicInfoStep";
import { AppearanceStep } from "@/components/create-agent/AppearanceStep";
import { MonetizationStep } from "@/components/create-agent/MonetizationStep";
import { LivePreview } from "@/components/create-agent/LivePreview";
import { ProgressIndicator } from "@/components/create-agent/ProgressIndicator";
import { CreateAgentProvider, useCreateAgentContext } from "@/components/create-agent/context";
import { agentFormSchema, AgentFormSchema } from "@/components/create-agent/schema";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const steps = [
    { label: "Setup", component: BasicInfoStep },
    { label: "Appearance", component: AppearanceStep },
    { label: "Monetization", component: MonetizationStep },
];

const LOCAL_STORAGE_KEY = "create_agent_wizard";

function WizardShell() {
    const { state, dispatch } = useCreateAgentContext();
    const methods = useForm<AgentFormSchema>({
        resolver: zodResolver(agentFormSchema),
        mode: "onChange",
        defaultValues: state.form,
    });

    // Sync react-hook-form with context/reducer
    useEffect(() => {
        methods.reset(state.form);
    }, [state.form]);

    // Auto-save to localStorage
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.form));
    }, [state.form]);

    const CurrentStep = steps[state.step].component;

    return (
        <FormProvider {...methods}>
            <div className="flex h-screen w-full bg-white">
                {/* Left: Wizard */}
                <div className="flex-1 max-w-xl p-8 border-r border-gray-200 flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-black">Create AI Agent</h2>
                    <ProgressIndicator step={state.step} steps={steps} />
                    <div className="flex-1 flex flex-col justify-between">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={state.step}
                                initial={{ opacity: 0, x: 40 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ duration: 0.3 }}
                                className="mt-6"
                            >
                                <CurrentStep />
                            </motion.div>
                        </AnimatePresence>
                        <div className="flex justify-between mt-8">
                            <button
                                className={cn(
                                    "px-4 py-2 rounded bg-gray-100 text-gray-700",
                                    state.step === 0 && "opacity-50 cursor-not-allowed"
                                )}
                                onClick={() => dispatch({ type: "PREV_STEP" })}
                                disabled={state.step === 0}
                            >
                                Previous
                            </button>
                            {state.step < steps.length - 1 ? (
                                <button
                                    className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                                    onClick={methods.handleSubmit((data) => {
                                        dispatch({ type: "UPDATE_FORM", payload: data });
                                        dispatch({ type: "NEXT_STEP" });
                                    })}
                                    disabled={state.step === steps.length - 1}
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                                    onClick={methods.handleSubmit((data) => {
                                        // Save agent to localStorage array
                                        const agents = JSON.parse(localStorage.getItem('agents') || '[]');
                                        agents.push({ ...data, createdAt: new Date().toISOString(), status: 'active', type: data.theme || 'General', tokenUsage: 0, maxTokens: 10000000 });
                                        localStorage.setItem('agents', JSON.stringify(agents));
                                        // Optionally clear wizard state
                                        dispatch({ type: "RESET" });
                                        // Redirect to dashboard/agents
                                        window.location.href = '/dashboard/agents';
                                    })}
                                >
                                    Create Agent
                                </button>
                            )}
                        </div>
                    </div>
                </div>
                {/* Right: Live Preview */}
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <LivePreview form={methods.watch()} step={state.step} />
                </div>
            </div>
        </FormProvider>
    );
}

export default function CreateAgentPage() {
    return (
        <CreateAgentProvider>
            <WizardShell />
        </CreateAgentProvider>
    );
}


//   // Load from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
//     if (saved) {
//       setForm(JSON.parse(saved));
//     }
//   }, []);

//   // Auto-save to localStorage
//   useEffect(() => {
//     localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(form));
//   }, [form]);

//   const CurrentStep = steps[step].component;

//   return (
//     <div className="flex h-screen w-full bg-white">
//       {/* Left: Wizard */}
//       <div className="flex-1 max-w-xl p-8 border-r border-gray-200 flex flex-col">
//         <h2 className="text-2xl font-bold mb-6">Create AI Agent</h2>
//         <ProgressIndicator step={step} steps={steps} />
//         <div className="flex-1 flex flex-col justify-between">
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={step}
//               initial={{ opacity: 0, x: 40 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -40 }}
//               transition={{ duration: 0.3 }}
//               className="mt-6"
//             >
//               <CurrentStep
//                 form={form}
//                 setForm={setForm}
//                 errors={errors}
//                 setErrors={setErrors}
//               />
//             </motion.div>
//           </AnimatePresence>
//           <div className="flex justify-between mt-8">
//             <button
//               className={cn(
//                 "px-4 py-2 rounded bg-gray-100 text-gray-700",
//                 step === 0 && "opacity-50 cursor-not-allowed"
//               )}
//               onClick={() => setStep((s) => Math.max(0, s - 1))}
//               disabled={step === 0}
//             >
//               Previous
//             </button>
//             <button
//               className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
//               onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
//               disabled={step === steps.length - 1}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* Right: Live Preview */}
//       <div className="flex-1 flex items-center justify-center bg-gray-50">
//         <LivePreview form={form} step={step} />
//       </div>
//     </div>
//   );
// }
