import { useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  ArrowLeft, 
  Plus, 
  Upload, 
  Users, 
  Target, 
  Calendar, 
  Mail, 
  MessageSquare, 
  Phone,
  AlertCircle,
  CheckCircle,
  Sparkles,
  FileImage,
  FileVideo,
  Mic
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface MarketingCampaignFormProps {
  onCancel: () => void
  onComplete: (campaignData: any) => void
}

interface Audience {
  id: string
  name: string
  criteria: string
  count: number
  source: 'database' | 'imported' | 'manual'
}

export function MarketingCampaignForm({ onCancel, onComplete }: MarketingCampaignFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [campaignData, setCampaignData] = useState({
    name: '',
    description: '',
    type: '',
    channels: [] as string[],
    audience_id: '',
    schedule_type: 'immediate',
    schedule_date: '',
    schedule_time: '',
    budget: '',
    content: {
      email_subject: '',
      email_content: '',
      whatsapp_message: '',
      sms_message: '',
      social_media_copy: '',
      images: [] as string[],
      videos: [] as string[],
      audio: [] as string[]
    },
    ai_generated: false
  })

  const mockAudiences: Audience[] = [
    {
      id: '1',
      name: 'Recent Inquiries',
      criteria: 'Customers who inquired in last 30 days',
      count: 156,
      source: 'database'
    },
    {
      id: '2', 
      name: 'Active Bookings',
      criteria: 'Customers with confirmed bookings',
      count: 89,
      source: 'database'
    },
    {
      id: '3',
      name: 'Overdue Payments',
      criteria: 'Customers with pending payments',
      count: 23,
      source: 'database'
    },
    {
      id: '4',
      name: 'Premium Leads Import',
      criteria: 'Imported from external lead source',
      count: 234,
      source: 'imported'
    }
  ]

  const campaignTypes = [
    { value: 'launch', label: 'Project Launch', description: 'Announce new project or phase' },
    { value: 'reminder', label: 'Payment Reminder', description: 'Automated payment reminders' },
    { value: 'update', label: 'Progress Update', description: 'Construction and development updates' },
    { value: 'offer', label: 'Special Offer', description: 'Limited time promotions' },
    { value: 'newsletter', label: 'Newsletter', description: 'Regular updates and news' },
    { value: 'event', label: 'Event Invitation', description: 'Site visits, launches, meetings' }
  ]

  const channels = [
    { id: 'email', label: 'Email', icon: Mail, description: 'Rich content, attachments' },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, description: 'Instant messaging, media' },
    { id: 'sms', label: 'SMS', icon: Phone, description: 'Quick notifications, reminders' }
  ]

  const handleChannelToggle = (channelId: string) => {
    setCampaignData(prev => ({
      ...prev,
      channels: prev.channels.includes(channelId)
        ? prev.channels.filter(c => c !== channelId)
        : [...prev.channels, channelId]
    }))
  }

  const generateAIContent = async () => {
    setShowAIAssistant(true)
    
    // Simulate AI content generation
    setTimeout(() => {
      const aiContent = {
        email_subject: `🏠 Exciting Updates on ${campaignData.name || 'Your Dream Project'}`,
        email_content: `Dear Valued Customer,

We're thrilled to share some exciting updates about your investment with us. Our development team has been working tirelessly to ensure your project meets the highest standards of quality and innovation.

Recent Progress:
• Foundation work completed ahead of schedule
• Premium amenities installation in progress  
• Landscaping design finalized with sustainable features

Your unit is progressing beautifully, and we can't wait for you to experience the exceptional living space we're creating together.

For any queries or to schedule a site visit, please don't hesitate to reach out to our team.

Best regards,
JV-Flow Development Team`,
        whatsapp_message: `🏠 *Exciting Project Updates!*

Hi there! 👋

Great news about your investment with us:
✅ Foundation work completed 
🏗️ Premium amenities in progress
🌿 Sustainable landscaping planned

Your dream home is taking shape! 

Want to visit the site? Just reply to schedule.

Team JV-Flow 🏡`,
        sms_message: `🏠 Project Update: Foundation work completed ahead of schedule! Your unit is progressing well. Schedule site visit: Call +91-XXXXXXXXX. - JV Flow Team`
      }

      setCampaignData(prev => ({
        ...prev,
        content: { ...prev.content, ...aiContent },
        ai_generated: true
      }))

      setShowAIAssistant(false)
      toast.success("AI content generated successfully!")
    }, 2000)
  }

  const handleSubmit = () => {
    if (!campaignData.name || !campaignData.type || campaignData.channels.length === 0) {
      toast.error("Please fill in all required fields")
      return
    }

    onComplete(campaignData)
    toast.success("Marketing campaign created successfully!")
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Campaign Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-name">Campaign Name *</Label>
                  <Input
                    id="campaign-name"
                    placeholder="e.g., Q4 Project Launch Campaign"
                    value={campaignData.name}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="campaign-type">Campaign Type *</Label>
                  <Select 
                    value={campaignData.type} 
                    onValueChange={(value) => setCampaignData(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="description">Campaign Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the purpose and goals of this campaign..."
                  value={campaignData.description}
                  onChange={(e) => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Select Communication Channels *</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {channels.map((channel) => {
                  const Icon = channel.icon
                  const isSelected = campaignData.channels.includes(channel.id)
                  return (
                    <Card 
                      key={channel.id} 
                      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
                      onClick={() => handleChannelToggle(channel.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <Icon className="h-5 w-5" />
                          <div>
                            <p className="font-medium">{channel.label}</p>
                            <p className="text-xs text-muted-foreground">{channel.description}</p>
                          </div>
                          {isSelected && <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Target Audience Selection</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockAudiences.map((audience) => (
                  <Card 
                    key={audience.id}
                    className={`cursor-pointer transition-all ${campaignData.audience_id === audience.id ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
                    onClick={() => setCampaignData(prev => ({ ...prev, audience_id: audience.id }))}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium">{audience.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{audience.criteria}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{audience.count} contacts</span>
                            <Badge variant="outline" className="text-xs">
                              {audience.source}
                            </Badge>
                          </div>
                        </div>
                        {campaignData.audience_id === audience.id && (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 p-4 border border-dashed rounded-lg">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="font-medium">Import New Audience</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Upload CSV/Excel file with customer data
                  </p>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Contacts
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Content Creation</h3>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  onClick={generateAIContent}
                  disabled={showAIAssistant}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  {showAIAssistant ? 'Generating...' : 'AI Generate Content'}
                </Button>
              </div>
            </div>

            {showAIAssistant && (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertDescription>
                  AI is generating personalized content for your campaign based on your audience and campaign type...
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-6">
              {campaignData.channels.includes('email') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Subject Line</Label>
                      <Input
                        placeholder="Enter email subject"
                        value={campaignData.content.email_subject}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          content: { ...prev.content, email_subject: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Content</Label>
                      <Textarea
                        placeholder="Enter email content..."
                        value={campaignData.content.email_content}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          content: { ...prev.content, email_content: e.target.value }
                        }))}
                        rows={8}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {campaignData.channels.includes('whatsapp') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      WhatsApp Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>Message Content</Label>
                      <Textarea
                        placeholder="Enter WhatsApp message..."
                        value={campaignData.content.whatsapp_message}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          content: { ...prev.content, whatsapp_message: e.target.value }
                        }))}
                        rows={6}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use *bold*, _italic_, and emoji for better engagement
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {campaignData.channels.includes('sms') && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      SMS Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Label>SMS Message</Label>
                      <Textarea
                        placeholder="Enter SMS content (160 characters recommended)..."
                        value={campaignData.content.sms_message}
                        onChange={(e) => setCampaignData(prev => ({
                          ...prev,
                          content: { ...prev.content, sms_message: e.target.value }
                        }))}
                        rows={4}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Keep it concise for better delivery rates</span>
                        <span>{campaignData.content.sms_message.length}/160</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Media Assets Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Media Assets (AI-Generated Available)</CardTitle>
                  <CardDescription>
                    Upload or generate media content for your campaign
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-dashed rounded-lg p-4 text-center">
                      <FileImage className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Images</p>
                      <p className="text-xs text-muted-foreground mb-3">JPG, PNG up to 10MB</p>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">Upload Images</Button>
                        <Button variant="outline" size="sm" className="bg-gradient-to-r from-purple-50 to-blue-50">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Generate
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-dashed rounded-lg p-4 text-center">
                      <FileVideo className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Videos</p>
                      <p className="text-xs text-muted-foreground mb-3">MP4, MOV up to 100MB</p>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">Upload Videos</Button>
                        <Button variant="outline" size="sm" className="bg-gradient-to-r from-purple-50 to-blue-50">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Generate
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border border-dashed rounded-lg p-4 text-center">
                      <Mic className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">Voice Messages</p>
                      <p className="text-xs text-muted-foreground mb-3">MP3, WAV up to 10MB</p>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm">Record Audio</Button>
                        <Button variant="outline" size="sm" className="bg-gradient-to-r from-purple-50 to-blue-50">
                          <Sparkles className="h-3 w-3 mr-1" />
                          AI Voice
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Schedule & Launch</h3>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Campaign Timing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="immediate"
                      name="schedule"
                      value="immediate"
                      checked={campaignData.schedule_type === 'immediate'}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, schedule_type: e.target.value }))}
                    />
                    <Label htmlFor="immediate">Send Immediately</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="scheduled"
                      name="schedule"
                      value="scheduled"
                      checked={campaignData.schedule_type === 'scheduled'}
                      onChange={(e) => setCampaignData(prev => ({ ...prev, schedule_type: e.target.value }))}
                    />
                    <Label htmlFor="scheduled">Schedule for Later</Label>
                  </div>
                  
                  {campaignData.schedule_type === 'scheduled' && (
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div className="space-y-2">
                        <Label>Date</Label>
                        <Input
                          type="date"
                          value={campaignData.schedule_date}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, schedule_date: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Time</Label>
                        <Input
                          type="time"
                          value={campaignData.schedule_time}
                          onChange={(e) => setCampaignData(prev => ({ ...prev, schedule_time: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Campaign Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Campaign Name:</p>
                    <p className="font-medium">{campaignData.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type:</p>
                    <p className="font-medium capitalize">{campaignData.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Channels:</p>
                    <div className="flex space-x-1">
                      {campaignData.channels.map(channel => (
                        <Badge key={channel} variant="secondary" className="text-xs">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Audience:</p>
                    <p className="font-medium">
                      {mockAudiences.find(a => a.id === campaignData.audience_id)?.name || 'Not selected'}
                    </p>
                  </div>
                </div>
                
                {campaignData.ai_generated && (
                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>
                      This campaign includes AI-generated content optimized for your audience.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onCancel} className="p-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create Marketing Campaign</h1>
              <p className="text-muted-foreground">
                Step {currentStep} of 4: {
                  currentStep === 1 ? 'Basic Information' :
                  currentStep === 2 ? 'Target Audience' :
                  currentStep === 3 ? 'Content Creation' :
                  'Schedule & Launch'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              {step < 4 && (
                <div className={`w-24 h-1 mx-2 ${
                  step < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Content */}
        <div className="bg-card rounded-lg p-6 mb-8">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(prev => prev - 1) : onCancel()}
          >
            {currentStep === 1 ? 'Cancel' : 'Previous'}
          </Button>
          
          <Button
            onClick={() => {
              if (currentStep < 4) {
                setCurrentStep(prev => prev + 1)
              } else {
                handleSubmit()
              }
            }}
            disabled={
              (currentStep === 1 && (!campaignData.name || !campaignData.type || campaignData.channels.length === 0)) ||
              (currentStep === 2 && !campaignData.audience_id)
            }
          >
            {currentStep === 4 ? 'Launch Campaign' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  )
}