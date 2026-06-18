# E-study

E-study é um frontend React desenvolvido com Vite para uma aplicação de produtividade estudantil. O projeto integra autenticação, gerenciamento de tarefas, cronograma, Pomodoro e ajustes de usuário em uma interface moderna e responsiva.
## Site hospedado em:
```
https://e-study-frontend.netlify.app
```
## Funcionalidades

- Autenticação de usuário com telas de login e cadastro
- Recuperação de senha através de formulário de reset
- Página principal com visão geral do estudo
- Gerenciamento de tarefas:
  - criação, edição e visualização de tarefas
  - seção de tarefas concluídas
- Cronograma semanal para organizar atividades
- Temporizador Pomodoro para foco e pausas
- Configurações do usuário e menu de conta
- Página "Sobre" com informações do projeto

## Estrutura de rotas

- `/` - Login
- `/register` - Cadastro
- `/home` - Página inicial do usuário autenticado
- `/tasks` - Lista de tarefas
- `/tasks/completed` - Tarefas concluídas
- `/schedule` - Cronograma semanal
- `/pomodoro` - Temporizador Pomodoro
- `/settings` - Configurações do usuário
- `/about` - Sobre o projeto
- `/account` - Gestão de conta

## Tecnologias

- React 19
- Vite
- React Router DOM
- ESLint
- SweetAlert2

## Como executar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

3. Abra a aplicação no navegador usando a URL exibida no terminal.

## Scripts úteis

- `npm run dev` - inicia o servidor de desenvolvimento
- `npm run build` - gera a versão de produção
- `npm run preview` - pré-visualiza a build de produção
- `npm run lint` - executa o ESLint no projeto

## Estrutura de pastas

- `src/` - código-fonte principal
  - `components/` - componentes reutilizáveis
  - `layouts/` - layout principal da aplicação
  - `pages/` - páginas principais da interface
  - `styles/` - arquivos CSS específicos
  - `assets/` - ativos estáticos

