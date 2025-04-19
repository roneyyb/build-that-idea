import React, { createContext, useContext, useReducer, Dispatch } from 'react';

export interface AgentFormState {
  name: string;
  description: string;
  instructions: string;
  logo: string;
  quickReplies: string[];
  theme: string;
  pricing: string;
  model: string;
  subscription: boolean;
}

export interface WizardState {
  step: number;
  form: AgentFormState;
}

export type WizardAction =
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'GOTO_STEP'; payload: number }
  | { type: 'UPDATE_FORM'; payload: Partial<AgentFormState> }
  | { type: 'SET_FORM'; payload: AgentFormState };

const initialForm: AgentFormState = {
  name: '',
  description: '',
  instructions: '',
  logo: '',
  quickReplies: [],
  theme: 'default',
  pricing: '',
  model: '',
  subscription: false,
};

const initialState: WizardState = {
  step: 0,
  form: initialForm,
};

function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'NEXT_STEP':
      return { ...state, step: Math.min(state.step + 1, 2) };
    case 'PREV_STEP':
      return { ...state, step: Math.max(state.step - 1, 0) };
    case 'GOTO_STEP':
      return { ...state, step: action.payload };
    case 'UPDATE_FORM':
      return { ...state, form: { ...state.form, ...action.payload } };
    case 'SET_FORM':
      return { ...state, form: action.payload };
    default:
      return state;
  }
}

const CreateAgentContext = createContext<{
  state: WizardState;
  dispatch: Dispatch<WizardAction>;
}>({ state: initialState, dispatch: () => {} });

export function useCreateAgentContext() {
  return useContext(CreateAgentContext);
}

export function CreateAgentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(wizardReducer, initialState);
  return (
    <CreateAgentContext.Provider value={{ state, dispatch }}>
      {children}
    </CreateAgentContext.Provider>
  );
}
