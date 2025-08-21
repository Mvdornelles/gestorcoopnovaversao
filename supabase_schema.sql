-- =================================================================
--    SCHEMA SQL (VERSÃO REVISADA) PARA O GESTORCOOP NO SUPABASE
-- =================================================================
-- Data da Revisão: 21 de Agosto de 2025
-- Este script combina as melhores práticas de ambas as versões
-- para criar um schema robusto, seguro e pronto para RLS.
-- =================================================================

-- -----------------------------------------------------------------
-- 1. TIPOS ENUM (ENUM TYPES)
-- -----------------------------------------------------------------
CREATE TYPE public.tier_cooperado AS ENUM ('Bronze', 'Prata', 'Ouro', 'Diamante');
CREATE TYPE public.estagio_oportunidade AS ENUM ('Prospecção', 'Qualificação', 'Diagnóstico', 'Proposta', 'Negociação', 'Ganho', 'Perdido');
CREATE TYPE public.prioridade_tarefa AS ENUM ('Baixa', 'Média', 'Alta');
CREATE TYPE public.tipo_interacao AS ENUM ('note', 'email', 'call', 'meeting', 'whatsapp', 'other');
CREATE TYPE public.tipo_remetente_chat AS ENUM ('user', 'ai');

-- -----------------------------------------------------------------
-- 2. TABELAS PRINCIPAIS E RELACIONAIS
-- -----------------------------------------------------------------

-- Tabela de Perfis para estender a `auth.users`
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'Gerente'
);

-- Tabela de Cooperados
CREATE TABLE public.cooperados (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    avatar_url TEXT,
    email TEXT UNIQUE,
    since DATE,
    tier public.tier_cooperado,
    value NUMERIC, -- Valor total em pipeline associado ao cooperado
    company_name TEXT,
    sector TEXT,
    annual_revenue NUMERIC,
    employee_count INT,
    notes TEXT,
    engagement_rate NUMERIC(5, 2),
    conversion_rate NUMERIC(5, 2),
    CONSTRAINT engagement_rate_check CHECK (engagement_rate >= 0 AND engagement_rate <= 100),
    CONSTRAINT conversion_rate_check CHECK (conversion_rate >= 0 AND conversion_rate <= 100)
);

-- Tabela de Produtos
CREATE TABLE public.produtos (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    price NUMERIC,
    active BOOLEAN NOT NULL DEFAULT true
);

-- Tabela de Oportunidades
CREATE TABLE public.oportunidades (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cooperado_id BIGINT NOT NULL REFERENCES public.cooperados(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    value NUMERIC,
    stage public.estagio_oportunidade NOT NULL,
    description TEXT,
    expected_close_date DATE
);

-- Tabela de Interações
CREATE TABLE public.interacoes (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    cooperado_id BIGINT NOT NULL REFERENCES public.cooperados(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    type public.tipo_interacao NOT NULL,
    title TEXT NOT NULL,
    description TEXT
);

-- Tabela de Tarefas
CREATE TABLE public.tarefas (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    due_date DATE,
    priority public.prioridade_tarefa,
    completed BOOLEAN NOT NULL DEFAULT false,
    cooperado_id BIGINT REFERENCES public.cooperados(id) ON DELETE SET NULL,
    oportunidade_id BIGINT REFERENCES public.oportunidades(id) ON DELETE SET NULL,
    CONSTRAINT chk_tarefa_link_exclusive CHECK (num_nonnulls(cooperado_id, oportunidade_id) <= 1)
);

-- -----------------------------------------------------------------
-- 3. SCHEMA DO CHAT DE IA
-- -----------------------------------------------------------------

CREATE TABLE public.conversations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT
);

CREATE TABLE public.chat_messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL se for a IA
    sender_type public.tipo_remetente_chat NOT NULL,
    content TEXT NOT NULL
);

-- -----------------------------------------------------------------
-- 4. ATIVAÇÃO DO ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------
-- Ative o RLS para todas as tabelas para garantir a segurança dos dados.

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cooperados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.oportunidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tarefas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------
-- 5. POLÍTICAS DE ACESSO (EXEMPLOS)
-- -----------------------------------------------------------------
-- **Lembre-se de criar políticas para TODAS as tabelas.**

-- Política para a tabela de perfis (profiles)
CREATE POLICY "Usuários podem ver e editar seus próprios perfis"
ON public.profiles FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Política para a tabela de cooperados
CREATE POLICY "Usuários podem gerenciar seus próprios cooperados"
ON public.cooperados FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Política para a tabela de conversas do chat
CREATE POLICY "Usuários podem gerenciar suas próprias conversas"
ON public.conversations FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
