# Layout Components

Componentes de layout global da aplicação. Responsáveis pela estrutura base, navegação principal e estado compartilhado entre páginas.

## Estrutura

```
components/layout/
├── Sidebar.js          # Navegação lateral com collapsible
├── MainLayout.js       # Wrapper que combina Sidebar + conteúdo
└── README.md          # Esta documentação
```

## Componentes

### MainLayout

Wrapper principal que gerencia o layout com sidebar. Centraliza toda a lógica de estado e localStorage.

**Props:**
- `user` (object) — Dados do usuário logado (passado para Sidebar)
- `children` (ReactNode) — Conteúdo da página

**Responsabilidades:**
- Gerenciar estado `sidebarOpen`
- Persistir estado do sidebar em localStorage
- Renderizar Sidebar + conteúdo com margin dinâmico
- Evitar hydration mismatch com `mounted` flag

**Uso:**

```javascript
'use client'

import { useAuth } from '@/lib/auth/useAuth'
import MainLayout from '@/components/layout/MainLayout'
import PageContent from '@/components/PageContent'

export default function MyPage() {
  const { user, loading } = useAuth()

  if (loading) return <LoadingState />
  if (!user) return null

  return (
    <MainLayout user={user}>
      <PageContent />
    </MainLayout>
  )
}
```

### Sidebar

Barra de navegação lateral colapsível com tema claro/escuro, menu de usuário e logout.

**Props:**
- `sidebarOpen` (boolean) — Estado aberto/fechado
- `setSidebarOpen` (function) — Setter do estado
- `user` (object) — Dados do usuário (email, name)

**Componentes Internos:**

#### SidebarHeader
- Logo e botão toggle (abrir/fechar)
- Animação de fade text quando colapsada

#### SidebarNav
- Menu principal com links: Dashboard, Leads, Relatórios
- Responde ao estado `sidebarOpen`

#### SidebarArchived
- Seção de leads arquivados (expansível)
- Chevron rotaciona com estado

#### SidebarFooter
- Theme settings (integra ThemeSettings.js)
- Botão de configurações
- Perfil do usuário (avatar + nome)
- Botão logout com confirmação modal

#### SignOutModal
- Modal de confirmação antes de sair
- Lucide icons (LogOut)
- Padrão visual: ícone destacado + título + descrição + botões

**Uso Direto (raro):**

```javascript
import Sidebar from '@/components/layout/Sidebar'

export default function CustomLayout({ sidebarOpen, setSidebarOpen, user }) {
  return (
    <>
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        user={user} 
      />
      {/* seu conteúdo */}
    </>
  )
}
```

**Recomendado:** Use `MainLayout` em vez de chamar `Sidebar` diretamente.

## Padrões

### Estado do Sidebar

O estado `sidebarOpen` é persistido em localStorage com a chave `'sidebarOpen'`:

```javascript
// Ler do localStorage
const saved = localStorage.getItem('sidebarOpen')
const initialState = saved !== null ? JSON.parse(saved) : true

// Salvar quando muda
localStorage.setItem('sidebarOpen', JSON.stringify(newState))
```

**Por que:** Mantém a preferência do usuário entre sessões.

### Semântica HTML

- `<aside role="navigation">` em Sidebar
- `<main role="main">` em MainLayout
- `aria-label` em todos os botões interativos

### Responsividade

Breakpoints considerados no margin do conteúdo:
- Sidebar **fechada**: `ml-20` (80px de ícones)
- Sidebar **aberta**: `ml-64` (256px de texto completo)

Transição suave com `transition-[margin-left] duration-300`.

### Hidratação

Ambos os componentes usam `mounted` flag para evitar hydration mismatch:

```javascript
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null
```

## Integração com Outras Features

### Auth (useAuth hook)
- Sidebar consome `useAuth()` para acessar função `signOut()`
- MainLayout recebe `user` como prop

### Theme (next-themes)
- SidebarFooter renderiza `<ThemeSettings />`
- Sidebar responde a mudanças de tema via classes Tailwind `dark:`

### localStorage
- Estado do sidebar persistido automaticamente
- Restaurado ao montar MainLayout

## Exemplos de Uso em Páginas

### Dashboard
```javascript
'use client'

import { useAuth } from '@/lib/auth/useAuth'
import MainLayout from '@/components/layout/MainLayout'

export default function DashboardPage() {
  const { user, loading } = useAuth()

  if (loading) return <Loader />
  if (!user) return null

  return (
    <MainLayout user={user}>
      <div className="p-6">
        <h1>Dashboard Content</h1>
        {/* conteúdo da página */}
      </div>
    </MainLayout>
  )
}
```

### Leads (futura página)
```javascript
'use client'

import { useAuth } from '@/lib/auth/useAuth'
import MainLayout from '@/components/layout/MainLayout'
import LeadsTable from '@/components/leads/LeadsTable'

export default function LeadsPage() {
  const { user, loading } = useAuth()

  if (loading) return <Loader />
  if (!user) return null

  return (
    <MainLayout user={user}>
      <LeadsTable userId={user.id} />
    </MainLayout>
  )
}
```

## Performance

- Sidebar usa `useCallback` para handlers de logout
- MainLayout não re-renderiza children desnecessariamente
- Transições CSS são hardware-accelerated (`will-change-auto`)
- localStorage acesso minimizado (apenas no mount e quando muda)

## Acessibilidade

- ✅ `role="navigation"` e `role="main"`
- ✅ `aria-label` descritivos
- ✅ Keyboard navigation suportada (focus states)
- ✅ Contraste WCAG AA
- ✅ Modais com `z-index` adequado (100)

## Troubleshooting

### Sidebar não persiste estado entre reloads
**Causa:** Falta de `mounted` flag ou localStorage desabilitado.
**Solução:** Verificar se localStorage está ativado no navegador.

### Hydration mismatch warning
**Causa:** Sidebar renderizando estado desatualizado no SSR.
**Solução:** MainLayout espera por `mounted` antes de renderizar.

### Conteúdo sobrepõe sidebar
**Causa:** Margin não aplicado corretamente.
**Solução:** Verificar se MainLayout está wrappando todo o `children`.

## Roadmap

- [ ] Sidebar com rotas dinâmicas (`next/link` com pathname)
- [ ] Breadcrumb integrado
- [ ] Notificações no header
- [ ] Search global