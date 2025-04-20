"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AgentFormSchema, agentFormSchema } from "@/components/create-agent/schema";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateAgentProvider } from "@/components/create-agent/context";
import { BasicInfoStep } from "@/components/create-agent/BasicInfoStep";
import { AppearanceStep } from "@/components/create-agent/AppearanceStep";
import { MonetizationStep } from "@/components/create-agent/MonetizationStep";
import { LivePreview } from "@/components/create-agent/LivePreview";
import { ProgressIndicator } from "@/components/create-agent/ProgressIndicator";

const steps = [
  { label: "Setup", component: BasicInfoStep },
  { label: "Appearance", component: AppearanceStep },
  { label: "Monetization", component: MonetizationStep },
];

export default function EditAgentPage() {
  const router = useRouter();
  const params = useSearchParams();
  const agentId = params.get("id");
  const [initialData, setInitialData] = useState<AgentFormSchema | null>(null);
  const [loading, setLoading] = useState(false); // Used for loading state during fetches and deletes

  useEffect(() => {
    if (agentId) {
      setLoading(true);
      fetch(`/api/agents/${agentId}`)
        .then(res => {
          if (!res.ok) throw new Error("Agent not found");
          return res.json();
        })
        .then(agent => {
          setInitialData(agent);
        })
        .catch(() => setInitialData(null))
        .finally(() => setLoading(false));
    }
  }, [agentId]);

  const methods = useForm<AgentFormSchema>({
    resolver: zodResolver(agentFormSchema),
    defaultValues: initialData || undefined,
    mode: "onChange"
  });

  useEffect(() => {
    if (initialData) methods.reset(initialData);
  }, [initialData]);

  // Save changes
  const onSubmit = async (data: AgentFormSchema) => {
    if (agentId) {
      setLoading(true);
      // Remove createdAt if present, always include id
      const { createdAt, ...rest } = data;
      await fetch(`/api/agents/${agentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rest, id: agentId }),
      });
      setLoading(false);
    }
    router.push("/dashboard/agents");
  };

  if (!initialData) return <div className="p-8">Loading...</div>;

  // For simplicity, show all steps stacked, or you can implement wizard navigation

  return (
    <CreateAgentProvider>
      <FormProvider {...methods}>
        <div className="flex h-screen w-full bg-white">
          <div className="flex-1 max-w-xl p-8 border-r border-gray-200 flex flex-col">
            <h2 className="text-2xl font-bold mb-6">Edit Agent</h2>
            <ProgressIndicator step={0} steps={steps} />
            <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
              <BasicInfoStep />
              <AppearanceStep />
              <MonetizationStep />
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={async () => {
                    if (!agentId) return;
                    setLoading(true);
                    await fetch(`/api/agents/${agentId}`, { method: "DELETE" });
                    setLoading(false);
                    router.push("/dashboard/agents");
                  }}
                >
                  Delete
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                  onClick={methods.handleSubmit(onSubmit)}
                >
                  {agentId ? "Save Changes" : "Create Agent"}
                </button>
              </div>
            </form>
          </div>
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <LivePreview form={methods.watch()} step={0} />
          </div>
        </div>
      </FormProvider>
    </CreateAgentProvider>
  );
}
