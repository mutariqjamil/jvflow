import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { useInternationalization } from './providers/InternationalizationProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Switch } from './ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { toast } from 'sonner@2.0.3'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Shield, 
  Bell, 
  Globe, 
  Eye, 
  EyeOff,
  Camera,
  Save,
  X
} from 'lucide-react'

interface ProfileSettingsProps {
  onClose?: () => void
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
  const { user, currentOrganization } = useAuth()
  const { t, currentLanguage, setLanguage, currencies, currentCurrency, setCurrency } = useInternationalization()
  
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
    department: user?.department || '',
    jobTitle: user?.jobTitle || '',
    timezone: user?.timezone || 'UTC',
    dateFormat: user?.dateFormat || 'MM/DD/YYYY',
    timeFormat: user?.timeFormat || '12h'
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    expenseAlerts: true,
    projectUpdates: true,
    commissionAlerts: true,
    systemMaintenance: true
  })

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'organization',
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    shareActivityStatus: true
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    allowMultipleSessions: true,
    requirePasswordChange: false
  })

  const handleSaveProfile = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(t('profile.saved_successfully'))
      setIsEditing(false)
    } catch (error) {
      toast.error(t('profile.save_error'))
    }
  }

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [key]: value }))
  }

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSecurityChange = (key: string, value: string | boolean | number) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }))
  }

  const getUserInitials = () => {
    const firstInitial = profileData.firstName?.charAt(0) || ''
    const lastInitial = profileData.lastName?.charAt(0) || ''
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">{t('profile.settings')}</h1>
            <p className="text-muted-foreground">{t('profile.manage_preferences')}</p>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="profile">{t('profile.profile')}</TabsTrigger>
            <TabsTrigger value="notifications">{t('profile.notifications')}</TabsTrigger>
            <TabsTrigger value="privacy">{t('profile.privacy')}</TabsTrigger>
            <TabsTrigger value="security">{t('profile.security')}</TabsTrigger>
            <TabsTrigger value="preferences">{t('profile.preferences')}</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t('profile.personal_information')}
                </CardTitle>
                <CardDescription>
                  {t('profile.personal_info_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.avatar} alt={`${profileData.firstName} ${profileData.lastName}`} />
                    <AvatarFallback className="text-lg">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Camera className="h-4 w-4" />
                      {t('profile.change_photo')}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      {t('profile.photo_requirements')}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t('profile.first_name')}</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t('profile.last_name')}</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('profile.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('profile.phone')}</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Professional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">{t('profile.job_title')}</Label>
                    <Input
                      id="jobTitle"
                      value={profileData.jobTitle}
                      onChange={(e) => setProfileData(prev => ({ ...prev, jobTitle: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">{t('profile.department')}</Label>
                    <Input
                      id="department"
                      value={profileData.department}
                      onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                {/* Address and Bio */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">{t('profile.address')}</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">{t('profile.bio')}</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      disabled={!isEditing}
                      rows={3}
                      placeholder={t('profile.bio_placeholder')}
                    />
                  </div>
                </div>

                {/* Organization Information */}
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4" />
                    <span className="font-medium">{t('profile.organization_info')}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{t('profile.organization')}:</span>
                      <span>{currentOrganization?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('profile.role')}:</span>
                      <Badge variant="secondary">{user?.role}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('profile.member_since')}:</span>
                      <span>{new Date(user?.createdAt || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)}>
                      {t('profile.edit_profile')}
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {t('profile.save_changes')}
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        {t('common.cancel')}
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  {t('profile.notification_preferences')}
                </CardTitle>
                <CardDescription>
                  {t('profile.notification_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t(`profile.notifications.${key}`)}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t(`profile.notifications.${key}_description`)}
                      </p>
                    </div>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {t('profile.privacy_settings')}
                </CardTitle>
                <CardDescription>
                  {t('profile.privacy_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{t('profile.profile_visibility')}</Label>
                  <Select 
                    value={privacySettings.profileVisibility} 
                    onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">{t('profile.visibility_public')}</SelectItem>
                      <SelectItem value="organization">{t('profile.visibility_organization')}</SelectItem>
                      <SelectItem value="team">{t('profile.visibility_team')}</SelectItem>
                      <SelectItem value="private">{t('profile.visibility_private')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {Object.entries(privacySettings).filter(([key]) => key !== 'profileVisibility').map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t(`profile.privacy.${key}`)}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t(`profile.privacy.${key}_description`)}
                      </p>
                    </div>
                    <Switch
                      checked={value as boolean}
                      onCheckedChange={(checked) => handlePrivacyChange(key, checked)}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  {t('profile.security_settings')}
                </CardTitle>
                <CardDescription>
                  {t('profile.security_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Section */}
                <div className="space-y-4">
                  <Label>{t('profile.change_password')}</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">{t('profile.current_password')}</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showPassword ? "text" : "password"}
                          placeholder={t('profile.enter_current_password')}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t('profile.new_password')}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder={t('profile.enter_new_password')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('profile.confirm_password')}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder={t('profile.confirm_new_password')}
                      />
                    </div>
                  </div>
                  <Button variant="outline">
                    {t('profile.update_password')}
                  </Button>
                </div>

                <Separator />

                {/* Security Settings */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('profile.two_factor_auth')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.two_factor_description')}
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSecurityChange('twoFactorAuth', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>{t('profile.session_timeout')}</Label>
                    <Select 
                      value={securitySettings.sessionTimeout.toString()} 
                      onValueChange={(value) => handleSecurityChange('sessionTimeout', parseInt(value))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 {t('profile.minutes')}</SelectItem>
                        <SelectItem value="30">30 {t('profile.minutes')}</SelectItem>
                        <SelectItem value="60">1 {t('profile.hour')}</SelectItem>
                        <SelectItem value="120">2 {t('profile.hours')}</SelectItem>
                        <SelectItem value="480">8 {t('profile.hours')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{t('profile.multiple_sessions')}</Label>
                      <p className="text-sm text-muted-foreground">
                        {t('profile.multiple_sessions_description')}
                      </p>
                    </div>
                    <Switch
                      checked={securitySettings.allowMultipleSessions}
                      onCheckedChange={(checked) => handleSecurityChange('allowMultipleSessions', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  {t('profile.language_region')}
                </CardTitle>
                <CardDescription>
                  {t('profile.language_region_description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{t('profile.language')}</Label>
                    <Select value={currentLanguage} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="ur">اردو</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>{t('profile.currency')}</Label>
                    <Select value={currentCurrency?.code || 'USD'} onValueChange={(code) => {
                      setCurrency(code as Currency)
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.code} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('profile.timezone')}</Label>
                    <Select 
                      value={profileData.timezone} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, timezone: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Europe/Paris">Paris</SelectItem>
                        <SelectItem value="Asia/Dubai">Dubai</SelectItem>
                        <SelectItem value="Asia/Karachi">Karachi</SelectItem>
                        <SelectItem value="Asia/Riyadh">Riyadh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>{t('profile.date_format')}</Label>
                    <Select 
                      value={profileData.dateFormat} 
                      onValueChange={(value) => setProfileData(prev => ({ ...prev, dateFormat: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                        <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t('profile.time_format')}</Label>
                  <Select 
                    value={profileData.timeFormat} 
                    onValueChange={(value) => setProfileData(prev => ({ ...prev, timeFormat: value }))}
                  >
                    <SelectTrigger className="w-full md:w-auto">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12-hour (2:30 PM)</SelectItem>
                      <SelectItem value="24h">24-hour (14:30)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}