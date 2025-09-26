# Currency Management Guide

## Overview

JV-Flow now uses a **centralized currency management system** that controls all currency symbols, formatting, and localization throughout the entire application. This ensures consistency across all components, forms, test data, and displays.

## Quick Start

### Changing the Global Currency Symbol

To change the currency symbol across the entire application:

1. Open `src/config/currency.ts`
2. Modify the `PRIMARY_CURRENCY` configuration:

```typescript
// Example: Change from Pakistani Rupee to Indian Rupee
export const PRIMARY_CURRENCY: CurrencyConfig = {
  code: 'INR',
  symbol: '₹',  // Change this line
  name: 'Indian Rupee',
  locale: 'en-IN',
  position: 'before',
  decimalPlaces: 0,
  thousandsSeparator: ',',
  decimalSeparator: '.'
}
```

3. Save the file - all currency displays will update automatically!

## Usage in Components

### Basic Currency Formatting

```typescript
import { formatCurrency } from '../config/currency'

// In your component
<span>{formatCurrency(1500000)}</span>  // Output: ₨1,500,000
```

### Different Formatting Options

```typescript
import { formatCurrency, CurrencyFormatters } from '../config/currency'

// Standard display
<span>{formatCurrency(1500000)}</span>  // ₨1,500,000

// Without symbol (for inputs)
<input defaultValue={CurrencyFormatters.input(1500000)} />  // 1,500,000

// Compact format (K, M abbreviations)
<span>{CurrencyFormatters.compact(1500000)}</span>  // ₨1.5M

// Accounting format (parentheses for negative)
<span>{CurrencyFormatters.accounting(-1500000)}</span>  // (₨1,500,000)
```

### Getting Currency Info

```typescript
import { getCurrencySymbol, getCurrencyCode, getCurrencyName } from '../config/currency'

const symbol = getCurrencySymbol()  // ₨
const code = getCurrencyCode()      // PKR
const name = getCurrencyName()      // Pakistani Rupee
```

## Supported Currencies

The system supports multiple currencies out of the box:

| Code | Symbol | Name | Locale |
|------|--------|------|---------|
| PKR  | ₨     | Pakistani Rupee | en-PK |
| INR  | ₹     | Indian Rupee | en-IN |
| USD  | $     | US Dollar | en-US |
| AED  | د.إ    | UAE Dirham | ar-AE |
| GBP  | £     | British Pound | en-GB |

## File Structure

```
src/
├── config/
│   └── currency.ts              # Main currency configuration
├── lib/
│   └── utils.ts                 # Re-exports currency functions
├── components/
│   ├── providers/
│   │   └── InternationalizationProvider.tsx  # Updated to use centralized system
│   └── [all components now use formatCurrency]
└── scripts/
    └── update-currency-symbols.js  # Automated update script
```

## Configuration Options

### CurrencyConfig Interface

```typescript
interface CurrencyConfig {
  code: string              // ISO currency code (PKR, USD, etc.)
  symbol: string           // Currency symbol (₨, $, etc.)
  name: string            // Full currency name
  locale: string          // Locale for number formatting (en-PK, en-US, etc.)
  position: 'before' | 'after'  // Symbol position
  decimalPlaces: number   // Number of decimal places to show
  thousandsSeparator: string    // Thousands separator (,)
  decimalSeparator: string     // Decimal separator (.)
}
```

### Advanced Customization

```typescript
// Custom formatting with options
formatCurrency(amount, {
  showSymbol: false,      // Hide currency symbol
  showDecimals: true,     // Show decimal places
  currency: customConfig  // Use different currency config
})
```

## Migration from Old System

### Before (Inconsistent)
```typescript
// Different files using different approaches
<span>₨{amount.toLocaleString()}</span>       // Some files
<span>PKR {amount}</span>                     // Other files  
<span>Rs. {amount}</span>                     // More files
```

### After (Consistent)
```typescript
// All files use the same approach
import { formatCurrency } from '../config/currency'
<span>{formatCurrency(amount)}</span>
```

## Best Practices

### ✅ Do's

```typescript
// ✅ Use formatCurrency for all currency displays
<span>{formatCurrency(price)}</span>

// ✅ Use CurrencyFormatters for specific contexts
<input value={CurrencyFormatters.input(price)} />

// ✅ Import from the centralized config
import { formatCurrency } from '../config/currency'
```

### ❌ Don'ts

```typescript
// ❌ Don't hardcode currency symbols
<span>₨{price}</span>

// ❌ Don't use manual formatting
<span>PKR {price.toLocaleString()}</span>

// ❌ Don't mix different formatting approaches
```

## Testing Currency Changes

### Manual Testing
1. Change `PRIMARY_CURRENCY` in `src/config/currency.ts`
2. Restart the development server
3. Browse through the application to see changes

### Automated Testing
```bash
# Run currency-specific tests
npm test -- --grep "currency"

# Test UI components with different currencies
npm run test:ui
```

## Integration with Existing Systems

### With Internationalization
The currency system integrates with the existing internationalization provider:

```typescript
// InternationalizationProvider automatically uses centralized currency
const { formatCurrency } = useInternationalization()
// This now calls the centralized formatCurrency function
```

### With Forms and Inputs
```typescript
// Form inputs can parse currency values
import { parseCurrency } from '../config/currency'

const handleSubmit = (formData) => {
  const amount = parseCurrency(formData.price)  // Converts "₨1,500" to 1500
}
```

## Admin Configuration

Super administrators can change currency settings through the admin panel:

1. Login as Super Admin
2. Go to **Super Admin** → **Settings**
3. Navigate to **System Settings** tab  
4. Configure currency preferences

*Note: Admin currency switching is planned for future releases.*

## Troubleshooting

### Common Issues

1. **Currency not updating after change**
   - Restart the development server
   - Clear browser cache
   - Check console for errors

2. **Import errors**
   ```typescript
   // ❌ Wrong import path
   import { formatCurrency } from './currency'
   
   // ✅ Correct import path (adjust ../ based on file location)
   import { formatCurrency } from '../config/currency'
   ```

3. **TypeScript errors**
   - Ensure you're importing the correct types
   - Check that the currency config is properly typed

### Debug Mode

Enable debug logging for currency operations:

```typescript
import { getCurrentCurrency } from '../config/currency'

// Log current currency configuration
console.log('Current currency:', getCurrentCurrency())
```

## Future Enhancements

Planned features for the currency system:

- [ ] **User-specific currency preferences**
- [ ] **Multi-currency support** (show prices in multiple currencies)
- [ ] **Exchange rate integration**
- [ ] **Admin panel currency switcher**
- [ ] **Automatic locale detection**
- [ ] **Currency conversion APIs**

## Performance Considerations

The centralized currency system is designed for performance:

- **Zero runtime overhead** - Formatting functions are lightweight
- **Tree-shakable** - Only imported functions are included in the bundle
- **Cached formatters** - Intl.NumberFormat instances are reused
- **Minimal re-renders** - Currency changes don't trigger unnecessary updates

## Contributing

When adding new currency-related features:

1. Always use the centralized `formatCurrency` function
2. Add new currencies to `CURRENCY_OPTIONS` in `currency.ts`
3. Update tests to cover new functionality
4. Document any new formatting options

## Migration Checklist

- [x] ✅ Created centralized currency configuration (`src/config/currency.ts`)
- [x] ✅ Updated InternationalizationProvider to use centralized system
- [x] ✅ Updated all dashboard components
- [x] ✅ Updated all form components
- [x] ✅ Updated test data and mock files
- [x] ✅ Updated UI test components
- [x] ✅ Created migration scripts
- [x] ✅ Added comprehensive documentation
- [x] ✅ Verified consistency across all files

---

## Quick Reference

### Import Statement
```typescript
import { formatCurrency } from '../config/currency'
```

### Basic Usage
```typescript
{formatCurrency(amount)}
```

### Change Global Currency
Edit `PRIMARY_CURRENCY` in `src/config/currency.ts`

### Available Formatters
- `formatCurrency(amount)` - Standard display
- `CurrencyFormatters.input(amount)` - For form inputs
- `CurrencyFormatters.compact(amount)` - Compact format (1.5M)
- `CurrencyFormatters.accounting(amount)` - Accounting format

**That's it!** 🎉 Your application now has consistent, centralized currency management.