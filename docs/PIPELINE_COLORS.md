# Padrão de Cores para Estágios do Pipeline

Este documento descreve o padrão de cores utilizado para os estágios do funil de vendas no Kanban, garantindo consistência visual em modos claro e escuro.

## Lógica do Padrão

O padrão utiliza classes utilitárias do Tailwind CSS, combinando uma cor base com diferentes tonalidades para fundo e borda, e adaptando-se automaticamente ao tema (claro/escuro).

-   **Fundo (Modo Claro):** `bg-{cor}-50` (tonalidade muito clara)
-   **Fundo (Modo Escuro):** `dark:bg-{cor}-950` (tonalidade muito escura)
-   **Borda (Modo Claro):** `border-{cor}-300` (tonalidade clara)
-   **Borda (Modo Escuro):** `dark:border-{cor}-800` (tonalidade escura)

Onde `{cor}` é o nome da cor base do Tailwind (ex: `blue`, `cyan`, `purple`, `orange`, `yellow`, `green`).

## Estágios Atuais e Suas Cores

Abaixo estão os estágios atualmente definidos e as classes de cores aplicadas:

| Estágio (`key`) | Título             | Ícone | Classes de Fundo (`color`)           | Classes de Borda (`borderColor`)           |
| :-------------- | :----------------- | :---- | :----------------------------------- | :----------------------------------------- |
| `lead`          | 📥 Lead Gerado     | 📥    | `bg-blue-50 dark:bg-blue-950`        | `border-blue-300 dark:border-blue-800`     |
| `qualified`     | ✓ Qualificado      | ✓     | `bg-cyan-50 dark:bg-cyan-950`        | `border-cyan-300 dark:border-cyan-800`     |
| `diagnostic`    | 🔍 Diagnóstico     | 🔍    | `bg-purple-50 dark:bg-purple-950`    | `border-purple-300 dark:border-purple-800` |
| `proposal`      | 📋 Proposta        | 📋    | `bg-orange-50 dark:bg-orange-950`    | `border-orange-300 dark:border-orange-800` |
| `negotiation`   | 💬 Negociação      | 💬    | `bg-yellow-50 dark:bg-yellow-950`    | `border-yellow-300 dark:border-yellow-800` |
| `closed`        | 🤝 Fechado         | 🤝    | `bg-green-50 dark:bg-green-950`      | `border-green-300 dark:border-green-800`   |

## Ao Adicionar Novos Estágios

Ao criar novos estágios customizados, siga este padrão para escolher as classes de cores, utilizando uma cor base do Tailwind que ainda não tenha sido usada ou que se alinhe com a semântica do novo estágio.
