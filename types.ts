
export enum Tier {
  Bronze = 'Bronze',
  Prata = 'Prata',
  Ouro = 'Ouro',
  Diamante = 'Diamante',
}

export interface Interaction {
  id: string;
  type: 'note' | 'email' | 'call' | 'meeting' | 'whatsapp' | 'other';
  date: string; // ISO string format
  title: string;
  description: string;
  author: string;
}

export interface Cooperado {
  id: number;
  name: string;
  avatar: string;
  email: string;
  since: string;
  tier: Tier;
  value: number; // Pipeline value
  companyName: string;
  sector: string;
  annualRevenue: number;
  employeeCount: number;
  notes: string;
  engagementRate: number; // percent
  conversionRate: number; // percent
  timeline: Interaction[];
}

export enum OpportunityStage {
  Prospecting = 'Prospecção',
  Qualification = 'Qualificação',
  Diagnosis = 'Diagnóstico',
  Proposal = 'Proposta',
  Negotiation = 'Negociação',
  Won = 'Ganho',
  Lost = 'Perdido',
}

export interface Oportunidade {
  id: string;
  title: string;
  cooperadoName: string;
  cooperadoId: number;
  value: number;
  stage: OpportunityStage;
  description: string;
  expected_close_date: string;
}

export interface Produto {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  active: boolean;
}

export enum TaskPriority {
  Low = 'Baixa',
  Medium = 'Média',
  High = 'Alta',
}

export interface Tarefa {
  id: string;
  title: string;
  dueDate: string;
  priority: TaskPriority;
  completed: boolean;
  linkedTo: string;
}

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string | React.ReactNode;
    timestamp: string;
}