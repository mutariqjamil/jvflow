import { useState } from 'react'
import { Save, Upload, Eye, Palette, Building2, FileText, Download, X, Check, Globe, DollarSign } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { ImageWithFallback } from '../figma/ImageWithFallback'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { useInternationalization, languages, currencies } from '../providers/InternationalizationProvider'

interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  border: string
}

interface OrganizationBranding {
  organization_logo?: string
  project_logos: Record<string, string>
  theme_colors: ThemeColors
  invoice_template: string
  email_template: string
  letterhead_template: string
}

const defaultThemes = {
  'Corporate Blue': {
    primary: '#030213',
    secondary: '#f1f5f9',
    accent: '#e2e8f0',
    background: '#ffffff',
    foreground: '#020817',
    muted: '#f8fafc',
    border: '#e2e8f0'
  },
  'Professional Green': {
    primary: '#166534',
    secondary: '#f0fdf4',
    accent: '#dcfce7',
    background: '#ffffff',
    foreground: '#052e16',
    muted: '#f7fee7',
    border: '#bbf7d0'
  },
  'Executive Navy': {
    primary: '#1e3a8a',
    secondary: '#f1f5f9',
    accent: '#dbeafe',
    background: '#ffffff',
    foreground: '#1e293b',
    muted: '#f8fafc',
    border: '#cbd5e1'
  },
  'Modern Orange': {
    primary: '#ea580c',
    secondary: '#fff7ed',
    accent: '#fed7aa',
    background: '#ffffff',
    foreground: '#431407',
    muted: '#fef3c7',
    border: '#fdba74'
  },
  'Creative Purple': {
    primary: '#7c3aed',
    secondary: '#faf5ff',
    accent: '#e9d5ff',
    background: '#ffffff',
    foreground: '#581c87',
    muted: '#f3e8ff',
    border: '#c4b5fd'
  }
}

export function SettingsDashboard() {
  const { language, currency, setLanguage, setCurrency, t, direction } = useInternationalization()
  
  const [branding, setBranding] = useState<OrganizationBranding>({
    project_logos: {},
    theme_colors: defaultThemes['Corporate Blue'],
    invoice_template: 'professional',
    email_template: 'modern',
    letterhead_template: 'corporate'
  })
  
  const [selectedTheme, setSelectedTheme] = useState<string>('Corporate Blue')
  const [customTheme, setCustomTheme] = useState<ThemeColors>(defaultThemes['Corporate Blue'])
  const [isCustomTheme, setIsCustomTheme] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('localization')

  const handleThemeChange = (themeName: string) => {
    if (themeName === 'custom') {
      setIsCustomTheme(true)
      setSelectedTheme('custom')
    } else {
      setIsCustomTheme(false)
      setSelectedTheme(themeName)
      const themeColors = defaultThemes[themeName as keyof typeof defaultThemes]
      setBranding(prev => ({ ...prev, theme_colors: themeColors }))
      setCustomTheme(themeColors)
    }
  }

  const handleCustomColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const updatedColors = { ...customTheme, [colorKey]: value }
    setCustomTheme(updatedColors)
    if (isCustomTheme) {
      setBranding(prev => ({ ...prev, theme_colors: updatedColors }))
    }
  }

  const handleLogoUpload = (type: 'organization' | 'project', projectName?: string) => {
    // Simulate file upload
    const mockUrl = `/uploads/logo-${Date.now()}.png`
    if (type === 'organization') {
      setBranding(prev => ({ ...prev, organization_logo: mockUrl }))
    } else if (type === 'project' && projectName) {
      setBranding(prev => ({
        ...prev,
        project_logos: { ...prev.project_logos, [projectName]: mockUrl }
      }))
    }
  }

  const previewData = {
    organization_name: 'JV-Flow Construction',
    organization_logo: branding.organization_logo,
    project_name: 'Metro Heights Tower A',
    project_logo: branding.project_logos['Metro Heights Tower A'],
    theme_colors: branding.theme_colors
  }

  const InvoicePreview = () => (
    <div className="border rounded-lg p-6 bg-white" style={{ color: branding.theme_colors.foreground }}>
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center space-x-4">
          {branding.organization_logo ? (
            <ImageWithFallback 
              src={branding.organization_logo} 
              alt="Organization Logo" 
              className="w-16 h-16 object-contain"
            />
          ) : (
            <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: branding.theme_colors.primary }}>
              <Building2 className="h-8 w-8 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: branding.theme_colors.primary }}>
              {previewData.organization_name}
            </h1>
            <p className="text-sm text-muted-foreground">Real Estate Development</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold" style={{ color: branding.theme_colors.primary }}>INVOICE</h2>
          <p className="text-sm">INV-2024-001</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold mb-2" style={{ color: branding.theme_colors.primary }}>Bill To:</h3>
          <p>ABC Construction Ltd.</p>
          <p>123 Business Street</p>
          <p>Metro City, MC 12345</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2" style={{ color: branding.theme_colors.primary }}>Project:</h3>
          <div className="flex items-center space-x-2">
            {branding.project_logos[previewData.project_name] ? (
              <ImageWithFallback 
                src={branding.project_logos[previewData.project_name]} 
                alt="Project Logo" 
                className="w-8 h-8 object-contain"
              />
            ) : null}
            <span>{previewData.project_name}</span>
          </div>
          <p className="text-sm text-muted-foreground">Installment Payment #3</p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden mb-6">
        <div className="px-4 py-3 font-semibold" style={{ backgroundColor: branding.theme_colors.accent }}>
          <div className="grid grid-cols-4 gap-4">
            <span>Description</span>
            <span>Quantity</span>
            <span>Rate</span>
            <span>Amount</span>
          </div>
        </div>
        <div className="px-4 py-3 border-b">
          <div className="grid grid-cols-4 gap-4">
            <span>Construction Progress Payment</span>
            <span>1</span>
            <span>$125,000.00</span>
            <span>$125,000.00</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b">
            <span>Subtotal:</span>
            <span>$125,000.00</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span>Tax (10%):</span>
            <span>$12,500.00</span>
          </div>
          <div className="flex justify-between py-3 font-semibold text-lg" style={{ color: branding.theme_colors.primary }}>
            <span>Total:</span>
            <span>$137,500.00</span>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>Payment due within 30 days of invoice date</p>
        <p>Thank you for your business!</p>
      </div>
    </div>
  )

  const EmailPreview = () => (
    <div className="border rounded-lg overflow-hidden bg-white">
      <div className="px-6 py-4" style={{ backgroundColor: branding.theme_colors.primary, color: 'white' }}>
        <div className="flex items-center space-x-3">
          {branding.organization_logo ? (
            <ImageWithFallback 
              src={branding.organization_logo} 
              alt="Organization Logo" 
              className="w-12 h-12 object-contain bg-white rounded p-1"
            />
          ) : (
            <div className="w-12 h-12 bg-white rounded flex items-center justify-center">
              <Building2 className="h-6 w-6" style={{ color: branding.theme_colors.primary }} />
            </div>
          )}
          <div>
            <h2 className="text-lg font-semibold">{previewData.organization_name}</h2>
            <p className="text-sm opacity-90">Real Estate Development</p>
          </div>
        </div>
      </div>
      
      <div className="p-6" style={{ color: branding.theme_colors.foreground }}>
        <h3 className="text-xl font-semibold mb-4" style={{ color: branding.theme_colors.primary }}>
          Project Update: {previewData.project_name}
        </h3>
        
        <p className="mb-4">Dear Valued Partner,</p>
        
        <p className="mb-4">
          We are pleased to provide you with an update on the progress of {previewData.project_name}. 
          Our team has successfully completed the foundation phase and is moving forward with the 
          structural work as planned.
        </p>
        
        <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: branding.theme_colors.accent }}>
          <h4 className="font-semibold mb-2" style={{ color: branding.theme_colors.primary }}>
            Key Milestones Achieved:
          </h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Foundation excavation completed</li>
            <li>Concrete pouring finished on schedule</li>
            <li>Quality inspections passed</li>
          </ul>
        </div>
        
        <p className="mb-6">
          Thank you for your continued trust in our services. We look forward to sharing more 
          exciting updates as the project progresses.
        </p>
        
        <div className="text-sm" style={{ color: branding.theme_colors.muted }}>
          <p>Best regards,</p>
          <p className="font-semibold">The {previewData.organization_name} Team</p>
        </div>
      </div>
      
      <div className="px-6 py-3 text-xs text-center" style={{ backgroundColor: branding.theme_colors.muted }}>
        <p>© 2024 {previewData.organization_name}. All rights reserved.</p>
      </div>
    </div>
  )

  const projects = ['Metro Heights Tower A', 'Garden View Residences', 'Corporate Plaza']

  return (
    <div className="space-y-6" dir={direction}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t('settings.title')}</h1>
          <p className="text-muted-foreground">
            {t('settings.description')}
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          {t('settings.saveChanges')}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="localization">{t('settings.localization')}</TabsTrigger>
          <TabsTrigger value="theme">Color Theme</TabsTrigger>
          <TabsTrigger value="logos">Logos & Branding</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="localization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>{t('settings.localization')}</span>
              </CardTitle>
              <CardDescription>
                {t('settings.localizationDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">{t('settings.language')}</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('settings.languageDescription')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(languages).map(([code, info]) => (
                        <SelectItem key={code} value={code}>
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{info.code === 'en' ? '🇺🇸' : info.code === 'ar' ? '🇸🇦' : '🇵🇰'}</span>
                            <div>
                              <div className="font-medium">{info.name}</div>
                              <div className="text-sm text-muted-foreground">{info.nativeName}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.languageDescription')}
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">{t('settings.currency')}</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('settings.currencyDescription')} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currencies).map(([code, info]) => (
                        <SelectItem key={code} value={code}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center space-x-3">
                              <span className="font-mono text-lg">{info.symbol}</span>
                              <div>
                                <div className="font-medium">{info.code}</div>
                                <div className="text-sm text-muted-foreground">{t(`currency.${info.code}`)}</div>
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{info.country}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.currencyDescription')}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-lg border bg-muted/50">
                <h4 className="font-medium mb-3 flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Currency Preview</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Small Amount</div>
                    <div className="font-mono">{currencies[currency].symbol}1,250</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Medium Amount</div>
                    <div className="font-mono">{currencies[currency].symbol}125,000</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Large Amount</div>
                    <div className="font-mono">{currencies[currency].symbol}1,250,000</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Decimal Amount</div>
                    <div className="font-mono">{currencies[currency].symbol}1,250.50</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Color Theme</CardTitle>
              <CardDescription>
                Choose or customize your organization's color scheme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Pre-built Themes</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(defaultThemes).map(([name, colors]) => (
                    <div
                      key={name}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedTheme === name && !isCustomTheme ? 'ring-2 ring-primary' : ''
                      }`}
                      onClick={() => handleThemeChange(name)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium">{name}</span>
                        {selectedTheme === name && !isCustomTheme && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: colors.primary }}
                          title="Primary"
                        />
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: colors.secondary }}
                          title="Secondary"
                        />
                        <div
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: colors.accent }}
                          title="Accent"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      isCustomTheme ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => handleThemeChange('custom')}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">Custom Theme</span>
                      {isCustomTheme && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Create your own</span>
                    </div>
                  </div>
                </div>
              </div>

              {isCustomTheme && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Custom Color Palette</CardTitle>
                    <CardDescription>
                      Define your custom color scheme
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(customTheme).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <Label htmlFor={key} className="text-sm font-medium capitalize">
                            {key.replace('_', ' ')}
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              id={key}
                              type="color"
                              value={value}
                              onChange={(e) => handleCustomColorChange(key as keyof ThemeColors, e.target.value)}
                              className="w-16 h-10 p-1 border rounded cursor-pointer"
                            />
                            <Input
                              value={value}
                              onChange={(e) => handleCustomColorChange(key as keyof ThemeColors, e.target.value)}
                              className="flex-1 text-xs font-mono"
                              placeholder="#000000"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="p-4 rounded-lg" style={{ backgroundColor: branding.theme_colors.accent }}>
                <h4 className="font-medium mb-2" style={{ color: branding.theme_colors.primary }}>
                  Theme Preview
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: branding.theme_colors.primary }}
                    />
                    <span>Primary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: branding.theme_colors.secondary }}
                    />
                    <span>Secondary</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: branding.theme_colors.accent }}
                    />
                    <span>Accent</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: branding.theme_colors.background }}
                    />
                    <span>Background</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Logo</CardTitle>
              <CardDescription>
                Upload your organization's logo for invoices, emails, and marketing materials
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-6">
                  <div className="flex-shrink-0">
                    {branding.organization_logo ? (
                      <div className="relative">
                        <ImageWithFallback 
                          src={branding.organization_logo} 
                          alt="Organization Logo" 
                          className="w-20 h-20 object-contain border rounded-lg p-2"
                        />
                        <Button
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => setBranding(prev => ({ ...prev, organization_logo: undefined }))}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="org-logo">Upload Organization Logo</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="org-logo"
                          type="file"
                          accept="image/*"
                          className="cursor-pointer"
                          onChange={() => handleLogoUpload('organization')}
                        />
                        <Button
                          variant="outline"
                          onClick={() => handleLogoUpload('organization')}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Recommended: PNG or SVG format, max 2MB, minimum 200x200px
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Logos</CardTitle>
              <CardDescription>
                Upload specific logos for individual projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {projects.map((project) => (
                  <div key={project} className="flex items-center space-x-6 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      {branding.project_logos[project] ? (
                        <div className="relative">
                          <ImageWithFallback 
                            src={branding.project_logos[project]} 
                            alt={`${project} Logo`} 
                            className="w-16 h-16 object-contain border rounded-lg p-2"
                          />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                            onClick={() => {
                              const updatedLogos = { ...branding.project_logos }
                              delete updatedLogos[project]
                              setBranding(prev => ({ ...prev, project_logos: updatedLogos }))
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{project}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Project-specific branding for documents and communications
                      </p>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="file"
                          accept="image/*"
                          className="cursor-pointer text-sm"
                          onChange={() => handleLogoUpload('project', project)}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleLogoUpload('project', project)}
                        >
                          <Upload className="mr-2 h-3 w-3" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Template</CardTitle>
                <CardDescription>
                  Choose the layout for your invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select 
                  value={branding.invoice_template} 
                  onValueChange={(value) => setBranding(prev => ({ ...prev, invoice_template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setPreviewTemplate('invoice')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Template</CardTitle>
                <CardDescription>
                  Choose the layout for email communications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select 
                  value={branding.email_template} 
                  onValueChange={(value) => setBranding(prev => ({ ...prev, email_template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">Modern</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="simple">Simple</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setPreviewTemplate('email')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Letterhead Template</CardTitle>
                <CardDescription>
                  Choose the layout for official documents
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select 
                  value={branding.letterhead_template} 
                  onValueChange={(value) => setBranding(prev => ({ ...prev, letterhead_template: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corporate">Corporate</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="contemporary">Contemporary</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setPreviewTemplate('letterhead')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Template Settings</CardTitle>
              <CardDescription>
                Additional settings for document templates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Company Address</Label>
                    <Textarea
                      id="company-address"
                      placeholder="Enter your company address for documents"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tax-details">Tax/Registration Details</Label>
                    <Input
                      id="tax-details"
                      placeholder="Tax ID, GST number, etc."
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact-details">Contact Information</Label>
                    <Textarea
                      id="contact-details"
                      placeholder="Phone, email, website"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank-details">Bank Details</Label>
                    <Input
                      id="bank-details"
                      placeholder="Bank account information for invoices"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Branding Preview</CardTitle>
                <CardDescription>
                  See how your branding will appear across different templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Invoice Template Preview</h4>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Sample
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="scale-75 origin-top-left">
                        <InvoicePreview />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Email Template Preview</h4>
                      <Button variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download Sample
                      </Button>
                    </div>
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="scale-75 origin-top-left max-w-md">
                        <EmailPreview />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {previewTemplate === 'invoice' ? 'Invoice' : 
               previewTemplate === 'email' ? 'Email' : 'Letterhead'} Template Preview
            </DialogTitle>
            <DialogDescription>
              Preview of your {previewTemplate} template with current branding
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {previewTemplate === 'invoice' && <InvoicePreview />}
            {previewTemplate === 'email' && <EmailPreview />}
            {previewTemplate === 'letterhead' && (
              <div className="text-center text-muted-foreground py-8">
                Letterhead template preview will be available here
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}