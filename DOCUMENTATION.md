# Documentação da Aplicação CRM Cooperativa

**Data da Documentação:** 21 de Agosto de 2025

## 1. Introdução

Bem-vindo à documentação da aplicação de CRM (Customer Relationship Management) para cooperativas financeiras. O objetivo deste projeto é criar uma ferramenta moderna e intuitiva para que os gerentes de relacionamento possam gerenciar seus cooperados, acompanhar oportunidades de negócio, e ter uma visão 360º de suas interações.

### Foco Atual do Projeto

A aplicação foi integrada com um backend **Supabase**, substituindo os dados mockados por uma conexão real com o banco de dados. As principais funcionalidades, como gestão de cooperados, produtos, tarefas e oportunidades, agora utilizam dados ao vivo.

A autenticação é gerenciada pelo Supabase, com a aplicação operando como um **usuário de teste padrão** (`test@gestorcoop.com`) para fins de desenvolvimento.

### Tecnologias Utilizadas

- **React, TypeScript, Vite, Tailwind CSS**
- **Supabase:** Backend como serviço para banco de dados, autenticação e Edge Functions.
- **@supabase/supabase-js:** Biblioteca cliente para interagir com o Supabase.
- **Recharts:** Para a criação de gráficos e visualização de dados.
- **Lucide React:** Para iconografia.

## 2. Configuração do Ambiente

Para rodar o projeto localmente, siga os passos no `README.md`. A principal configuração é a criação de um arquivo `.env.local` na raiz do projeto com as credenciais do seu projeto Supabase.

## 3. Arquitetura do Backend (Supabase)

O backend é construído inteiramente na plataforma Supabase.

### 3.1. Banco de Dados

O schema do banco de dados PostgreSQL foi projetado para suportar as funcionalidades do CRM. As tabelas principais incluem `cooperados`, `oportunidades`, `produtos`, `tarefas`, e `interacoes`. O schema completo, incluindo tipos customizados e políticas de segurança (RLS), pode ser encontrado no arquivo `supabase_schema.sql`.

### 3.2. Autenticação

A aplicação utiliza o Supabase Auth. Para o ambiente de desenvolvimento atual, um usuário de teste é criado e logado programaticamente. A lógica para isso está em `contexts/AuthContext.tsx`.

### 3.3. API de Dados

Toda a comunicação com o banco de dados é feita através da biblioteca `supabase-js`. As funções de API que encapsulam as queries ao Supabase estão centralizadas em `services/api.ts`.

## 4. Próximos Passos: Implementação do Chat com IA

A etapa final para completar a aplicação é habilitar o chat com a IA "Sofia". Isso requer a implantação de uma **Supabase Edge Function** para se comunicar de forma segura com a API do Google Gemini.

Siga os passos abaixo quando tiver acesso a um terminal com a Supabase CLI.

### 4.1. Instale a Supabase CLI
Se ainda não o fez, instale a CLI globalmente:
```bash
npm install -g supabase
```

### 4.2. Vincule seu Projeto
Navegue até a raiz do projeto no seu terminal e execute:
```bash
supabase link --project-ref zutvkkxklsyopbbjipmg
```
Você precisará fazer login na sua conta Supabase.

### 4.3. Configure os Segredos (Secrets)
A Edge Function precisa de chaves de API para funcionar. Configure-as como segredos no seu projeto Supabase. **Substitua `SUA_CHAVE_API_GEMINI` pela sua chave real.**
```bash
# Chave da API do Google Gemini
supabase secrets set GEMINI_API_KEY=SUA_CHAVE_API_GEMINI

# URL e Chave Anon do seu projeto Supabase (para a função usar)
supabase secrets set SUPABASE_URL=https://zutvkkxklsyopbbjipmg.supabase.co
supabase secrets set SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1dHZra3hrbHN5b3BiYmppcG1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2ODk5NzMsImV4cCI6MjA3MTI2NTk3M30.PYSDRItC3s8irmA88PbRAXREAdxfQNVVTNV7fwDMYus
```

### 4.4. Implante a Função
O código da função já está no diretório `supabase/functions/send-gemini-message/`. Para implantá-la, execute:
```bash
supabase functions deploy send-gemini-message
```

### 4.5. Refatore o Componente de Chat
Após a implantação da função, o último passo é atualizar o componente `components/ai/ChatPanel.tsx` para chamar esta função em vez do serviço mockado. Isso envolverá:
1.  Criar uma nova função em `services/api.ts` para invocar a Edge Function.
2.  Modificar `ChatPanel.tsx` para usar esta nova função.
3.  Implementar o armazenamento do histórico de chat no banco de dados usando as funções de API já criadas (`getConversations`, `addChatMessage`, etc.).
4.  Remover o arquivo `services/geminiService.ts`.

Com esses passos, a aplicação estará 100% funcional.
