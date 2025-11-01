# 📋 CHANGELOG - Apogeu CRM

## [v1.0] Mobile-First & Desktop Implementation - 2025-11-01

> Documentação completa da implementação mobile-first e desktop do Apogeu CRM  
> **Status:** ✅ Production Ready | **Breaking Changes:** N/A

---

## 📋 Índice

1. [Versão Atual](#versão-atual)
2. [Overview da Implementação](#overview-da-implementação)
3. [Arquitetura Completa](#arquitetura-completa)
4. [Componentes Mobile](#componentes-mobile)
5. [Componentes Desktop](#componentes-desktop)
6. [Layout & Navigation](#layout--navigation)
7. [Smart Features](#smart-features)
8. [Dark Mode](#dark-mode)
9. [Search System](#search-system)
10. [Bugs Resolvidos](#bugs-resolvidos)
11. [Fluxo de Dados](#fluxo-de-dados)
12. [Convenções](#convenções)
13. [Debug & Performance](#debug--performance)
14. [Histórico de Versões](#histórico-de-versões)

---

## Versão Atual

**v1.0 - Mobile-First & Desktop Implementation**  
**Data de Release:** 01 de Novembro de 2025  
**Tipo:** Major Release - Initial Production

### 🎯 Destaques desta versão

- ✅ Implementação completa mobile-first (breakpoint 768px)
- ✅ Layout desktop com sidebar colapsível
- ✅ Sistema de navegação dual (bottom tabs mobile + sidebar desktop)
- ✅ Dark mode integrado (next-themes)
- ✅ Smart positioning para modais e dropdowns
- ✅ Sistema de busca otimizado (estratégias diferentes mobile/desktop)
- ✅ 7 bugs críticos resolvidos
- ✅ Scrollbar customizado e comportamento otimizado

### 📦 Features Implementadas

#### Mobile Experience
- [x] Bottom navigation (4 tabs fixas)
- [x] Drawer lateral (menu)
- [x] Drawer perfil (dark mode toggle)
- [x] Kanban em abas (1 stage por vez)
- [x] Search em modal bottom sheet
- [x] Cards touch-optimized (44px+ tap targets)
- [x] Modal posicionamento inteligente
- [x] View/Edit modals separados
- [x] Empty states personalizados
- [x] Loading states

#### Desktop Experience
- [x] Sidebar colapsível com persistência
- [x] Kanban multi-column (6 estágios simultâneos)
- [x] Search no header com filtro real-time
- [x] Smart dropdown positioning
- [x] Menu contextual nos cards
- [x] Scrollbar customizado
- [x] Transições suaves entre estados

#### Core Features
- [x] Dark mode (next-themes)
- [x] Auth com Supabase
- [x] CRUD completo de leads
- [x] Sistema de estágios do funil
- [x] Debug mode condicional

---

## Overview da Implementação

Sistema CRM responsivo com experiências otimizadas para:
- **Mobile:** `<768px` - Navigation em bottom tabs, Kanban em abas
- **Desktop:** `≥768px` - Sidebar lateral, Kanban multi-column

**Tecnologias:**
- Next.js 15.5.6 (App Router)
- Tailwind CSS (darkMode: 'class')
- next-themes (dark mode)
- Supabase (auth + database)
- Lucide React (icons)

**Breakpoint:** `768px` (definido em `tailwind.config.js` e `useResponsive.js`)

---

## Arquitetura Completa

```
apogeu-crm/
├── app/
│   ├── layout.js                       # Root layout + ThemeProvider
│   ├── globals.css                     # Global styles + scrollbar
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.js                 # Login page
│   │   └── signup/
│   │       └── page.js                 # Signup page
│   └── dashboard/
│       └── page.js                     # Dashboard main page
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.js               # Desktop wrapper (Sidebar + content)
│   │   ├── Sidebar.js                  # Desktop sidebar navigation
│   │   ├── MobileLayout.js             # Mobile wrapper principal
│   │   ├── MobileSidebar.js            # Drawer menu lateral
│   │   ├── MobileProfileDrawer.js      # Drawer perfil + dark mode
│   │   └── BottomNavigation.js         # 4 tabs fixas mobile
│   │
│   ├── kanban/
│   │   ├── KanbanBoard.js              # Desktop multi-column
│   │   ├── KanbanBoardMobile.js        # Mobile tabs por estágio
│   │   ├── LeadCard.js                 # Card desktop + smart positioning
│   │   └── LeadCardMobile.js           # Card mobile touch-optimized
│   │
│   ├── dashboard/
│   │   ├── DashboardContent.js         # Orquestrador mobile/desktop
│   │   └── MobileDashboardCards.js     # Cards de métricas mobile
│   │
│   ├── leads/
│   │   ├── ViewLeadModal.js            # Modal visualização (read-only)
│   │   ├── EditLeadModal.js            # Modal edição (form completo)
│   │   └── CreateLeadModal.js          # Modal criação de lead
│   │
│   └── ThemeSettings.js                # Toggle dark mode (next-themes)
│
├── hooks/
│   └── useResponsive.js                # Detecta mobile/desktop
│
├── lib/
│   ├── auth/
│   │   └── useAuth.js                  # Auth hook (Supabase)
│   ├── supabase/
│   │   └── client.js                   # Supabase client
│   └── debug.js                        # Debug utility (logs condicionais)
│
└── docs/                               # 📄 Esta documentação
    └── README.md
```

---

## Componentes Mobile

### 1. `useResponsive.js`
Hook que detecta breakpoint e retorna `isMobile` boolean.

```javascript
const { isMobile } = useResponsive()
// true se window.innerWidth < 768px
```

**Implementação:**
```javascript
const [isMobile, setIsMobile] = useState(false)

useEffect(() => {
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768)
  }
  checkMobile()
  window.addEventListener('resize', checkMobile)
  return () => window.removeEventListener('resize', checkMobile)
}, [])
```

**Uso no código:**
```javascript
// DashboardContent.js
{isMobile ? (
  <MobileLayout>
    <KanbanBoardMobile />
  </MobileLayout>
) : (
  <DesktopLayout>
    <KanbanBoard />
  </DesktopLayout>
)}
```

---

### 2. `MobileLayout.js`
Wrapper principal que estrutura:
- Header com botões menu/perfil
- Área de conteúdo (`children`)
- `BottomNavigation` fixa

**Props:**
- `children`: Conteúdo da página (ex: KanbanBoardMobile)

**Estrutura:**
```jsx
<div className="flex flex-col h-screen">
  {/* Header */}
  <header>
    <button onClick={() => setSidebarOpen(true)}>Menu</button>
    <button onClick={() => setProfileOpen(true)}>Profile</button>
  </header>

  {/* Content */}
  <main className="flex-1 overflow-y-auto">
    {children}
  </main>

  {/* Bottom Navigation */}
  <BottomNavigation />

  {/* Drawers */}
  <MobileSidebar isOpen={sidebarOpen} onClose={...} />
  <MobileProfileDrawer isOpen={profileOpen} onClose={...} />
</div>
```

---

### 3. `BottomNavigation.js`
4 tabs fixas no bottom:
- **Dashboard** (Home icon)
- **Leads** (Users icon)
- **Tasks** (CheckSquare icon)
- **Mais** (Menu icon → abre MobileSidebar)

**Navegação:** `useRouter()` + `pathname` para highlight da tab ativa

**Hierarquia Z-index:**
- BottomNavigation: `z-40`
- Altura: `~70px`
- Position: `sticky bottom-0`

---

### 4. `MobileSidebar.js`
Drawer lateral com:
- Menu de navegação
- Link para Configurações
- Botão Logout

**Estado:** `isOpen` controlado via prop do `MobileLayout`

**Animação:** Slide-in from left com backdrop blur

---

### 5. `MobileProfileDrawer.js`
Drawer de perfil com:
- Avatar + nome/email do usuário
- **Toggle Dark/Light mode** (`next-themes`)
- Botão Sair

**Dark Mode Integration:**
```javascript
import { useTheme } from 'next-themes'
const { theme, setTheme } = useTheme()

<button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  {theme === 'light' ? <Moon /> : <Sun />}
</button>
```

**Fix aplicado:** Removido `max-h-96 overflow-y-auto` para evitar scroll desnecessário

---

### 6. `KanbanBoardMobile.js`
Kanban em abas horizontais (1 stage por vez):
- Search em modal bottom sheet
- Tabs de estágios com emoji + nome
- Lista vertical de cards
- Empty state ("Nenhum lead nessa etapa")

**Props:**
- `leads`: Array de leads
- `stages`: Array de estágios
- `onUpdateLead`: Callback para mover lead

**Estágios:**
```javascript
const stages = [
  { key: 'lead', emoji: '🔥', fullName: 'Lead' },
  { key: 'qualified', emoji: '✓', fullName: 'Qualificado' },
  { key: 'diagnostic', emoji: '🔍', fullName: 'Diagnóstico' },
  { key: 'proposal', emoji: '📋', fullName: 'Proposta' },
  { key: 'negotiation', emoji: '💬', fullName: 'Negociação' },
  { key: 'closed', emoji: '🤝', fullName: 'Fechado' },
]
```

---

### 7. `LeadCardMobile.js`
Card otimizado para touch:
- Avatar com iniciais (gradiente)
- Nome + empresa + valor
- Tags de categorias
- Botões: Ver, Editar, Mover
- Menu "Mover para" com **posicionamento inteligente**

**Smart Positioning:** Detecta se está no fim da tela e abre menu para cima

---

## Componentes Desktop

### 1. `MainLayout.js`
Wrapper desktop que gerencia:
- Estado `sidebarOpen` (persistido em localStorage)
- Renderiza Sidebar + conteúdo
- Margin dinâmico baseado no estado da sidebar

**Props:**
- `user` (object) — Dados do usuário
- `children` (ReactNode) — Conteúdo da página

**Responsabilidades:**
- Gerenciar estado `sidebarOpen`
- Persistir em localStorage (`'sidebarOpen'`)
- Evitar hydration mismatch com `mounted` flag
- Aplicar margin no conteúdo

**Uso:**
```javascript
<MainLayout user={user}>
  <PageContent />
</MainLayout>
```

---

### 2. `Sidebar.js`
Navegação lateral colapsível com:

#### SidebarHeader
- Logo + botão toggle (abrir/fechar)
- Animação fade text quando colapsada

#### SidebarNav
- Menu: Dashboard, Leads, Relatórios
- Responde ao estado `sidebarOpen`

#### SidebarArchived
- Seção leads arquivados (expansível)
- Chevron animado

#### SidebarFooter
- ThemeSettings (dark mode toggle)
- Botão configurações
- Perfil usuário (avatar + nome)
- Botão logout com modal de confirmação

**Props:**
- `sidebarOpen` (boolean)
- `setSidebarOpen` (function)
- `user` (object)

**Estado Persistido:**
```javascript
// localStorage key: 'sidebarOpen'
const saved = localStorage.getItem('sidebarOpen')
const initialState = saved !== null ? JSON.parse(saved) : true
```

**Responsividade:**
- Sidebar fechada: `ml-20` (80px)
- Sidebar aberta: `ml-64` (256px)
- Transição: `transition-[margin-left] duration-300`

---

### 3. `KanbanBoard.js`
Kanban multi-column para desktop:
- 6 colunas visíveis simultaneamente
- Altura fixa: `400px` com scroll vertical
- Filtra colunas vazias durante busca
- Transições suaves (fade out) ao ocultar colunas

**Scroll Behavior:**
```javascript
<div className="h-[400px] overflow-y-auto transition-opacity duration-200">
  {/* Cards */}
</div>
```

**Coluna "Perdido":**
- Nunca aparece no layout normal
- Aparece apenas na busca (se houver resultados)

---

### 4. `LeadCard.js`
Card desktop com:
- Avatar + dados do lead
- Menu contextual (Ver, Editar, Mover, Deletar)
- **Smart Positioning** para dropdown "Mover estágio"

**Posicionamento inteligente:** Ver seção [Smart Features](#smart-features)

---

## Layout & Navigation

### Estado Compartilhado

**Desktop:**
```javascript
// MainLayout.js
const [sidebarOpen, setSidebarOpen] = useState(true)

useEffect(() => {
  const saved = localStorage.getItem('sidebarOpen')
  if (saved !== null) setSidebarOpen(JSON.parse(saved))
}, [])

useEffect(() => {
  localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen))
}, [sidebarOpen])
```

**Mobile:**
```javascript
// MobileLayout.js
const [sidebarOpen, setSidebarOpen] = useState(false)
const [profileOpen, setProfileOpen] = useState(false)
// Não persiste - sempre fecha ao recarregar
```

---

### Navegação Ativa

**Desktop:**
```javascript
// Sidebar.js usa next/link com classe condicional
const isActive = pathname === '/dashboard'
className={isActive ? 'bg-blue-50 text-blue-600' : ''}
```

**Mobile:**
```javascript
// BottomNavigation.js
const pathname = usePathname()
const isActive = (path) => pathname === path
```

---

### Semântica HTML

```html
<!-- Desktop -->
<aside role="navigation">
  <Sidebar />
</aside>
<main role="main">
  {children}
</main>

<!-- Mobile -->
<header role="banner">
  <nav aria-label="Primary navigation">
</header>
<main role="main">
  {children}
</main>
<nav role="navigation" aria-label="Bottom navigation">
  <BottomNavigation />
</nav>
```

---

## Smart Features

### 1. Stage Smart Modal Positioning

Sistema de posicionamento inteligente para dropdown "Mover estágio" no Kanban.

**Problema:** Menu cortado pelo `overflow-y-auto` da coluna quando card está no final

**Solução:** `position: fixed` + cálculos de viewport

#### Arquitetura

```javascript
const [showStatusMenu, setShowStatusMenu] = useState(false)
const [menuPosition, setMenuPosition] = useState({ 
  top: 0, 
  left: 0, 
  direction: 'down' 
})
const buttonRef = useRef(null)
```

#### Função Core

```javascript
const calculateFixedPosition = () => {
  if (!buttonRef.current) return { top: 0, left: 0, direction: 'down' }

  const buttonRect = buttonRef.current.getBoundingClientRect()
  const menuHeight = 220           // ~36px × 6 items + padding
  const threshold = 300            // espaço mínimo necessário
  const bottomSpace = window.innerHeight - buttonRect.bottom

  const isTopDirection = bottomSpace < threshold

  return {
    top: isTopDirection 
      ? buttonRect.top - menuHeight - 8    // 8px margin
      : buttonRect.bottom + 8,
    left: buttonRect.left,
    direction: isTopDirection ? 'up' : 'down',
  }
}
```

#### Renderização

```jsx
{showStatusMenu && (
  <div
    className={`fixed bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 w-48 ${
      menuPosition.direction === 'up'
        ? 'animate-in fade-in slide-in-from-bottom-2 duration-200'
        : 'animate-in fade-in slide-in-from-top-2 duration-200'
    }`}
    style={{
      top: `${menuPosition.top}px`,
      left: `${menuPosition.left}px`,
    }}
  >
    {/* Options */}
  </div>
)}
```

#### Comportamento por Cenário

| Cenário | Espaço abaixo | Direção | Animação |
|---------|--------------|---------|----------|
| Card no topo | Abundante (>300px) | ⬇️ DOWN | slide-in-from-top |
| Card no meio | Suficiente (~400px) | ⬇️ DOWN | slide-in-from-top |
| Card no fim | Insuficiente (<300px) | ⬆️ UP | slide-in-from-bottom |

#### Customização

```javascript
// Ajustar threshold
const threshold = 350  // mais conservador

// Aumentar espaço entre menu e botão
const margin = 12      // foi 8

// Menu maior (mais items)
const menuHeight = 280
```

---

### 2. Scrollbar Customizado

**Desktop:** Scrollbar sempre visível quando há overflow  
**Mobile:** Scrollbar nativa (aparece apenas durante scroll)

```css
/* app/globals.css */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded-full;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}
```

---

### 3. Modal View vs Edit

| Componente | Finalidade | Ações |
|------------|------------|-------|
| **ViewLeadModal** | Visualização read-only | Editar, Fechar |
| **EditLeadModal** | Edição completa | Salvar, Deletar, Cancelar |

**Fluxo:**
```
Click no Card → ViewLeadModal
  ↓ (botão Editar)
EditLeadModal → Salvar/Deletar
```

**Desktop:** 2 modais separados  
**Mobile:** 1 modal com prop `mode="view|edit"` (opcional)

---

## Dark Mode

**Biblioteca:** `next-themes`  
**Config:** `tailwind.config.js` → `darkMode: 'class'`

### Implementação

```javascript
// app/layout.js
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

### Uso nos Componentes

```javascript
// Desktop: Sidebar.js → ThemeSettings.js
// Mobile: MobileProfileDrawer.js

import { useTheme } from 'next-themes'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      {theme === 'light' ? <Moon /> : <Sun />}
    </button>
  )
}
```

### Classes Tailwind

```jsx
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  {/* Conteúdo */}
</div>
```

**Classes aplicadas automaticamente via `class` no `<html>`:**
- `class="light"` → modo claro
- `class="dark"` → modo escuro

---

## Search System

### Desktop

**Localização:** Input no header do `DesktopLayout`

**Comportamento:**
- Filtra leads em tempo real
- Oculta colunas Kanban vazias
- Fade out suave nas colunas ocultas
- Mostra mensagem centralizada se nenhum resultado

**Implementação:**
```javascript
// DesktopLayout.js
const [searchTerm, setSearchTerm] = useState('')

// DashboardContent.js passa props
<DesktopLayout 
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
/>

// KanbanBoard.js filtra
const filteredLeads = leads.filter(lead =>
  lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  lead.company.toLowerCase().includes(searchTerm.toLowerCase())
)
```

**Coluna "Perdido":**
- Nunca aparece normalmente
- Aparece na busca apenas se houver resultados

---

### Mobile

**Localização:** Modal bottom sheet no `KanbanBoardMobile`

**Comportamento:**
- Abre em modal fullscreen
- Lista de resultados clicável
- Abre `ViewLeadModal` ao selecionar
- Fecha automaticamente ao clicar em resultado

**Implementação:**
```javascript
// KanbanBoardMobile.js
const [showSearchModal, setShowSearchModal] = useState(false)
const [searchTerm, setSearchTerm] = useState('')

const searchResults = Object.values(leads)
  .flat()
  .filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase())
  )
```

---

## Bugs Resolvidos

### 1. Desktop search quebrou após mobile update

**Problema:** `setSearchTerm is not a function`  
**Causa:** Props removidas do `DesktopLayout` após refactor mobile  
**Solução:**

```javascript
// DashboardContent.js
<DesktopLayout 
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
/>
```

---

### 2. Modal "Mover etapa" aparecendo cortado

**Problema:** Modal abaixo da viewport quando card no fim da lista  
**Causa:** `top` fixo sem considerar posição do card  
**Solução:** Smart positioning (ver [Smart Features](#smart-features))

```javascript
const handleShowMoveModal = (e) => {
  const buttonRect = e.currentTarget.getBoundingClientRect()
  const spaceBelow = window.innerHeight - buttonRect.bottom
  
  setMoveModalPosition(
    spaceBelow < 200 ? 'top' : 'bottom'
  )
}
```

---

### 3. Scroll dentro de modal pequeno

**Problema:** Modal "Mover etapa" com scroll interno desnecessário  
**Causa:** `max-h-48 overflow-y-auto` em lista curta  
**Solução:**

```javascript
// Antes
<div className="max-h-48 overflow-y-auto">

// Depois
<div className="max-h-96">  // ou remover constraint
```

---

### 4. Click no card não abria modal

**Problema:** `onViewLead` não conectado  
**Causa:** Prop drilling quebrado após refactor  
**Solução:**

```javascript
// KanbanBoard.js
<LeadCard
  lead={lead}
  onView={() => handleViewLead(lead)}
  onEdit={() => handleEditLead(lead)}
/>
```

---

### 5. Scrollbar visibility e comportamento

**Problema:** Scrollbar sempre visível ou scroll não funcionando  
**Causa:** Conflito `overflow-hidden` parent vs `overflow-y-auto` child  
**Solução:** Ver [Scrollbar Customizado](#2-scrollbar-customizado)

**Desktop:**
```css
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-thumb { @apply bg-gray-400 rounded-full; }
```

**Kanban:**
```javascript
<div className="h-[400px] overflow-y-auto transition-opacity duration-200">
```

---

### 6. Scroll travado em MobileLayout

**Problema:** Página não rola verticalmente em mobile  
**Causa:** `overflow-hidden` no `<main>`  
**Solução:**

```javascript
// MobileLayout.js - Antes
<main className="flex-1 overflow-hidden">

// MobileLayout.js - Depois
<main className="flex-1 overflow-y-auto">
```

---

### 7. MobileProfileDrawer com scroll desnecessário

**Problema:** Drawer com scroll interno sem necessidade  
**Causa:** `max-h-96 overflow-y-auto` forçando scroll  
**Solução:**

```javascript
// Antes
<div className="fixed bottom-0 ... max-h-96 overflow-y-auto">

// Depois
<div className="fixed bottom-0 ...">  // altura dinâmica
```

---

## Fluxo de Dados

```
app/dashboard/page.js
  ↓
useAuth() → {user, loading}
  ↓
DashboardContent (detecta isMobile via useResponsive)
  ↓
  ├─ Mobile (isMobile === true)
  │   ├─ MobileLayout
  │   │   ├─ MobileSidebar
  │   │   ├─ MobileProfileDrawer
  │   │   │   └─ ThemeToggle (next-themes)
  │   │   └─ BottomNavigation
  │   │       └─ useRouter() + pathname
  │   │
  │   └─ KanbanBoardMobile
  │       ├─ Search Modal (bottom sheet)
  │       ├─ Stage Tabs
  │       └─ LeadCardMobile
  │           ├─ ViewLeadModal
  │           └─ EditLeadModal
  │
  └─ Desktop (isMobile === false)
      ├─ MainLayout
      │   └─ Sidebar
      │       ├─ ThemeSettings (next-themes)
      │       ├─ localStorage (sidebarOpen)
      │       └─ SignOutModal
      │
      ├─ DesktopLayout
      │   └─ Search Input (header)
      │
      └─ KanbanBoard (multi-column)
          └─ LeadCard
              ├─ Smart Positioning (calculateFixedPosition)
              ├─ ViewLeadModal
              └─ EditLeadModal
```

---

## Convenções

### Naming

- **Components:** PascalCase (`LeadCardMobile.js`, `MainLayout.js`)
- **Hooks:** prefixo `use` + camelCase (`useResponsive`, `useAuth`)
- **Props:** camelCase (`onUpdateLead`, `showModal`, `sidebarOpen`)
- **Boolean states:** prefixo `is/has/show` (`isMobile`, `showModal`, `hasError`)
- **Classes CSS:** Tailwind utility-first + BEM quando necessário

### File Structure

```
components/[feature]/ComponentName.js
hooks/useFeatureName.js
lib/[context]/utilityName.js
```

### Props Pattern

```javascript
// ✅ Good
<Component 
  isOpen={isOpen}
  onClose={handleClose}
  data={formattedData}
/>

// ❌ Bad
<Component 
  open={isOpen}
  close={handleClose}
  data={rawData}
/>
```

### State Management

**Local state:** `useState` para UI simples  
**Shared state:** Props drilling ou Context (quando necessário)  
**Persistence:** localStorage para preferências UI (sidebar, theme)  
**Server state:** Supabase real-time (leads, auth)

---

## Debug & Performance

### Debug Mode

```javascript
// lib/debug.js
const DEBUG_ENABLED = process.env.NODE_ENV === 'development' && true

export const debugLog = (context, message, data) => {
  if (!DEBUG_ENABLED) return
  console.log(`[${context}]`, message, data)
}
```

**Uso:**
```javascript
import { debugLog } from '@/lib/debug'

debugLog('KanbanBoard', 'Filtering leads', { searchTerm, count: filteredLeads.length })
```

---

### Performance

**Lazy Loading:**
```javascript
const EditLeadModal = lazy(() => import('@/components/leads/EditLeadModal'))
```

**Memoization:**
```javascript
const filteredLeads = useMemo(() => 
  leads.filter(lead => /* ... */), 
  [leads, searchTerm]
)

const handleClick = useCallback(() => {
  // handler
}, [deps])
```

**CSS Animations:**
```css
/* Hardware-accelerated */
transition: transform 0.3s ease, opacity 0.3s ease;
will-change: transform;

/* Tailwind */
className="transition-all duration-300 transform hover:scale-105"
```

**Tailwind JIT:**
- Apenas classes usadas são compiladas
- Purge automático em production

---

### Testing

**Responsividade:**
```bash
# Mobile
DevTools → Toggle Device Toolbar → iPhone 12 Pro (390x844)

# Tablet
iPad Air (820x1180)

# Desktop
Resize browser > 768px
```

**Dark Mode:**
```bash
# Toggle via UI
Desktop: Sidebar → Footer → Theme button
Mobile: Profile Drawer → Theme toggle

# System preference
OS Settings → Dark Mode
```

**Breakpoints:**
```javascript
// Testar transição mobile ↔ desktop
window.innerWidth = 767 // mobile
window.innerWidth = 768 // desktop
```

---

### Acessibilidade

- ✅ `role="navigation"`, `role="main"`, `role="banner"`
- ✅ `aria-label` descritivos em todos os botões
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ Contraste WCAG AA (4.5:1)
- ✅ Focus states bem definidos (`focus:ring-2`)
- ✅ Screen reader friendly (semantic HTML)

**Teste com keyboard:**
```
Tab       → Navegar entre elementos
Enter     → Ativar botões/links
Esc       → Fechar modais
Space     → Ativar checkboxes
```

---

## Compatibilidade

| Platform | Versão Mínima | Status |
|----------|--------------|--------|
| iOS Safari | 13+ | ✅ |
| Chrome Mobile | 90+ | ✅ |
| Android WebView | 90+ | ✅ |
| Chrome Desktop | últimas 2 | ✅ |
| Firefox Desktop | últimas 2 | ✅ |
| Safari Desktop | últimas 2 | ✅ |
| Edge Desktop | últimas 2 | ✅ |

---

## Dependências

```json
{
  "dependencies": {
    "next": "^15.5.6",
    "react": "^18.x",
    "react-dom": "^18.x",
    "next-themes": "^0.2.1",
    "lucide-react": "^0.263.1",
    "@supabase/supabase-js": "^2.x",
    "tailwindcss": "^3.x"
  }
}
```

---

## Próximos Passos

### Features Sugeridas

1. **Gestures:** Swipe horizontal para navegar entre stages (mobile)
2. **Pull-to-refresh:** Atualizar leads com gesto (mobile)
3. **Offline mode:** Cache com Service Worker
4. **Push notifications:** Notificar novos leads
5. **Atalhos:** Cmd+K para search global (desktop)
6. **Filtros avançados:** Por valor, tag, data, categoria
7. **Bulk actions:** Selecionar múltiplos leads
8. **Export:** CSV/Excel de leads filtrados
9. **Analytics:** Dashboard com métricas de conversão
10. **Collaboration:** Comentários e mentions em leads

### Melhorias Técnicas

- [ ] Context API para estado global (reduzir prop drilling)
- [ ] React Query para cache de server state
- [ ] E2E tests com Playwright
- [ ] Storybook para design system
- [ ] Sentry para error tracking
- [ ] Analytics com PostHog

---

## Referências

- [Apple HIG - Mobile](https://developer.apple.com/design/human-interface-guidelines/)
- [Material Design - Mobile](https://m3.material.io/)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [next-themes Docs](https://github.com/pacocoursey/next-themes)
- [Supabase Docs](https://supabase.com/docs)

---

## Histórico de Versões

### [v1.0] - 2025-11-01

#### 🎉 Initial Release - Mobile-First & Desktop Implementation

**Added**
- Mobile-first architecture com breakpoint em 768px
- Componente `useResponsive` hook para detecção de dispositivo
- `MobileLayout` wrapper com bottom navigation
- `BottomNavigation` com 4 tabs fixas
- `MobileSidebar` drawer lateral animado
- `MobileProfileDrawer` com dark mode toggle
- `KanbanBoardMobile` em abas por estágio
- `LeadCardMobile` touch-optimized
- Desktop `MainLayout` com sidebar colapsível
- `Sidebar` com persistência em localStorage
- `KanbanBoard` multi-column para desktop
- `LeadCard` com menu contextual
- Dark mode via next-themes
- Sistema de busca dual (desktop header + mobile modal)
- Smart positioning para dropdowns
- `ViewLeadModal` e `EditLeadModal` separados
- Scrollbar customizado (webkit)
- Debug utility condicional

**Fixed**
- [#1] Desktop search quebrado após mobile update (`setSearchTerm` prop)
- [#2] Modal "Mover etapa" cortado em cards no fim da lista
- [#3] Scroll desnecessário em modal pequeno
- [#4] Click em card não abrindo modal de visualização
- [#5] Conflito scrollbar visibility (overflow-hidden vs overflow-y-auto)
- [#6] Scroll travado em `MobileLayout`
- [#7] `MobileProfileDrawer` com scroll interno forçado

**Changed**
- Migração de layout monolítico para arquitetura responsiva modular
- Refactor de estado compartilhado (search, modals, sidebar)
- Otimização de hierarquia de overflow/scroll

**Performance**
- Lazy loading de modais
- useCallback para handlers
- useMemo para filtros complexos
- CSS animations hardware-accelerated
- Tailwind JIT (apenas classes usadas)

**Documentation**
- Arquitetura completa de arquivos
- Guia de implementação mobile/desktop
- Smart features documentation
- Troubleshooting guide
- Code conventions

---

### Roadmap v1.1 (Planejado)

**Features**
- [ ] Gestures: Swipe horizontal entre stages (mobile)
- [ ] Pull-to-refresh para atualizar leads
- [ ] Offline mode com Service Worker
- [ ] Push notifications
- [ ] Cmd+K search global (desktop)
- [ ] Filtros avançados (valor, tag, data)
- [ ] Bulk actions (seleção múltipla)
- [ ] Export CSV/Excel

**Technical Improvements**
- [ ] Context API para estado global
- [ ] React Query para server state
- [ ] E2E tests (Playwright)
- [ ] Storybook para design system
- [ ] Error tracking (Sentry)
- [ ] Analytics (PostHog)

---

**Desenvolvido por:** Feliphe Queiroz  
**Última atualização:** 01 Nov 2025  
**Próxima versão prevista:** v1.1 - Dez 2025