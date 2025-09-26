#!/bin/bash

echo "=== JV-Flow Currency Symbol Test ==="
echo

echo "1. Checking for remaining USD references..."
grep -r "USD" src/ --include="*.tsx" --include="*.ts" | grep -v "currencies.*USD" | grep -v "type.*USD" | head -10

echo
echo "2. Checking for $ symbols in user-facing text..."
grep -r "\$[0-9]" src/ --include="*.tsx" --include="*.ts" | head -10

echo
echo "3. Checking for Indian Rupee ₹ symbols..."
grep -r "₹" src/ --include="*.tsx" --include="*.ts" | head -10

echo
echo "4. Verifying Pakistani Rupee ₨ symbols..."
grep -r "₨" src/ --include="*.tsx" --include="*.ts" | head -5

echo
echo "5. Checking Supabase configuration..."
if [ -f "src/utils/supabase/info.ts" ]; then
  echo "Supabase config found:"
  cat src/utils/supabase/info.ts
else
  echo "Supabase config not found"
fi

echo
echo "6. Checking demo data currency..."
grep -r "currency.*PKR" src/data/ | head -5

echo
echo "=== Test completed ==="
echo "Application should be running on http://localhost:3000"
echo "Please check the application manually for:"
echo "- Currency displays showing ₨ instead of $ or ₹"
echo "- Pakistani phone number formats (+92-xx-xxxxxxx)"
echo "- PKR amounts in all financial displays"
echo "- Supabase test suite accessibility"
echo "- UI test suite functionality"