export function formatDate(date) {
  return new Date(date).toLocaleDateString('pt-BR')
}

export function formatDistanceToNow(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return 'agora'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`
  return formatDate(date)
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}
