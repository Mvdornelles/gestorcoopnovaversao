
import { Cooperado, Oportunidade, Produto, Tarefa, Tier, OpportunityStage, TaskPriority, Interaction } from '../types';

export const mockInteractions: { [key: number]: Interaction[] } = {
  1: [ // Ana Silva
    { id: 'int-1-1', type: 'meeting', date: '2024-07-25T10:00:00Z', title: 'Reunião de Alinhamento', description: 'Reunião inicial de alinhamento sobre objetivos de investimento. Mostrou interesse em previdência privada.', author: 'Mariana Costa' },
    { id: 'int-1-2', type: 'email', date: '2024-07-28T15:30:00Z', title: 'Envio de Proposta', description: 'Envio de proposta de investimento personalizado por e-mail.', author: 'Mariana Costa' },
    { id: 'int-1-3', type: 'call', date: '2024-08-02T11:00:00Z', title: 'Ligação de Follow-up', description: 'Ligação de follow-up. Agendada nova conversa para a próxima semana.', author: 'Mariana Costa' },
    { id: 'int-1-4', type: 'note', date: '2024-08-05T09:00:00Z', title: 'Observação Interna', description: 'Cliente parece muito engajada e propensa a fechar o novo plano de previdência.', author: 'Mariana Costa' },
  ],
  2: [ // Bruno Costa
    { id: 'int-2-1', type: 'call', date: '2024-07-15T16:00:00Z', title: 'Contato Inicial', description: 'Contato inicial para apresentar a linha de crédito PJ. Pareceu interessado mas pediu mais tempo para analisar.', author: 'Mariana Costa' },
    { id: 'int-2-2', type: 'email', date: '2024-07-20T10:00:00Z', title: 'Detalhes da Linha de Crédito', description: 'E-mail com detalhes adicionais sobre as taxas e condições da linha de crédito.', author: 'Mariana Costa' },
    { id: 'int-2-3', type: 'whatsapp', date: '2024-08-01T14:00:00Z', title: 'Contato via WhatsApp', description: 'Enviei uma mensagem rápida para saber se ele tinha alguma dúvida sobre o material. Respondeu que está analisando.', author: 'Mariana Costa' },
  ],
  3: [ // Carla Dias
    { id: 'int-3-1', type: 'meeting', date: '2024-06-10T09:30:00Z', title: 'Reunião Consórcio', description: 'Reunião sobre a ampliação do consórcio de imóveis.', author: 'Mariana Costa' },
    { id: 'int-3-2', type: 'note', date: '2024-06-12T11:00:00Z', title: 'Preparar Documentação', description: 'Preparar documentação para a proposta de consórcio.', author: 'Mariana Costa' },
    { id: 'int-3-3', type: 'email', date: '2024-06-18T17:00:00Z', title: 'Proposta Enviada', description: 'Proposta de ampliação enviada para análise.', author: 'Mariana Costa' },
  ],
  4: [ // Daniel Alves
    { id: 'int-4-1', type: 'note', date: '2024-07-30T08:00:00Z', title: 'Alerta da IA', description: 'Baixa interação nos últimos 60 dias. IA sugeriu contato proativo.', author: 'Sistema (IA)' },
    { id: 'int-4-2', type: 'call', date: '2024-08-01T14:30:00Z', title: 'Tentativa de Contato', description: 'Tentativa de contato, sem sucesso. Deixei recado.', author: 'Mariana Costa' },
  ],
  5: [ // Eduarda Lima
    { id: 'int-5-1', type: 'meeting', date: '2024-07-05T11:00:00Z', title: 'Investimentos de Perfil Moderado', description: 'Discussão sobre investimentos de perfil moderado.', author: 'Mariana Costa' },
    { id: 'int-5-2', type: 'email', date: '2024-07-08T15:00:00Z', title: 'Envio de Portfólio', description: 'Envio de portfólio sugerido.', author: 'Mariana Costa' },
  ],
};


export const mockCooperados: Cooperado[] = [
  { 
    id: 1, name: 'Ana Silva', avatar: 'https://picsum.photos/id/237/200', email: 'ana.silva@example.com', since: '2021-03-12', tier: Tier.Ouro, value: 150000,
    companyName: 'Silva & Filhos Advocacia', sector: 'Serviços Jurídicos', annualRevenue: 1200000, employeeCount: 15,
    notes: 'Cliente de alto valor, muito engajada com a cooperativa. Potencial para cross-sell de seguros empresariais.',
    engagementRate: 92, conversionRate: 45, timeline: mockInteractions[1]
  },
  { 
    id: 2, name: 'Bruno Costa', avatar: 'https://picsum.photos/id/238/200', email: 'bruno.costa@example.com', since: '2022-01-20', tier: Tier.Prata, value: 75000,
    companyName: 'BC Tech Solutions', sector: 'Tecnologia da Informação', annualRevenue: 850000, employeeCount: 8,
    notes: 'Foco em soluções de crédito para expansão. Demanda por agilidade nas aprovações.',
    engagementRate: 65, conversionRate: 25, timeline: mockInteractions[2]
  },
  { 
    id: 3, name: 'Carla Dias', avatar: 'https://picsum.photos/id/239/200', email: 'carla.dias@example.com', since: '2020-11-05', tier: Tier.Diamante, value: 250000,
    companyName: 'Dias Construtora', sector: 'Construção Civil', annualRevenue: 3500000, employeeCount: 42,
    notes: 'Uma das maiores investidoras da cooperativa. Relacionamento estratégico. Participa ativamente dos eventos.',
    engagementRate: 98, conversionRate: 60, timeline: mockInteractions[3]
  },
  { 
    id: 4, name: 'Daniel Alves', avatar: 'https://picsum.photos/id/240/200', email: 'daniel.alves@example.com', since: '2023-08-15', tier: Tier.Bronze, value: 15000,
    companyName: 'Mercearia do Bairro', sector: 'Varejo', annualRevenue: 300000, employeeCount: 4,
    notes: 'Pequeno comerciante, focado em capital de giro. Apresenta risco de churn devido à baixa interação recente.',
    engagementRate: 25, conversionRate: 10, timeline: mockInteractions[4]
  },
  { 
    id: 5, name: 'Eduarda Lima', avatar: 'https://picsum.photos/id/241/200', email: 'eduarda.lima@example.com', since: '2022-06-30', tier: Tier.Prata, value: 95000,
    companyName: 'Consultório Odontológico Sorriso', sector: 'Saúde', annualRevenue: 600000, employeeCount: 6,
    notes: 'Busca investimentos de médio prazo para aquisição de novos equipamentos.',
    engagementRate: 72, conversionRate: 30, timeline: mockInteractions[5]
  },
];


export const mockOportunidades: Oportunidade[] = [
    { id: 'op-1', title: 'Consultoria Financeira', cooperadoName: 'Ana Silva', cooperadoId: 1, value: 5000, stage: OpportunityStage.Proposal, description: 'Consultoria para otimização de investimentos pessoais.', expected_close_date: '2024-08-30' },
    { id: 'op-2', title: 'Linha de Crédito PJ', cooperadoName: 'BC Tech Solutions', cooperadoId: 2, value: 150000, stage: OpportunityStage.Negotiation, description: 'Crédito para aquisição de novos servidores e expansão da infraestrutura.', expected_close_date: '2024-09-15' },
    { id: 'op-3', title: 'Investimento em Renda Fixa', cooperadoName: 'Bruno Costa', cooperadoId: 2, value: 25000, stage: OpportunityStage.Diagnosis, description: 'Análise de perfil para alocação em CDBs e LCIs.', expected_close_date: '2024-09-05' },
    { id: 'op-4', title: 'Seguro de Vida Empresarial', cooperadoName: 'Dias Construtora', cooperadoId: 3, value: 7500, stage: OpportunityStage.Qualification, description: 'Cotação de seguro de vida para os 42 funcionários da construtora.', expected_close_date: '2024-10-01' },
    { id: 'op-5', title: 'Novo Cliente Potencial', cooperadoName: 'Startup Inovadora', cooperadoId: 0, value: 20000, stage: OpportunityStage.Prospecting, description: 'Primeiro contato com startup promissora do setor de agritech.', expected_close_date: '2024-09-20' },
    { id: 'op-6', title: 'Ampliação de Consórcio', cooperadoName: 'Carla Dias', cooperadoId: 3, value: 45000, stage: OpportunityStage.Proposal, description: 'Aumento da carta de crédito do consórcio de imóveis existente.', expected_close_date: '2024-08-25' },
    { id: 'op-7', title: 'Financiamento de Equipamentos', cooperadoName: 'Consultório Odontológico Sorriso', cooperadoId: 5, value: 80000, stage: OpportunityStage.Won, description: 'Crédito aprovado e liberado para compra de equipamento de raio-x panorâmico.', expected_close_date: '2024-07-28' },
    { id: 'op-8', title: 'Previdência Privada', cooperadoName: 'Ana Silva', cooperadoId: 1, value: 120000, stage: OpportunityStage.Won, description: 'Contratação de plano de previdência VGBL com aportes mensais.', expected_close_date: '2024-08-01' },
    { id: 'op-9', title: 'Capital de Giro', cooperadoName: 'Mercearia do Bairro', cooperadoId: 4, value: 10000, stage: OpportunityStage.Lost, description: 'Cliente optou por oferta concorrente com taxas ligeiramente menores.', expected_close_date: '2024-07-15' },
    { id: 'op-10', title: 'Câmbio para Viagem', cooperadoName: 'Eduarda Lima', cooperadoId: 5, value: 8000, stage: OpportunityStage.Lost, description: 'Cliente adiou a viagem e não precisará mais do serviço de câmbio no momento.', expected_close_date: '2024-08-10' },
];

export const mockProdutos: Produto[] = [
    { id: 'prod-1', name: 'Crédito Pessoal', category: 'Crédito', description: 'Soluções de crédito com taxas competitivas para realizar seus sonhos.', price: 1.5, active: true },
    { id: 'prod-2', name: 'Investimento Moderado', category: 'Investimentos', description: 'Carteiras diversificadas para quem busca rentabilidade com segurança.', price: 0.8, active: true },
    { id: 'prod-3', name: 'Seguro Residencial', category: 'Seguros', description: 'Proteja seu lar contra imprevistos com nossas coberturas completas.', price: 49.90, active: true },
    { id: 'prod-4', name: 'Consórcio de Imóveis', category: 'Consórcios', description: 'Planeje a compra da sua casa própria sem juros e com parcelas que cabem no bolso.', price: 750.00, active: true },
    { id: 'prod-5', name: 'Previdência Privada', category: 'Investimentos', description: 'Garanta um futuro tranquilo com nossos planos de previdência personalizados.', price: 100.00, active: true },
    { id: 'prod-6', name: 'Cartão de Crédito Platinum', category: 'Serviços', description: 'Benefícios exclusivos, programa de pontos e vantagens para suas compras.', price: 0, active: true },
    { id: 'prod-7', name: 'Câmbio Internacional', category: 'Serviços', description: 'As melhores cotações para suas viagens internacionais.', price: 0.5, active: false },
];

export const mockTarefas: Tarefa[] = [
    { id: 'task-1', title: 'Ligar para Ana Silva sobre proposta', dueDate: '2024-08-15', priority: TaskPriority.High, completed: false, linkedTo: 'Oportunidade #op-1' },
    { id: 'task-2', title: 'Preparar documentação para Tech Solutions', dueDate: '2024-08-12', priority: TaskPriority.High, completed: false, linkedTo: 'Oportunidade #op-2' },
    { id: 'task-3', title: 'Enviar e-mail de follow-up para Bruno Costa', dueDate: '2024-08-10', priority: TaskPriority.Medium, completed: true, linkedTo: 'Cooperado #2' },
    { id: 'task-4', title: 'Agendar reunião de diagnóstico com Startup Inovadora', dueDate: '2024-08-18', priority: TaskPriority.Medium, completed: false, linkedTo: 'Oportunidade #op-5' },
    { id: 'task-5', title: 'Revisar apólice de seguro de Carla Dias', dueDate: '2024-08-20', priority: TaskPriority.Low, completed: false, linkedTo: 'Cooperado #3' },
];