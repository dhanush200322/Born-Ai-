export interface AgentBackendPayload {
  agent_details: {
    name: string;
    description: string;
    role: string;
    avatar: string;
  };
  knowledge_base: {
    files: string[]; // Mocking files as strings for UI
    website_urls: string[];
    faqs: { question: string; answer: string }[];
  };
  memory_config: {
    session_memory_enabled: boolean;
    long_term_memory_enabled: boolean;
    retention_period_days: number | 'infinite';
  };
  channels: {
    website: boolean;
    whatsapp: boolean;
    telegram: boolean;
    voice: boolean;
    api: boolean;
  };
}

export const defaultAgentPayload: AgentBackendPayload = {
  agent_details: {
    name: '',
    description: '',
    role: '',
    avatar: 'Bot'
  },
  knowledge_base: {
    files: [],
    website_urls: [],
    faqs: []
  },
  memory_config: {
    session_memory_enabled: true,
    long_term_memory_enabled: false,
    retention_period_days: 30
  },
  channels: {
    website: false,
    whatsapp: false,
    telegram: false,
    voice: false,
    api: false
  }
};
