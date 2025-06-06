"use client";
"use client";
import { AppearanceStep } from "@/components/create-agent/AppearanceStep";
import { BasicInfoStep } from "@/components/create-agent/BasicInfoStep";
import { LivePreview } from "@/components/create-agent/LivePreview";
import { MonetizationStep } from "@/components/create-agent/MonetizationStep";
import { ProgressIndicator } from "@/components/create-agent/ProgressIndicator";
import { CreateAgentProvider, useCreateAgentContext } from "@/components/create-agent/context";
import { agentFormSchema, AgentFormSchema } from "@/components/create-agent/schema";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const steps = [
    { label: "Setup", component: BasicInfoStep },
    { label: "Appearance", component: AppearanceStep },
    { label: "Monetization", component: MonetizationStep },
];

const LOCAL_STORAGE_KEY = "create_agent_wizard";

import { useSearchParams } from "next/navigation";

function WizardShell() {
    const { state, dispatch } = useCreateAgentContext();
    const params = useSearchParams();
    const agentId = params.get("id");
    const [isLoaded, setIsLoaded] = useState(false);
    const methods = useForm<AgentFormSchema>({
        resolver: zodResolver(agentFormSchema),
        mode: "onChange",
        defaultValues: state.form,
    });

    const [loading, setLoading] = useState(false);
    // Prefill if editing
    useEffect(() => {
        if (agentId && !isLoaded) {
            fetch(`/api/agents/${agentId}`)
                .then(res => res.ok ? res.json() : null)
                .then(agent => {
                    if (agent && 'createdAt' in agent) {
                        // Ensure 'public' is set for old data
                        if (typeof agent.public === 'undefined') {
                            agent.public = false;
                        }
                        methods.reset(agent);
                        dispatch({ type: "SET_FORM", payload: agent });
                    }
                    setIsLoaded(true);
                });
        } else if (!agentId && !isLoaded) {
            // Restore draft from localStorage if present
            const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (draft) {
                try {
                    const parsed = JSON.parse(draft);
                    methods.reset(parsed);
                    dispatch({ type: "SET_FORM", payload: parsed });
                } catch {

                    // ignore parse error
                }
            }
            setIsLoaded(true);
        }
    }, [agentId, isLoaded, methods, dispatch]);

    // Sync react-hook-form with context/reducer
    useEffect(() => {
        methods.reset(state.form);
    }, [state.form, methods]);

    // Auto-save to localStorage
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.form));
    }, [state.form]);

    const CurrentStep = steps[state.step].component;

    const handleSubmit = async (data: AgentFormSchema) => {
        setLoading(true);

        const { createdAt, ...rest } = data;
        const agentToSave = {
            ...rest,
            createdAt: createdAt || new Date().toISOString(),
            status: typeof rest.status === 'string' ? rest.status : 'active',
            type: data.theme || 'General',
            tokenUsage: 0,
            maxTokens: 10000000
        };
        const url = agentId
            ? `/api/agents/${agentId}`
            : '/api/agents';
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agentToSave),
        });
        localStorage.removeItem(LOCAL_STORAGE_KEY); // Clear draft after submit
        dispatch({ type: 'RESET' });
        setLoading(false);
        window.location.href = '/dashboard/agents';
    };

    if (!isLoaded) return (
        <div className="flex h-screen w-full bg-white">
            <div className="flex-1 max-w-xl p-8 border-r border-gray-200 flex flex-col">
                <div className="space-y-6">
                    <Skeleton className="h-8 w-2/3 mb-6" />
                    <Skeleton className="h-4 w-1/3 mb-4" />
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <Skeleton className="h-96 w-80 rounded-xl" />
            </div>
        </div>
    );

    return (
        <FormProvider {...methods}>
            <div className="flex h-screen w-full bg-white">
                {/* Left: Wizard */}
                <div className="flex-1 max-w-xl p-8 border-r border-gray-200 flex flex-col">
                    <h2 className="text-2xl font-bold mb-6 text-black">{agentId ? "Edit AI Agent" : "Create AI Agent"}</h2>
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
                                    onClick={methods.handleSubmit(handleSubmit)}
                                >
                                    {agentId ? "Save Changes" : "Create Agent"}
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
