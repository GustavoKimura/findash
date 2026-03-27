# FinDash

![Status dos Testes](https://github.com/<seu-usuario>/<seu-repositorio>/actions/workflows/ci.yml/badge.svg)

FinDash é uma aplicação de dashboard financeiro desenvolvida com Angular, projetada para ajudar os usuários a gerenciar suas finanças pessoais de forma simples e intuitiva. A aplicação permite o registro de receitas e despesas, oferecendo uma visualização clara do saldo e da distribuição de gastos por categoria.

## ✨ Funcionalidades

-   **Dashboard Resumo:** Visualização rápida de receitas, despesas e saldo total.
-   **Gráfico de Despesas:** Gráfico do tipo "doughnut" que exibe a distribuição de despesas por categoria.
-   **Lista de Transações:** Histórico de transações recentes, ordenadas da mais nova para a mais antiga.
-   **Operações CRUD:** Adicione, edite e exclua transações através de um modal interativo.
-   **Persistência de Dados:** As transações são salvas localmente no navegador usando o `localStorage`.
-   **Design Responsivo:** Interface moderna e adaptável a diferentes tamanhos de tela, construída com Tailwind CSS.

## 🚀 Tecnologias Utilizadas

-   **Frontend:**
    -   [Angular](https://angular.io/) v21+
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [Chart.js](https://www.chartjs.org/) & [ng2-charts](https://www.npmjs.com/package/ng2-charts) para gráficos
-   **Testes:**
    -   [Vitest](https://vitest.dev/)
-   **CI/CD:**
    -   [GitHub Actions](https://github.com/features/actions)

## ⚙️ Instalação e Execução

Siga os passos abaixo para executar a aplicação localmente.

**Pré-requisitos:**
-   [Node.js](https://nodejs.org/) (versão 20.x ou superior)
-   NPM (versão 10.x ou superior)

**Passos:**

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd findash
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm start
    ```

A aplicação estará disponível em `http://localhost:4200/`.

## 🧪 Rodando os Testes

Este projeto utiliza Vitest para testes unitários. Para executar os testes e ver o relatório de cobertura, use os seguintes comandos:

-   **Executar os testes em modo watch:**
    ```bash
    npm test
    ```
-   **Executar os testes uma vez e gerar o relatório de cobertura no terminal:**
    ```bash
    npm run test:coverage
    ```

O relatório completo de cobertura também é gerado na pasta `coverage/` e pode ser visualizado abrindo o arquivo `index.html` em seu navegador.