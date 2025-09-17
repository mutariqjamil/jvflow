import { Button } from './button'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from './dropdown-menu'
import { Globe } from 'lucide-react'
import { useInternationalization, languages, type Language } from '../providers/InternationalizationProvider'

export function LanguageSelector() {
  const { language, setLanguage, t } = useInternationalization()

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t('settings.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {Object.entries(languages).map(([code, info]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => handleLanguageChange(code as Language)}
            className={`cursor-pointer ${language === code ? 'bg-accent' : ''}`}
          >
            <div className="flex items-center space-x-3 w-full">
              <span className="text-lg">
                {info.code === 'en' ? '🇺🇸' : info.code === 'ar' ? '🇸🇦' : '🇵🇰'}
              </span>
              <div className="flex-1">
                <div className="font-medium">{info.name}</div>
                <div className="text-sm text-muted-foreground">{info.nativeName}</div>
              </div>
              {language === code && (
                <div className="w-2 h-2 bg-primary rounded-full" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}