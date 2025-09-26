/**
 * Centralized Currency Configuration for JV-Flow
 * 
 * This file controls all currency symbols, formatting, and localization
 * throughout the entire application including test data, forms, and displays.
 */

export interface CurrencyConfig {
  code: string
  symbol: string
  name: string
  locale: string
  position: 'before' | 'after'
  decimalPlaces: number
  thousandsSeparator: string
  decimalSeparator: string
}

// Primary currency configuration - Change this to control the entire app
export const PRIMARY_CURRENCY: CurrencyConfig = {
  code: 'PKR',
  symbol: '₨',  // Pakistani Rupee symbol
  name: 'Pakistani Rupee',
  locale: 'en-PK',
  position: 'before',
  decimalPlaces: 0, // Pakistani currency typically doesn't show decimals in UI
  thousandsSeparator: ',',
  decimalSeparator: '.'
}

// Alternative currency configurations (for easy switching)
export const CURRENCY_OPTIONS: Record<string, CurrencyConfig> = {
  PKR: {
    code: 'PKR',
    symbol: '₨',
    name: 'Pakistani Rupee',
    locale: 'en-PK',
    position: 'before',
    decimalPlaces: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    position: 'before',
    decimalPlaces: 0,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  AED: {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    locale: 'ar-AE',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    position: 'before',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  }
}

/**
 * Get the current currency configuration
 */
export function getCurrentCurrency(): CurrencyConfig {
  // In the future, this could be loaded from user preferences or organization settings
  return PRIMARY_CURRENCY
}

/**
 * Format a number as currency using the current currency configuration
 */
export function formatCurrency(
  amount: number, 
  options?: {
    showSymbol?: boolean
    showDecimals?: boolean
    currency?: CurrencyConfig
  }
): string {
  const currency = options?.currency || getCurrentCurrency()
  const showSymbol = options?.showSymbol !== false
  const showDecimals = options?.showDecimals !== false
  
  const decimalPlaces = showDecimals ? currency.decimalPlaces : 0
  
  // Format the number with proper locale
  const formatted = new Intl.NumberFormat(currency.locale, {
    style: 'decimal',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(amount)
  
  // Add currency symbol if requested
  if (showSymbol) {
    return currency.position === 'before' 
      ? `${currency.symbol}${formatted}`
      : `${formatted}${currency.symbol}`
  }
  
  return formatted
}

/**
 * Format currency with full Intl support
 */
export function formatCurrencyIntl(amount: number, currency?: CurrencyConfig): string {
  const config = currency || getCurrentCurrency()
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.code,
      minimumFractionDigits: config.decimalPlaces,
      maximumFractionDigits: config.decimalPlaces
    }).format(amount)
  } catch (error) {
    // Fallback to manual formatting if Intl fails
    return formatCurrency(amount, { currency: config })
  }
}

/**
 * Get just the currency symbol
 */
export function getCurrencySymbol(): string {
  return getCurrentCurrency().symbol
}

/**
 * Get the currency code
 */
export function getCurrencyCode(): string {
  return getCurrentCurrency().code
}

/**
 * Get the currency name
 */
export function getCurrencyName(): string {
  return getCurrentCurrency().name
}

/**
 * Parse a currency string back to a number
 */
export function parseCurrency(currencyString: string): number {
  const currency = getCurrentCurrency()
  
  // Remove currency symbol and spaces
  let cleaned = currencyString.replace(currency.symbol, '').trim()
  
  // Remove thousands separators
  cleaned = cleaned.replace(new RegExp(`\\${currency.thousandsSeparator}`, 'g'), '')
  
  // Convert decimal separator to period if different
  if (currency.decimalSeparator !== '.') {
    cleaned = cleaned.replace(currency.decimalSeparator, '.')
  }
  
  return parseFloat(cleaned) || 0
}

/**
 * Format currency for different contexts
 */
export const CurrencyFormatters = {
  // For display in tables and cards
  display: (amount: number) => formatCurrency(amount),
  
  // For forms and inputs (no symbol)
  input: (amount: number) => formatCurrency(amount, { showSymbol: false }),
  
  // For compact display (K, M abbreviations)
  compact: (amount: number) => {
    const currency = getCurrentCurrency()
    const symbol = currency.symbol
    
    if (amount >= 10000000) { // 10M+
      return `${symbol}${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 100000) { // 100K+
      return `${symbol}${(amount / 1000).toFixed(0)}K`
    } else {
      return formatCurrency(amount)
    }
  },
  
  // For accounting format with parentheses for negative
  accounting: (amount: number) => {
    const formatted = formatCurrency(Math.abs(amount))
    return amount < 0 ? `(${formatted})` : formatted
  }
}

/**
 * Utility to change the primary currency (for admin/settings)
 */
export function setCurrency(currencyCode: keyof typeof CURRENCY_OPTIONS): void {
  if (CURRENCY_OPTIONS[currencyCode]) {
    Object.assign(PRIMARY_CURRENCY, CURRENCY_OPTIONS[currencyCode])
  }
}

// Export commonly used values for convenience
export const CURRENCY_SYMBOL = getCurrencySymbol()
export const CURRENCY_CODE = getCurrencyCode()
export const CURRENCY_NAME = getCurrencyName()