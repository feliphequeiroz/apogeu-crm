/**
 * Debug Utility
 * Centraliza logs de debug com flag condicional
 */

const DEBUG_ENABLED = process.env.NODE_ENV === 'development' && false // ← OFFx

export const debug = {
  log: (...args) => {
    if (DEBUG_ENABLED) console.log(...args)
  },
  
  warn: (...args) => {
    if (DEBUG_ENABLED) console.warn(...args)
  },
  
  error: (...args) => {
    console.error(...args)
  },
  
  group: (label) => {
    if (DEBUG_ENABLED) console.group(label)
  },
  
  groupEnd: () => {
    if (DEBUG_ENABLED) console.groupEnd()
  }
}