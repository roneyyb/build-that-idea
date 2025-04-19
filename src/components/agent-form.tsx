import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const basicInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  instructions: z.string().min(1, 'Instructions are required'),
});

const appearanceSchema = z.object({
  logoUrl: z.string().url().optional(),
  quickReplies: z.array(z.string()),
  theme: z.object({
    primaryColor: z.string(),
    secondaryColor: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
  }),
});

const monetizationSchema = z.object({
  pricing: z.object({
    type: z.enum(['free', 'paid']),
    amount: z.number().optional(),
    currency: z.string().optional(),
    interval: z.enum(['monthly', 'yearly']).optional(),
  }),
  model: z.object({
    name: z.string(),
    type: z.string(),
    parameters: z.record(z.union([z.string(), z.number(), z.boolean()])),
  }),
  features: z.array(z.string()),
});

const agentSchema = z.object({
  basicInfo: basicInfoSchema,
  appearance: appearanceSchema,
  monetization: monetizationSchema,
});

type AgentFormData = z.infer<typeof agentSchema>;

export function AgentForm() {
  const [step, setStep] = useState(1);
  const form = useForm<AgentFormData>({
    resolver: zodResolver(agentSchema),
    defaultValues: {
      basicInfo: {
        name: '',
        description: '',
        instructions: '',
      },
      appearance: {
        quickReplies: [],
        theme: {
          primaryColor: '#000000',
          secondaryColor: '#ffffff',
          backgroundColor: '#f5f5f5',
          textColor: '#000000',
        },
      },
      monetization: {
        pricing: {
          type: 'free',
        },
        model: {
          name: 'gpt-3.5-turbo',
          type: 'chat',
          parameters: {
            temperature: 0.7,
            maxTokens: 2048,
          },
        },
        features: [],
      },
    },
  });

  const onSubmit = async (data: AgentFormData) => {
    console.log('Form submitted:', data);
    // TODO: Submit data to API
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Agent Name
            </label>
            <input
              {...form.register('basicInfo.name')}
              type="text"
              id="name"
              className="w-full px-4 py-2 border rounded-md"
              placeholder="Enter agent name"
            />
            {form.formState.errors.basicInfo?.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.basicInfo.name.message}
              </p>
            )}
          </div>
          {/* Add other basic info fields */}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          {/* Add appearance fields */}
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          {/* Add monetization fields */}
        </div>
      )}

      <div className="flex justify-between pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        {step < 3 ? (
          <Button
            type="button"
            onClick={() => setStep((s) => Math.min(3, s + 1))}
          >
            Next Step
          </Button>
        ) : (
          <Button type="submit">Create Agent</Button>
        )}
      </div>
    </form>
  );
}
