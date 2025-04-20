import * as z from 'zod';

export const agentFormSchema = z.object({
    name: z.string().min(2, 'Name is required'),
    description: z.string().min(10, 'Description is required'),
    instructions: z.string().min(10, 'Instructions are required'),
    logo: z.string().optional(),
    quickReplies: z.array(z.string()).optional(),
    theme: z.string().optional(),
    pricing: z.string().optional(),
    model: z.string().min(1, 'Model is required'),
    subscription: z.boolean().optional(),
    public: z.boolean().optional(), // <-- Add this for visibility
    status: z.enum(['active', 'inactive']).optional(), // <-- Add this for status
    createdAt: z.string().optional(),
    type: z.string().optional(),
    tokenUsage: z.number().optional(),
    maxTokens: z.number().optional(),
    id: z.string().optional(),
    accessType: z.enum(['free', 'paid']).optional(),
});

export type AgentFormSchema = z.infer<typeof agentFormSchema>;
