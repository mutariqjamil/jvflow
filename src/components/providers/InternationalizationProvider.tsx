import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'en' | 'ar' | 'ur'
export type Currency = 'USD' | 'PKR' | 'EGP' | 'SAR' | 'BHD' | 'OMR' | 'AED' | 'ZAR'

export interface CurrencyInfo {
  code: Currency
  symbol: string
  name: string
  country: string
}

export const currencies: Record<Currency, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States' },
  PKR: { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', country: 'Pakistan' },
  EGP: { code: 'EGP', symbol: '£', name: 'Egyptian Pound', country: 'Egypt' },
  SAR: { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', country: 'Saudi Arabia' },
  BHD: { code: 'BHD', symbol: '.د.ب', name: 'Bahraini Dinar', country: 'Bahrain' },
  OMR: { code: 'OMR', symbol: '﷼', name: 'Omani Rial', country: 'Oman' },
  AED: { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', country: 'UAE' },
  ZAR: { code: 'ZAR', symbol: 'R', name: 'South African Rand', country: 'South Africa' }
}

export interface LanguageInfo {
  code: Language
  name: string
  nativeName: string
  direction: 'ltr' | 'rtl'
}

export const languages: Record<Language, LanguageInfo> = {
  en: { code: 'en', name: 'English', nativeName: 'English', direction: 'ltr' },
  ar: { code: 'ar', name: 'Arabic', nativeName: 'العربية', direction: 'rtl' },
  ur: { code: 'ur', name: 'Urdu', nativeName: 'اردو', direction: 'rtl' }
}

interface InternationalizationContextType {
  language: Language
  currency: Currency
  direction: 'ltr' | 'rtl'
  setLanguage: (language: Language) => void
  setCurrency: (currency: Currency) => void
  t: (key: string, params?: Record<string, any>) => string
  formatCurrency: (amount: number, currency?: Currency) => string
  formatNumber: (number: number) => string
}

const InternationalizationContext = createContext<InternationalizationContextType | undefined>(undefined)

// Translation keys and messages
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.warning': 'Warning',
    'common.info': 'Info',
    
    // Dashboard Navigation
    'nav.overview': 'Overview',
    'nav.sales': 'Sales',
    'nav.bookings': 'Bookings',
    'nav.expenses': 'Expenses',
    'nav.commissions': 'Commissions',
    'nav.reports': 'Reports',
    'nav.settings': 'Settings',
    'nav.userManagement': 'User Management',
    'nav.vendorManagement': 'Vendor Management',
    'nav.materialManagement': 'Material Management',
    'nav.procurement': 'Procurement',
    'nav.purchaseOrders': 'Purchase Orders',
    'nav.projectMilestones': 'Project Milestones',
    
    // Settings
    'settings.title': 'Organization Settings',
    'settings.description': 'Customize your branding, themes, and templates',
    'settings.language': 'Language',
    'settings.currency': 'Currency',
    'settings.languageDescription': 'Choose your preferred language',
    'settings.currencyDescription': 'Select your organization\'s default currency',
    'settings.saveChanges': 'Save Changes',
    'settings.localization': 'Localization',
    'settings.localizationDescription': 'Language and regional settings',
    
    // Currency Names
    'currency.USD': 'US Dollar',
    'currency.PKR': 'Pakistani Rupee', 
    'currency.EGP': 'Egyptian Pound',
    'currency.SAR': 'Saudi Riyal',
    'currency.BHD': 'Bahraini Dinar',
    'currency.OMR': 'Omani Rial',
    'currency.AED': 'UAE Dirham',
    'currency.ZAR': 'South African Rand',
    
    // Auth
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot Password?',
    'auth.createAccount': 'Create Account',
    
    // Overview Dashboard
    'overview.title': 'Dashboard Overview',
    'overview.totalRevenue': 'Total Revenue',
    'overview.activeProjects': 'Active Projects',
    'overview.pendingApprovals': 'Pending Approvals',
    'overview.upcomingMilestones': 'Upcoming Milestones',
    
    // Sales
    'sales.title': 'Sales Management',
    'sales.description': 'Track unit bookings, customer payments, and sales performance',
    'sales.newSale': 'New Sale',
    'sales.addBooking': 'Add Booking',
    'sales.newBooking': 'New Unit Booking',
    'sales.newBookingDescription': 'Record a new customer booking',
    'sales.unitNumber': 'Unit Number',
    'sales.unitPlaceholder': 'e.g., A-101',
    'sales.customerName': 'Customer Name',
    'sales.customerPlaceholder': 'Full name',
    'sales.emailPlaceholder': 'customer@email.com',
    'sales.phone': 'Phone',
    'sales.phonePlaceholder': '+1-555-0123',
    'sales.totalAmount': 'Total Amount',
    'sales.downPayment': 'Down Payment',
    'sales.createBooking': 'Create Booking',
    'sales.monthlyGrowth': '+15% from last month',
    'sales.unitsBooked': 'Units Booked',
    'sales.ofTotalUnits': 'of {{total}} total units',
    'sales.commissionRate': '5% commission rate',
    'sales.activeCustomers': 'Active Customers',
    'sales.weeklyGrowth': '+3 this week',
    'sales.progress': 'Sales Progress',
    'sales.progressDescription': 'Unit booking progress for current project',
    'sales.booked': 'Booked',
    'sales.sold': 'Sold',
    'sales.available': 'Available',
    'sales.records': 'Sales Records',
    'sales.recordsDescription': 'Customer bookings and payment status',
    'sales.allStatus': 'All Status',
    'sales.pending': 'Pending',
    'sales.completed': 'Completed',
    'sales.unit': 'Unit',
    'sales.customer': 'Customer',
    'sales.contact': 'Contact',
    'sales.agent': 'Agent',
    'sales.status': 'Status',
    'sales.date': 'Date',
    'sales.totalSales': 'Total Sales',
    'sales.pendingSales': 'Pending Sales',
    'sales.completedSales': 'Completed Sales',
    
    // Expenses
    'expenses.title': 'Expense Management',
    'expenses.description': 'Track and approve project expenses with comprehensive maker-checker workflow',
    'expenses.newExpense': 'New Expense',
    'expenses.submitNewExpense': 'Submit New Expense',
    'expenses.submitDescription': 'Submit a new expense for approval through the maker-checker workflow',
    'expenses.totalApproved': 'Total Approved',
    'expenses.expensesApproved': '{{count}} expenses approved',
    'expenses.pendingApproval': 'Pending Approval',
    'expenses.awaitingReview': '{{count}} awaiting review',
    'expenses.thisMonth': 'This Month',
    'expenses.monthlyChange': '5% vs last month',
    'expenses.requireResubmission': 'Require resubmission',
    'expenses.approved': 'Approved',
    'expenses.rejected': 'Rejected',
    
    // Projects
    'projects.title': 'Projects',
    'projects.newProject': 'New Project',
    'projects.activeProjects': 'Active Projects',
    'projects.completedProjects': 'Completed Projects'
  },
  
  ar: {
    // Navigation & Common  
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.confirm': 'تأكيد',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.loading': 'جارٍ التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.warning': 'تحذير',
    'common.info': 'معلومات',
    
    // Dashboard Navigation
    'nav.overview': 'نظرة عامة',
    'nav.sales': 'المبيعات',
    'nav.bookings': 'الحجوزات',
    'nav.expenses': 'المصروفات',
    'nav.commissions': 'العمولات',
    'nav.reports': 'التقارير',
    'nav.settings': 'الإعدادات',
    'nav.userManagement': 'إدارة المستخدمين',
    'nav.vendorManagement': 'إدارة الموردين',
    'nav.materialManagement': 'إدارة المواد',
    'nav.procurement': 'المشتريات',
    'nav.purchaseOrders': 'أوامر الشراء',
    'nav.projectMilestones': 'معالم المشروع',
    
    // Settings
    'settings.title': 'إعدادات المؤسسة',
    'settings.description': 'تخصيص العلامة التجارية والثيمات والقوالب',
    'settings.language': 'اللغة',
    'settings.currency': 'العملة',
    'settings.languageDescription': 'اختر لغتك المفضلة',
    'settings.currencyDescription': 'حدد العملة الافتراضية لمؤسستك',
    'settings.saveChanges': 'حفظ التغييرات',
    'settings.localization': 'الترجمة والمحلية',
    'settings.localizationDescription': 'إعدادات اللغة والمنطقة',
    
    // Currency Names
    'currency.USD': 'الدولار الأمريكي',
    'currency.PKR': 'الروبية الباكستانية',
    'currency.EGP': 'الجنيه المصري',
    'currency.SAR': 'الريال السعودي',
    'currency.BHD': 'الدينار البحريني',
    'currency.OMR': 'الريال العماني',
    'currency.AED': 'الدرهم الإماراتي',
    'currency.ZAR': 'الراند الأفريقي',
    
    // Auth
    'auth.signIn': 'تسجيل الدخول',
    'auth.signOut': 'تسجيل الخروج',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.forgotPassword': 'نسيت كلمة المرور؟',
    'auth.createAccount': 'إنشاء حساب',
    
    // Overview Dashboard
    'overview.title': 'لوحة المراقبة العامة',
    'overview.totalRevenue': 'إجمالي الإيرادات',
    'overview.activeProjects': 'المشاريع النشطة',
    'overview.pendingApprovals': 'الموافقات المعلقة',
    'overview.upcomingMilestones': 'المعالم القادمة',
    
    // Sales
    'sales.title': 'إدارة المبيعات',
    'sales.description': 'تتبع حجوزات الوحدات ومدفوعات العملاء وأداء المبيعات',
    'sales.newSale': 'مبيعة جديدة',
    'sales.addBooking': 'إضافة حجز',
    'sales.newBooking': 'حجز وحدة جديد',
    'sales.newBookingDescription': 'تسجيل حجز عميل جديد',
    'sales.unitNumber': 'رقم الوحدة',
    'sales.unitPlaceholder': 'مثال: أ-101',
    'sales.customerName': 'اسم العميل',
    'sales.customerPlaceholder': 'الاسم الكامل',
    'sales.emailPlaceholder': 'customer@email.com',
    'sales.phone': 'الهاتف',
    'sales.phonePlaceholder': '+966-555-0123',
    'sales.totalAmount': 'المبلغ الإجمالي',
    'sales.downPayment': 'الدفعة المقدمة',
    'sales.createBooking': 'إنشاء حجز',
    'sales.monthlyGrowth': '+15% من الشهر الماضي',
    'sales.unitsBooked': 'الوحدات المحجوزة',
    'sales.ofTotalUnits': 'من {{total}} وحدة إجمالية',
    'sales.commissionRate': '5% معدل العمولة',
    'sales.activeCustomers': 'العملاء النشطون',
    'sales.weeklyGrowth': '+3 هذا الأسبوع',
    'sales.progress': 'تقدم المبيعات',
    'sales.progressDescription': 'تقدم حجز الوحدات للمشروع الحالي',
    'sales.booked': 'محجوز',
    'sales.sold': 'مباع',
    'sales.available': 'متاح',
    'sales.records': 'سجلات المبيعات',
    'sales.recordsDescription': 'حجوزات العملاء وحالة الدفع',
    'sales.allStatus': 'جميع الحالات',
    'sales.pending': 'معلق',
    'sales.completed': 'مكتمل',
    'sales.unit': 'الوحدة',
    'sales.customer': 'العميل',
    'sales.contact': 'التواصل',
    'sales.agent': 'الوكيل',
    'sales.status': 'الحالة',
    'sales.date': 'التاريخ',
    'sales.totalSales': 'إجمالي المبيعات',
    'sales.pendingSales': 'المبيعات المعلقة',
    'sales.completedSales': 'المبيعات المكتملة',
    
    // Expenses
    'expenses.title': 'إدارة المصروفات',
    'expenses.description': 'تتبع واعتماد مصاريف المشروع بسير عمل شامل للفحص والاعتماد',
    'expenses.newExpense': 'مصروف جديد',
    'expenses.submitNewExpense': 'تقديم مصروف جديد',
    'expenses.submitDescription': 'تقديم مصروف جديد للاعتماد من خلال سير عمل الفحص والاعتماد',
    'expenses.totalApproved': 'إجمالي المعتمد',
    'expenses.expensesApproved': '{{count}} مصاريف معتمدة',
    'expenses.pendingApproval': 'في انتظار الموافقة',
    'expenses.awaitingReview': '{{count}} في انتظار المراجعة',
    'expenses.thisMonth': 'هذا الشهر',
    'expenses.monthlyChange': '5% مقارنة بالشهر الماضي',
    'expenses.requireResubmission': 'تتطلب إعادة تقديم',
    'expenses.approved': 'معتمد',
    'expenses.rejected': 'مرفوض',
    
    // Projects
    'projects.title': 'المشاريع',
    'projects.newProject': 'مشروع جديد',
    'projects.activeProjects': 'المشاريع النشطة',
    'projects.completedProjects': 'المشاريع المكتملة'
  },
  
  ur: {
    // Navigation & Common
    'common.save': 'محفوظ کریں',
    'common.cancel': 'منسوخ کریں',
    'common.confirm': 'تصدیق کریں',
    'common.delete': 'حذف کریں',
    'common.edit': 'ترمیم کریں',
    'common.add': 'شامل کریں',
    'common.search': 'تلاش کریں',
    'common.loading': 'لوڈ ہو رہا ہے...',
    'common.error': 'خرابی',
    'common.success': 'کامیاب',
    'common.warning': 'انتباہ',
    'common.info': 'معلومات',
    
    // Dashboard Navigation
    'nav.overview': 'جائزہ',
    'nav.sales': 'فروخت',
    'nav.bookings': 'بکنگز',
    'nav.expenses': 'اخراجات',
    'nav.commissions': 'کمیشن',
    'nav.reports': 'رپورٹس',
    'nav.settings': 'سیٹنگز',
    'nav.userManagement': 'صارف کا انتظام',
    'nav.vendorManagement': 'فراہم کنندہ کا انتظام',
    'nav.materialManagement': 'مواد کا انتظام',
    'nav.procurement': 'خریداری',
    'nav.purchaseOrders': 'خرید کے احکامات',
    'nav.projectMilestones': 'پروجیکٹ کے سنگ میل',
    
    // Settings
    'settings.title': 'تنظیم کی سیٹنگز',
    'settings.description': 'اپنی برانڈنگ، تھیمز اور ٹیمپلیٹس کو حسب ضرورت بنائیں',
    'settings.language': 'زبان',
    'settings.currency': 'کرنسی',
    'settings.languageDescription': 'اپنی پسندیدہ زبان منتخب کریں',
    'settings.currencyDescription': 'اپنی تنظیم کی ڈیفالٹ کرنسی منتخب کریں',
    'settings.saveChanges': 'تبدیلیاں محفوظ کریں',
    'settings.localization': 'مقامیانہ',
    'settings.localizationDescription': 'زبان اور علاقائی سیٹنگز',
    
    // Currency Names
    'currency.USD': 'امریکی ڈالر',
    'currency.PKR': 'پاکستانی روپیہ',
    'currency.EGP': 'مصری پاؤنڈ',
    'currency.SAR': 'سعودی ریال',
    'currency.BHD': 'بحرینی دینار',
    'currency.OMR': 'عمانی ریال',
    'currency.AED': 'اماراتی درہم',
    'currency.ZAR': 'جنوبی افریقی رینڈ',
    
    // Auth
    'auth.signIn': 'سائن ان کریں',
    'auth.signOut': 'سائن آؤٹ کریں',
    'auth.email': 'ای میل',
    'auth.password': 'پاس ورڈ',
    'auth.forgotPassword': 'پاس ورڈ بھول گئے؟',
    'auth.createAccount': 'اکاؤنٹ بنائیں',
    
    // Overview Dashboard
    'overview.title': 'ڈیش بورڈ جائزہ',
    'overview.totalRevenue': 'کل آمدنی',
    'overview.activeProjects': 'فعال پروجیکٹس',
    'overview.pendingApprovals': 'زیر التواء منظوریاں',
    'overview.upcomingMilestones': 'آنے والے سنگ میل',
    
    // Sales
    'sales.title': 'فروخت کا انتظام',
    'sales.description': 'یونٹ بکنگز، کسٹمر پیمنٹس، اور فروخت کی کارکردگی کو ٹریک کریں',
    'sales.newSale': 'نئی فروخت',
    'sales.addBooking': 'بکنگ شامل کریں',
    'sales.newBooking': 'نئی یونٹ بکنگ',
    'sales.newBookingDescription': 'نئے کسٹمر کی بکنگ ریکارڈ کریں',
    'sales.unitNumber': 'یونٹ نمبر',
    'sales.unitPlaceholder': 'مثال: A-101',
    'sales.customerName': 'کسٹمر کا نام',
    'sales.customerPlaceholder': 'مکمل نام',
    'sales.emailPlaceholder': 'customer@email.com',
    'sales.phone': 'فون',
    'sales.phonePlaceholder': '+92-300-0123456',
    'sales.totalAmount': 'کل رقم',
    'sales.downPayment': 'پیشگی ادائیگی',
    'sales.createBooking': 'بکنگ بنائیں',
    'sales.monthlyGrowth': 'گزشتہ ماہ سے +15%',
    'sales.unitsBooked': 'بک شدہ یونٹس',
    'sales.ofTotalUnits': 'کل {{total}} یونٹس میں سے',
    'sales.commissionRate': '5% کمیشن کی شرح',
    'sales.activeCustomers': 'فعال کسٹمرز',
    'sales.weeklyGrowth': 'اس ہفتے +3',
    'sales.progress': 'فروخت کی پیشرفت',
    'sales.progressDescription': 'موجودہ پروجیکٹ کے لیے یونٹ بکنگ کی پیشرفت',
    'sales.booked': 'بک شدہ',
    'sales.sold': 'فروخت شدہ',
    'sales.available': 'دستیاب',
    'sales.records': 'فروخت کے ریکارڈ',
    'sales.recordsDescription': 'کسٹمر بکنگز اور ادائیگی کی صورتحال',
    'sales.allStatus': 'تمام حالات',
    'sales.pending': 'زیر التواء',
    'sales.completed': 'مکمل',
    'sales.unit': 'یونٹ',
    'sales.customer': 'کسٹمر',
    'sales.contact': 'رابطہ',
    'sales.agent': 'ایجنٹ',
    'sales.status': 'حالت',
    'sales.date': 'تاریخ',
    'sales.totalSales': 'کل فروخت',
    'sales.pendingSales': 'زیر التواء فروخت',
    'sales.completedSales': 'مکمل شدہ فروخت',
    
    // Expenses
    'expenses.title': 'اخراجات کا انتظام',
    'expenses.description': 'میکر-چیکر ورک فلو کے ساتھ پروجیکٹ کے اخراجات کو ٹریک اور منظور کریں',
    'expenses.newExpense': 'نیا خرچہ',
    'expenses.submitNewExpense': 'نیا خرچہ جمع کریں',
    'expenses.submitDescription': 'میکر-چیکر ورک فلو کے ذریعے منظوری کے لیے نیا خرچہ جمع کریں',
    'expenses.totalApproved': 'کل منظور شدہ',
    'expenses.expensesApproved': '{{count}} اخراجات منظور شدہ',
    'expenses.pendingApproval': 'منظوری کا انتظار',
    'expenses.awaitingReview': '{{count}} جائزے کا انتظار',
    'expenses.thisMonth': 'اس مہینے',
    'expenses.monthlyChange': 'پچھلے مہینے کے مقابلے میں 5%',
    'expenses.requireResubmission': 'دوبارہ جمع کرنے کی ضرورت',
    'expenses.approved': 'منظور شدہ',
    'expenses.rejected': 'مسترد',
    
    // Projects
    'projects.title': 'پروجیکٹس',
    'projects.newProject': 'نیا پروجیکٹ',
    'projects.activeProjects': 'فعال پروجیکٹس',
    'projects.completedProjects': 'مکمل پروجیکٹس'
  }
}

interface InternationalizationProviderProps {
  children: ReactNode
}

export function InternationalizationProvider({ children }: InternationalizationProviderProps) {
  const [language, setLanguageState] = useState<Language>('en')
  const [currency, setCurrencyState] = useState<Currency>('USD')

  // Load saved settings from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('jv-flow-language') as Language
    const savedCurrency = localStorage.getItem('jv-flow-currency') as Currency
    
    if (savedLanguage && languages[savedLanguage]) {
      setLanguageState(savedLanguage)
    }
    if (savedCurrency && currencies[savedCurrency]) {
      setCurrencyState(savedCurrency)
    }
  }, [])

  // Apply RTL/LTR direction to document
  useEffect(() => {
    const direction = languages[language].direction
    document.documentElement.dir = direction
    document.documentElement.lang = language
  }, [language])

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage)
    localStorage.setItem('jv-flow-language', newLanguage)
  }

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
    localStorage.setItem('jv-flow-currency', newCurrency)
  }

  const t = (key: string, params?: Record<string, any>): string => {
    let translation = translations[language][key] || translations['en'][key] || key
    
    // Simple parameter substitution
    if (params) {
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{{${param}}}`, params[param])
      })
    }
    
    return translation
  }

  const formatCurrency = (amount: number, currencyCode?: Currency): string => {
    const targetCurrency = currencyCode || currency
    const currencyInfo = currencies[targetCurrency]
    
    try {
      const formatter = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US', {
        style: 'currency',
        currency: targetCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
      
      return formatter.format(amount)
    } catch (error) {
      // Fallback if Intl.NumberFormat fails
      return `${currencyInfo.symbol}${amount.toLocaleString()}`
    }
  }

  const formatNumber = (number: number): string => {
    try {
      return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : language === 'ur' ? 'ur-PK' : 'en-US').format(number)
    } catch (error) {
      return number.toLocaleString()
    }
  }

  const direction = languages[language].direction

  return (
    <InternationalizationContext.Provider
      value={{
        language,
        currency,
        direction,
        setLanguage,
        setCurrency,
        t,
        formatCurrency,
        formatNumber,
      }}
    >
      {children}
    </InternationalizationContext.Provider>
  )
}

export function useInternationalization() {
  const context = useContext(InternationalizationContext)
  if (context === undefined) {
    throw new Error('useInternationalization must be used within an InternationalizationProvider')
  }
  return context
}

// Convenience hooks
export function useTranslation() {
  const { t } = useInternationalization()
  return { t }
}

export function useCurrency() {
  const { currency, formatCurrency, setCurrency } = useInternationalization()
  return { currency, formatCurrency, setCurrency }
}