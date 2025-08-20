# Documentação da Aplicação CRM Cooperativa

**Data da Documentação:** 20 de Agosto de 2025

## 1. Introdução

Bem-vindo à documentação da aplicação de CRM (Customer Relationship Management) para cooperativas financeiras. O objetivo deste projeto é criar uma ferramenta moderna e intuitiva para que os gerentes de relacionamento possam gerenciar seus cooperados, acompanhar oportunidades de negócio, e ter uma visão 360º de suas interações.

### Foco Atual do Projeto

**Nota Importante:** No estágio atual, o desenvolvimento está **focado exclusivamente na construção da interface de usuário (UI)**. Todas as telas, componentes e interações estão sendo desenvolvidos com base em dados mockados. Nenhuma integração com backend, APIs ou banco de dados foi implementada até a data desta documentação.

### Tecnologias Utilizadas

A aplicação está sendo construída com um stack de tecnologias moderno, focado em performance e produtividade no desenvolvimento:

- **React:** Biblioteca para construção de interfaces de usuário.
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
- **Vite:** Ferramenta de build para desenvolvimento frontend.
- **Tailwind CSS:** Framework CSS utility-first para estilização.
- **React Router:** Para gerenciamento de rotas na aplicação.
- **Recharts:** Para a criação de gráficos e visualização de dados.
- **Lucide React:** Para iconografia.

## 2. Estrutura do Projeto

O projeto está organizado na seguinte estrutura de pastas, visando a modularidade e a clareza:

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── cooperados/
│   │   ├── layout/
│   │   └── ui/
│   ├── constants/
│   ├── data/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   └── types/
├── .eslintrc.cjs
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tsconfig.json
└── vite.config.ts
```

- **`src/components`**: Contém todos os componentes React reutilizáveis.
  - **`components/cooperados`**: Componentes específicos para a funcionalidade de cooperados (ex: `CooperadoDetail`, `Timeline`).
  - **`components/layout`**: Componentes estruturais da aplicação, como `Header` e `Sidebar`.
  - **`components/ui`**: Componentes de UI genéricos e reutilizáveis, como `Button`, `Card`, `Modal`.
- **`src/constants`**: Arquivos com valores constantes usados em toda a aplicação (ex: chaves de API, configurações).
- **`src/data`**: Contém os dados mockados (`mockData.ts`) que alimentam a UI no estado atual do projeto.
- **`src/pages`**: Cada arquivo representa uma página da aplicação (ex: `DashboardPage`, `CooperadosPage`).
- **`src/services`**: Módulos responsáveis por se comunicar com serviços externos. No futuro, abrigará as chamadas de API.
- **`src/types`**: Contém as definições de tipos TypeScript (`types.ts`) usadas em todo o projeto, garantindo a consistência dos dados.
- **`App.tsx`**: O componente raiz da aplicação, onde as rotas são definidas.
- **`index.tsx`**: O ponto de entrada da aplicação React.

## 3. Páginas da Aplicação

A aplicação é composta pelas seguintes páginas, que podem ser encontradas no diretório `src/pages`:

- **`DashboardPage.tsx`**: A página inicial após o login. Apresenta uma visão geral com os principais KPIs (Indicadores Chave de Performance), como total de cooperados, valor em pipeline, taxa de churn e alertas da IA. Também exibe gráficos sobre o pipeline de negócios e a tendência de churn, além de insights e uma lista de cooperados recentes.

- **`CooperadosPage.tsx`**: Exibe uma lista de todos os cooperados. Permite a busca, filtragem e visualização de informações detalhadas de cada cooperado, incluindo seu perfil, histórico de interações e produtos contratados.

- **`OportunidadesPage.tsx`**: Apresenta um pipeline visual (Kanban) das oportunidades de negócio, organizadas por estágio (Prospecção, Qualificação, Proposta, etc.). Permite que o gerente de relacionamento acompanhe e gerencie cada oportunidade de forma eficiente.

- **`ProdutosPage.tsx`**: Lista todos os produtos e serviços oferecidos pela cooperativa. Funciona como um catálogo que pode ser consultado pelo gerente.

- **`TarefasPage.tsx`**: Uma lista de tarefas (to-do list) para o gerente de relacionamento. As tarefas podem ser vinculadas a cooperados ou oportunidades específicas.

- **`ConsultorIAPage.tsx`**: Uma interface de chat onde o gerente pode interagir com um "Consultor de IA". O objetivo é que a IA forneça insights, sugestões e responda a perguntas com base nos dados dos cooperados (funcionalidade futura).

- **`RelatoriosPage.tsx`**: Área dedicada à geração de relatórios customizáveis sobre vendas, desempenho, metas, etc (página em desenvolvimento).

## 4. Componentes Principais

A aplicação é construída sobre um sistema de componentes reutilizáveis para garantir consistência visual e agilidade no desenvolvimento.

### Componentes de Layout (`src/components/layout`)

- **`Header.tsx`**: O cabeçalho da aplicação. Contém o botão para abrir/fechar a `Sidebar` em telas menores, uma barra de busca global e o perfil do usuário logado.
- **`Sidebar.tsx`**: A barra de navegação lateral. Apresenta os links para todas as páginas principais da aplicação.

### Componentes de UI (`src/components/ui`)

Estes são componentes genéricos que formam a base da interface.

- **`Card.tsx`**: Um container flexível usado para agrupar conteúdo relacionado, como os KPIs no Dashboard ou informações de um cooperado.
- **`Button.tsx`**: Componente de botão com variantes de estilo (primário, secundário, destrutivo, etc.).
- **`Modal.tsx`**: Componente para exibir conteúdo em uma camada sobre a página, ideal para formulários de edição ou confirmações.
- **`Badge.tsx`**: Usado para destacar informações, como o `tier` de um cooperado (Ouro, Prata, Bronze) ou o status de uma oportunidade.

## 5. Estruturas de Dados e Mock Data

A consistência dos dados em toda a aplicação é garantida pelo uso de tipos definidos no arquivo `src/types.ts`.

### Principais Tipos

- **`Cooperado`**: Representa o perfil de um membro da cooperativa. Inclui informações como nome, `tier` (nível), valor investido, dados da empresa, e um `timeline` de interações.
- **`Oportunidade`**: Descreve uma oportunidade de negócio, contendo título, valor, cooperado associado e o estágio atual no pipeline de vendas.
- **`Produto`**: Define um produto ou serviço oferecido, com nome, categoria e descrição.
- **`Tarefa`**: Representa uma tarefa a ser realizada pelo gerente, com título, data de vencimento, prioridade e status.
- **`Interaction`**: Modela um ponto de contato com o cooperado (reunião, e-mail, ligação, etc.), formando o histórico do `timeline`.

### Mock Data

Como mencionado, a aplicação atualmente opera com dados estáticos para simular o ambiente de produção. O arquivo `src/data/mockData.ts` é responsável por exportar arrays de objetos que seguem os tipos definidos acima, permitindo o desenvolvimento e teste da UI de forma isolada.
