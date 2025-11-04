
export const pipelineColors = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-300 dark:border-blue-800',
    hex: '#3b82f6',
  },
  cyan: {
    bg: 'bg-cyan-50 dark:bg-cyan-950',
    border: 'border-cyan-300 dark:border-cyan-800',
    hex: '#06b6d4',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    border: 'border-purple-300 dark:border-purple-800',
    hex: '#8b5cf6',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    border: 'border-orange-300 dark:border-orange-800',
    hex: '#f97316',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-300 dark:border-yellow-800',
    hex: '#eab308',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-300 dark:border-green-800',
    hex: '#22c55e',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-300 dark:border-red-800',
    hex: '#ef4444',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-950',
    border: 'border-pink-300 dark:border-pink-800',
    hex: '#ec4899',
  },
};

export const defaultPipelineStages = [
  {
    key: 'lead',
    name: 'Lead Gerado',
    icon: '📥',
    color: 'blue',
    position: 0,
    is_default: true,
  },
  {
    key: 'qualified',
    name: 'Qualificado',
    icon: '✓',
    color: 'cyan',
    position: 1,
    is_default: true,
  },
  {
    key: 'diagnostic',
    name: 'Diagnóstico',
    icon: '🔍',
    color: 'purple',
    position: 2,
    is_default: true,
  },
  {
    key: 'proposal',
    name: 'Proposta',
    icon: '📋',
    color: 'orange',
    position: 3,
    is_default: true,
  },
  {
    key: 'negotiation',
    name: 'Negociação',
    icon: '💬',
    color: 'yellow',
    position: 4,
    is_default: true,
  },
  {
    key: 'closed',
    name: 'Fechado',
    icon: '🤝',
    color: 'green',
    position: 5,
    is_default: true,
  },
];
