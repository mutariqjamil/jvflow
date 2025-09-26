// Market Configuration System for JV-Flow
// Supports multiple currencies and regional market settings

import { logger } from '../logger';

export type Currency = 'AED' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'KWD' | 'QAR' | 'BHD';
export type Market = 'UAE' | 'KSA' | 'Kuwait' | 'Qatar' | 'Bahrain' | 'Global';

interface CurrencyConfig {
  code: Currency;
  symbol: string;
  name: string;
  decimals: number;
  position: 'before' | 'after'; // Symbol position relative to amount
  thousandsSeparator: string;
  decimalSeparator: string;
  rtl?: boolean; // Right-to-left support for Arabic markets
}

interface MarketConfig {
  code: Market;
  name: string;
  primaryCurrency: Currency;
  supportedCurrencies: Currency[];
  locale: string;
  timezone: string;
  dateFormat: string;
  language: 'en' | 'ar' | 'both';
  businessDays: number[]; // 0=Sunday, 6=Saturday
  weekendDays: number[];
  taxRate: number; // VAT/Tax rate as percentage
  taxName: string;
}

export class MarketConfigManager {
  private static instance: MarketConfigManager;
  private currentMarket: Market = 'UAE';
  private currentCurrency: Currency = 'AED';

  private readonly currencies: Record<Currency, CurrencyConfig> = {
    AED: {
      code: 'AED',
      symbol: 'د.إ',
      name: 'UAE Dirham',
      decimals: 2,
      position: 'before',
      thousandsSeparator: ',',
      decimalSeparator: '.',
      rtl: true
    },
    USD: {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      decimals: 2,
      position: 'before',
      thousandsSeparator: ',',
      decimalSeparator: '.'
    },
    EUR: {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      decimals: 2,
      position: 'before',
      thousandsSeparator: ',',
      decimalSeparator: '.'
    },
    GBP: {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound',
      decimals: 2,
      position: 'before',
      thousandsSeparator: ',',
      decimalSeparator: '.'
    },
    SAR: {
      code: 'SAR',
      symbol: 'ر.س',
      name: 'Saudi Riyal',
      decimals: 2,
      position: 'before',
      thousandsSeparator: ',',
      decimalSeparator: '.',
      rtl: true
    },
    KWD: {
      code: 'KWD',
      symbol: 'د.ك',
      name: 'Kuwaiti Dinar',
      decimals: 3, // KWD has 3 decimal places
      position: 'before',
      thousandsSeparator: ',',
      decimalSeparator: '.',
      rtl: true
    },
    QAR: {
      code: 'QAR',
      symbol: 'ر.ق',
      name: 'Qatari Riyal',
      decimals: 2,
      position: 'before',
      thousandsSeparator: ',',
      decimalSeparator: '.',
      rtl: true
    },
    BHD: {
      code: 'BHD',
      symbol: 'د.ب',
      name: 'Bahraini Dinar',
      decimals: 3, // BHD has 3 decimal places
      position: 'before',
      thousandsSeparator: ',',
      decimalSeparator: '.',
      rtl: true
    }
  };

  private readonly markets: Record<Market, MarketConfig> = {
    UAE: {
      code: 'UAE',
      name: 'United Arab Emirates',
      primaryCurrency: 'AED',
      supportedCurrencies: ['AED', 'USD', 'EUR', 'GBP'],
      locale: 'ar-AE',
      timezone: 'Asia/Dubai',
      dateFormat: 'DD/MM/YYYY',
      language: 'both',
      businessDays: [0, 1, 2, 3, 4], // Sunday to Thursday
      weekendDays: [5, 6], // Friday, Saturday
      taxRate: 5, // 5% VAT
      taxName: 'VAT'
    },
    KSA: {
      code: 'KSA',
      name: 'Kingdom of Saudi Arabia',
      primaryCurrency: 'SAR',
      supportedCurrencies: ['SAR', 'USD', 'EUR'],
      locale: 'ar-SA',
      timezone: 'Asia/Riyadh',
      dateFormat: 'DD/MM/YYYY',
      language: 'both',
      businessDays: [0, 1, 2, 3, 4],
      weekendDays: [5, 6],
      taxRate: 15, // 15% VAT
      taxName: 'VAT'
    },
    Kuwait: {
      code: 'Kuwait',
      name: 'State of Kuwait',
      primaryCurrency: 'KWD',
      supportedCurrencies: ['KWD', 'USD', 'EUR'],
      locale: 'ar-KW',
      timezone: 'Asia/Kuwait',
      dateFormat: 'DD/MM/YYYY',
      language: 'both',
      businessDays: [0, 1, 2, 3, 4],
      weekendDays: [5, 6],
      taxRate: 0, // No VAT in Kuwait yet
      taxName: 'Tax'
    },
    Qatar: {
      code: 'Qatar',
      name: 'State of Qatar',
      primaryCurrency: 'QAR',
      supportedCurrencies: ['QAR', 'USD', 'EUR'],
      locale: 'ar-QA',
      timezone: 'Asia/Qatar',
      dateFormat: 'DD/MM/YYYY',
      language: 'both',
      businessDays: [0, 1, 2, 3, 4],
      weekendDays: [5, 6],
      taxRate: 0, // No VAT in Qatar
      taxName: 'Tax'
    },
    Bahrain: {
      code: 'Bahrain',
      name: 'Kingdom of Bahrain',
      primaryCurrency: 'BHD',
      supportedCurrencies: ['BHD', 'USD', 'EUR'],
      locale: 'ar-BH',
      timezone: 'Asia/Bahrain',
      dateFormat: 'DD/MM/YYYY',
      language: 'both',
      businessDays: [0, 1, 2, 3, 4],
      weekendDays: [5, 6],
      taxRate: 10, // 10% VAT
      taxName: 'VAT'
    },
    Global: {
      code: 'Global',
      name: 'Global Market',
      primaryCurrency: 'USD',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'AED'],
      locale: 'en-US',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      language: 'en',
      businessDays: [1, 2, 3, 4, 5], // Monday to Friday
      weekendDays: [0, 6], // Sunday, Saturday
      taxRate: 0,
      taxName: 'Tax'
    }
  };

  private constructor() {
    this.loadFromStorage();
    logger.info('system', 'MarketConfigManager initialized', {
      currentMarket: this.currentMarket,
      currentCurrency: this.currentCurrency
    });
  }

  public static getInstance(): MarketConfigManager {
    if (!MarketConfigManager.instance) {
      MarketConfigManager.instance = new MarketConfigManager();
    }
    return MarketConfigManager.instance;
  }

  private loadFromStorage(): void {
    try {
      const savedMarket = localStorage.getItem('jvflow_market');
      const savedCurrency = localStorage.getItem('jvflow_currency');

      if (savedMarket && this.markets[savedMarket as Market]) {
        this.currentMarket = savedMarket as Market;
      }

      if (savedCurrency && this.currencies[savedCurrency as Currency]) {
        this.currentCurrency = savedCurrency as Currency;
      }
    } catch (error) {
      logger.warn('system', 'Failed to load market config from storage', { error });
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('jvflow_market', this.currentMarket);
      localStorage.setItem('jvflow_currency', this.currentCurrency);
    } catch (error) {
      logger.warn('system', 'Failed to save market config to storage', { error });
    }
  }

  // Market Management
  public setMarket(market: Market): void {
    if (!this.markets[market]) {
      throw new Error(`Unsupported market: ${market}`);
    }

    this.currentMarket = market;
    
    // Auto-switch to primary currency of the market
    const marketConfig = this.markets[market];
    this.currentCurrency = marketConfig.primaryCurrency;
    
    this.saveToStorage();
    
    logger.info('system', 'Market changed', {
      newMarket: market,
      primaryCurrency: this.currentCurrency,
      supportedCurrencies: marketConfig.supportedCurrencies
    });
  }

  public getCurrentMarket(): Market {
    return this.currentMarket;
  }

  public getMarketConfig(market?: Market): MarketConfig {
    return this.markets[market || this.currentMarket];
  }

  public getAllMarkets(): MarketConfig[] {
    return Object.values(this.markets);
  }

  // Currency Management
  public setCurrency(currency: Currency): void {
    const marketConfig = this.getMarketConfig();
    
    if (!marketConfig.supportedCurrencies.includes(currency)) {
      throw new Error(`Currency ${currency} not supported in market ${this.currentMarket}`);
    }

    this.currentCurrency = currency;
    this.saveToStorage();
    
    logger.info('system', 'Currency changed', {
      newCurrency: currency,
      market: this.currentMarket
    });
  }

  public getCurrentCurrency(): Currency {
    return this.currentCurrency;
  }

  public getCurrencyConfig(currency?: Currency): CurrencyConfig {
    return this.currencies[currency || this.currentCurrency];
  }

  public getSupportedCurrencies(): Currency[] {
    return this.getMarketConfig().supportedCurrencies;
  }

  public getAllCurrencies(): CurrencyConfig[] {
    return Object.values(this.currencies);
  }

  // Formatting Methods
  public formatCurrency(amount: number, currency?: Currency, options?: {
    showSymbol?: boolean;
    showCode?: boolean;
    precision?: number;
  }): string {
    const config = this.getCurrencyConfig(currency);
    const opts = {
      showSymbol: true,
      showCode: false,
      precision: config.decimals,
      ...options
    };

    // Format the number with proper decimals
    const formattedAmount = amount.toFixed(opts.precision);
    const [whole, decimal] = formattedAmount.split('.');
    
    // Add thousands separator
    const wholeFormatted = whole.replace(/\B(?=(\d{3})+(?!\d))/g, config.thousandsSeparator);
    
    // Combine whole and decimal parts
    const numberFormatted = decimal ? 
      `${wholeFormatted}${config.decimalSeparator}${decimal}` : 
      wholeFormatted;

    // Add symbol and/or code
    let result = numberFormatted;
    
    if (opts.showSymbol) {
      result = config.position === 'before' 
        ? `${config.symbol} ${result}`
        : `${result} ${config.symbol}`;
    }
    
    if (opts.showCode) {
      result += ` ${config.code}`;
    }

    return result;
  }

  public formatDate(date: Date, market?: Market): string {
    const config = this.getMarketConfig(market);
    
    try {
      return new Intl.DateTimeFormat(config.locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: config.timezone
      }).format(date);
    } catch (error) {
      // Fallback to basic formatting
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      
      return config.dateFormat === 'MM/DD/YYYY' 
        ? `${month}/${day}/${year}`
        : `${day}/${month}/${year}`;
    }
  }

  public isBusinessDay(date: Date, market?: Market): boolean {
    const config = this.getMarketConfig(market);
    const dayOfWeek = date.getDay();
    return config.businessDays.includes(dayOfWeek);
  }

  public isWeekend(date: Date, market?: Market): boolean {
    const config = this.getMarketConfig(market);
    const dayOfWeek = date.getDay();
    return config.weekendDays.includes(dayOfWeek);
  }

  public calculateTax(amount: number, market?: Market): number {
    const config = this.getMarketConfig(market);
    return amount * (config.taxRate / 100);
  }

  public getTaxRate(market?: Market): number {
    return this.getMarketConfig(market).taxRate;
  }

  public getTaxName(market?: Market): string {
    return this.getMarketConfig(market).taxName;
  }

  // Utility Methods
  public parseCurrency(formatted: string, currency?: Currency): number {
    const config = this.getCurrencyConfig(currency);
    
    // Remove currency symbols and codes
    let cleaned = formatted
      .replace(config.symbol, '')
      .replace(config.code, '')
      .trim();
    
    // Replace thousands separators and decimal separators
    cleaned = cleaned
      .replace(new RegExp(`\\${config.thousandsSeparator}`, 'g'), '')
      .replace(config.decimalSeparator, '.');
    
    return parseFloat(cleaned) || 0;
  }

  public convertCurrency(amount: number, from: Currency, to: Currency): number {
    // In a real application, you would fetch live exchange rates
    // For demo purposes, using approximate fixed rates
    const exchangeRates: Record<Currency, number> = {
      AED: 3.67, // AED to USD
      USD: 1.00,
      EUR: 0.85,
      GBP: 0.73,
      SAR: 3.75,
      KWD: 0.31,
      QAR: 3.64,
      BHD: 0.38
    };

    // Convert through USD as base currency
    const usdAmount = amount / exchangeRates[from];
    return usdAmount * exchangeRates[to];
  }

  // Configuration Export/Import
  public exportConfig(): string {
    return JSON.stringify({
      currentMarket: this.currentMarket,
      currentCurrency: this.currentCurrency,
      timestamp: new Date().toISOString()
    });
  }

  public importConfig(config: string): void {
    try {
      const parsed = JSON.parse(config);
      
      if (parsed.currentMarket && this.markets[parsed.currentMarket]) {
        this.currentMarket = parsed.currentMarket;
      }
      
      if (parsed.currentCurrency && this.currencies[parsed.currentCurrency]) {
        this.currentCurrency = parsed.currentCurrency;
      }
      
      this.saveToStorage();
      
      logger.info('system', 'Market config imported', {
        market: this.currentMarket,
        currency: this.currentCurrency
      });
    } catch (error) {
      logger.error('system', 'Failed to import market config', { error });
      throw new Error('Invalid configuration format');
    }
  }
}

// Export singleton instance
export const marketConfig = MarketConfigManager.getInstance();

// Export convenience functions
export const formatCurrency = (amount: number, currency?: Currency, options?: any) => 
  marketConfig.formatCurrency(amount, currency, options);

export const getCurrentMarket = () => marketConfig.getCurrentMarket();
export const getCurrentCurrency = () => marketConfig.getCurrentCurrency();
export const setMarket = (market: Market) => marketConfig.setMarket(market);
export const setCurrency = (currency: Currency) => marketConfig.setCurrency(currency);

export default marketConfig;