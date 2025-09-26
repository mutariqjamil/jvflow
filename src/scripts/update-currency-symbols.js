#!/usr/bin/env node

/**
 * Currency Symbol Consistency Update Script
 * 
 * This script ensures all currency references use the centralized
 * currency configuration system throughout the application.
 */

const fs = require('fs')
const path = require('path')

// Files to update (relative to src directory)
const filesToUpdate = [
  'data/demo-sample-data.ts',
  'data/pakistan-demo-data.ts',
  'components/mobile/MobileDashboard.tsx',
  'components/NotificationProvider.tsx',
  'components/dashboards/ProjectSetupDashboard.tsx',
  'components/dashboards/AccountStatementsDashboard.tsx',
  'components/dashboards/EmployeeManagementDashboard.tsx',
  'components/dashboards/InstallmentsInvoicingDashboard.tsx',
  'components/dashboards/PurchaseOrderDashboard.tsx',
  'components/dashboards/SettingsDashboard.tsx',
  'components/dashboards/ReportsDashboard.tsx',
  'components/dashboards/AutoInvoiceSystemDashboard.tsx'
]

// Patterns to replace
const replacementPatterns = [
  // Pakistani Rupee symbol replacements
  {
    search: /₨(\d+(?:,\d+)*(?:\.\d+)?)/g,
    replace: '{formatCurrency($1)}',
    description: 'Replace ₨ symbols with formatCurrency calls'
  },
  {
    search: /₨\{([^}]+)\}/g,
    replace: '{formatCurrency($1)}',
    description: 'Replace ₨{value} with formatCurrency calls'
  },
  // PKR text replacements
  {
    search: /PKR\s+(\d+(?:,\d+)*(?:\.\d+)?[KMB]?)/g,
    replace: '{formatCurrency($1)}',
    description: 'Replace PKR prefix with formatCurrency calls'
  },
  // Rs. prefix replacements
  {
    search: /Rs\.\s*(\d+(?:,\d+)*(?:\.\d+)?)/g,
    replace: '{formatCurrency($1)}',
    description: 'Replace Rs. prefix with formatCurrency calls'
  }
]

function addImportIfNeeded(content, filePath) {
  // Check if formatCurrency import already exists
  if (content.includes('formatCurrency')) {
    return content
  }

  // Determine the correct import path based on file location
  const depth = filePath.split('/').length - 2 // -2 for 'src' and the file itself
  const importPath = '../'.repeat(depth) + 'config/currency'

  // Find the last import statement
  const lines = content.split('\n')
  let lastImportIndex = -1
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim().startsWith('import ') && !lines[i].includes('from \'react\'')) {
      lastImportIndex = i
    }
  }

  if (lastImportIndex >= 0) {
    // Add import after the last import
    lines.splice(lastImportIndex + 1, 0, `import { formatCurrency } from '${importPath}'`)
  } else {
    // Add import at the top if no imports found
    lines.unshift(`import { formatCurrency } from '${importPath}'`)
  }

  return lines.join('\n')
}

function parseAmount(amountStr) {
  // Remove commas and convert to number
  const cleanAmount = amountStr.replace(/,/g, '')
  
  // Handle K, M, B suffixes
  if (cleanAmount.endsWith('K')) {
    return parseFloat(cleanAmount.slice(0, -1)) * 1000
  } else if (cleanAmount.endsWith('M')) {
    return parseFloat(cleanAmount.slice(0, -1)) * 1000000
  } else if (cleanAmount.endsWith('B')) {
    return parseFloat(cleanAmount.slice(0, -1)) * 1000000000
  }
  
  return parseFloat(cleanAmount)
}

function updateFile(filePath) {
  const fullPath = path.join(__dirname, '..', filePath)
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`)
    return
  }

  let content = fs.readFileSync(fullPath, 'utf8')
  let hasChanges = false

  // Apply replacement patterns
  for (const pattern of replacementPatterns) {
    const matches = content.match(pattern.search)
    if (matches) {
      console.log(`📝 Updating ${filePath}: ${pattern.description}`)
      console.log(`   Found ${matches.length} matches: ${matches.slice(0, 3).join(', ')}${matches.length > 3 ? '...' : ''}`)
      
      // Special handling for currency amounts
      content = content.replace(pattern.search, (match, amount) => {
        const numericAmount = parseAmount(amount)
        return `{formatCurrency(${numericAmount})}`
      })
      
      hasChanges = true
    }
  }

  // Add import if we made changes
  if (hasChanges) {
    content = addImportIfNeeded(content, filePath)
    fs.writeFileSync(fullPath, content)
    console.log(`✅ Updated ${filePath}`)
  } else {
    console.log(`✨ Already consistent: ${filePath}`)
  }
}

function main() {
  console.log('🔧 Starting currency symbol consistency update...\n')

  filesToUpdate.forEach(updateFile)

  console.log('\n✅ Currency symbol update complete!')
  console.log('\n📋 Summary:')
  console.log('- All currency symbols now use the centralized formatCurrency function')
  console.log('- Consistent ₨ symbol (Pakistani Rupee) across all files')
  console.log('- Easy to change currency by modifying src/config/currency.ts')
  console.log('\n💡 To change the currency symbol globally:')
  console.log('   Edit the PRIMARY_CURRENCY configuration in src/config/currency.ts')
}

if (require.main === module) {
  main()
}

module.exports = { updateFile, parseAmount, addImportIfNeeded }