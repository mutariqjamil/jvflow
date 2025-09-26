import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog'
import { Switch } from '../ui/switch'
import { Separator } from '../ui/separator'
import { Mail, MessageSquare, Video, FileText, Image, Upload, Send, Eye, Edit, Trash2, Users, Calendar, Target, TrendingUp } from 'lucide-react'
import { MarketingCampaignForm } from '../forms/MarketingCampaignForm'
import { toast } from 'sonner@2.0.3'

interface Campaign {
  id: string
  name: string
  type: 'email' | 'whatsapp' | 'sms'
  subject?: string
  content: string
  target_audience: string
  scheduled_date: string
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  recipients_count: number
  sent_count?: number
  opened_count?: number
  clicked_count?: number
  created_date: string
  attachments: string[]
  videos: string[]
}

interface Template {
  id: string
  name: string
  category: 'promotional' | 'informational' | 'welcome' | 'reminder' | 'announcement'
  type: 'email' | 'whatsapp' | 'sms'
  subject?: string
  content: string
  thumbnail: string
  variables: string[]
  usage_count: number
  created_date: string
}

interface ContactGroup {
  id: string
  name: string
  description: string
  contact_count: number
  criteria: string
  created_date: string
}

export function MarketingCommunicationDashboard() {
  const [activeTab, setActiveTab] = useState('campaigns')
  const [showCampaignBuilder, setShowCampaignBuilder] = useState(false)
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false)
  const [showFullCampaignForm, setShowFullCampaignForm] = useState(false)
  const [selectedCampaignType, setSelectedCampaignType] = useState<'email' | 'whatsapp' | 'sms'>('email')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Mock data
  const mockCampaigns: Campaign[] = [
    {
      id: '1',
      name: 'New Project Launch - Sunset Gardens',
      type: 'email',
      subject: '🏠 Introducing Sunset Gardens - Premium 2&3BHK Apartments',
      content: 'Dear Valued Customer, We are excited to announce the launch of our newest project...',
      target_audience: 'All Prospects',
      scheduled_date: '2024-01-25 10:00',
      status: 'scheduled',
      recipients_count: 1250,
      created_date: '2024-01-20',
      attachments: ['brochure.pdf', 'floor_plans.pdf'],
      videos: ['project_walkthrough.mp4']
    },
    {
      id: '2',
      name: 'Payment Reminder Campaign',
      type: 'whatsapp',
      content: '🏠 Hi {customer_name}, This is a friendly reminder about your upcoming payment...',
      target_audience: 'Due Payments',
      scheduled_date: '2024-01-22 09:00',
      status: 'sent',
      recipients_count: 45,
      sent_count: 45,
      opened_count: 42,
      clicked_count: 38,
      created_date: '2024-01-21',
      attachments: [],
      videos: []
    },
    {
      id: '3',
      name: 'Festival Greetings',
      type: 'email',
      subject: '🎉 Festival Wishes from JV-Flow Team',
      content: 'Wishing you and your family a very happy festival...',
      target_audience: 'All Customers',
      scheduled_date: '2024-01-15 08:00',
      status: 'sent',
      recipients_count: 850,
      sent_count: 850,
      opened_count: 680,
      clicked_count: 120,
      created_date: '2024-01-14',
      attachments: ['festival_offers.pdf'],
      videos: []
    }
  ]

  const mockTemplates: Template[] = [
    {
      id: '1',
      name: 'Project Launch Email',
      category: 'promotional',
      type: 'email',
      subject: '🏠 New Project Launch - {project_name}',
      content: 'Dear {customer_name}, We are excited to announce the launch of {project_name}...',
      thumbnail: '/templates/project_launch.jpg',
      variables: ['customer_name', 'project_name', 'location', 'pricing'],
      usage_count: 12,
      created_date: '2024-01-10'
    },
    {
      id: '2',
      name: 'Payment Due WhatsApp',
      category: 'reminder',
      type: 'whatsapp',
      content: '🏠 *JV-Flow Real Estate*\n\nHi {customer_name},\n\nYour payment of ₨{amount} for {unit_name} is due on {due_date}...',
      thumbnail: '/templates/payment_reminder.jpg',
      variables: ['customer_name', 'amount', 'unit_name', 'due_date'],
      usage_count: 45,
      created_date: '2024-01-08'
    }
  ]

  const mockContactGroups: ContactGroup[] = [
    {
      id: '1',
      name: 'All Prospects',
      description: 'All potential customers who have shown interest',
      contact_count: 1250,
      criteria: 'Lead status = Prospect',
      created_date: '2024-01-01'
    },
    {
      id: '2',
      name: 'Due Payments',
      description: 'Customers with upcoming or overdue payments',
      contact_count: 45,
      criteria: 'Payment due within 7 days',
      created_date: '2024-01-15'
    },
    {
      id: '3',
      name: 'VIP Customers',
      description: 'High-value customers and investors',
      contact_count: 78,
      criteria: 'Purchase value > 50 Lakhs',
      created_date: '2024-01-10'
    }
  ]

  const CampaignBuilder = () => (
    <Dialog open={showCampaignBuilder} onOpenChange={setShowCampaignBuilder}>
      <DialogContent className="max-w-6xl">
        <DialogHeader>
          <DialogTitle>Create New Campaign</DialogTitle>
          <DialogDescription>
            Create a new marketing campaign to send emails, WhatsApp messages, or SMS to your target audience.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="design">Design</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>
          
          <TabsContent value="setup" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Campaign Name *</Label>
                <Input placeholder="Enter campaign name" />
              </div>
              <div className="space-y-2">
                <Label>Campaign Type *</Label>
                <Select value={selectedCampaignType} onValueChange={(value: any) => setSelectedCampaignType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email Campaign</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp Campaign</SelectItem>
                    <SelectItem value="sms">SMS Campaign</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {selectedCampaignType === 'email' && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Email Subject *</Label>
                  <Input placeholder="Enter email subject" />
                </div>
              )}
              <div className="space-y-2 md:col-span-2">
                <Label>Campaign Description</Label>
                <Textarea placeholder="Describe the purpose of this campaign" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="design" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Message Content *</Label>
                  <Textarea 
                    className="min-h-[300px]" 
                    placeholder="Enter your message content. Use variables like {customer_name}, {project_name}, etc."
                  />
                </div>
                
                <div className="space-y-3">
                  <Label>Available Variables</Label>
                  <div className="flex flex-wrap gap-2">
                    {['customer_name', 'project_name', 'unit_name', 'amount', 'due_date', 'contact_number'].map((variable) => (
                      <Badge key={variable} variant="secondary" className="cursor-pointer text-xs">
                        {`{${variable}}`}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Attachments</Label>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Add Documents
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Add Videos
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                    <input
                      ref={videoInputRef}
                      type="file"
                      multiple
                      accept=".mp4,.avi,.mov"
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 bg-muted/30">
                  <h3 className="font-medium mb-3">Preview</h3>
                  <div className="bg-white rounded border p-4 min-h-[300px]">
                    {selectedCampaignType === 'email' && (
                      <div className="space-y-3">
                        <div className="border-b pb-2">
                          <div className="text-sm text-muted-foreground">Subject:</div>
                          <div className="font-medium">🏠 New Project Launch - {'{project_name}'}</div>
                        </div>
                        <div className="text-sm">
                          Dear {'{customer_name}'},<br/><br/>
                          We are excited to announce the launch of our newest project...
                        </div>
                      </div>
                    )}
                    {selectedCampaignType === 'whatsapp' && (
                      <div className="bg-green-50 rounded-lg p-3">
                        <div className="text-sm">
                          🏠 <strong>JV-Flow Real Estate</strong><br/><br/>
                          Hi {'{customer_name}'},<br/><br/>
                          We are excited to announce...
                        </div>
                      </div>
                    )}
                    {selectedCampaignType === 'sms' && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="text-sm">
                          JV-Flow: Hi {'{customer_name}'}, we are excited to announce our new project launch...
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Use Template</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockTemplates
                        .filter(template => template.type === selectedCampaignType)
                        .map(template => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="audience" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label>Target Audience *</Label>
                <div className="mt-2 space-y-2">
                  {mockContactGroups.map((group) => (
                    <div key={group.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input type="checkbox" id={group.id} className="rounded" />
                      <div className="flex-1">
                        <label htmlFor={group.id} className="font-medium cursor-pointer">
                          {group.name}
                        </label>
                        <p className="text-sm text-muted-foreground">{group.description}</p>
                        <p className="text-xs text-muted-foreground">{group.contact_count} contacts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h3 className="font-medium mb-2">Estimated Reach</h3>
                <p className="text-2xl font-bold">1,250 contacts</p>
                <p className="text-sm text-muted-foreground">Based on selected audience groups</p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="schedule" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Send Option</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select send option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Send Now</SelectItem>
                    <SelectItem value="scheduled">Schedule for Later</SelectItem>
                    <SelectItem value="draft">Save as Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Schedule Date & Time</Label>
                <Input type="datetime-local" />
              </div>
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IST">IST (India Standard Time)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="tracking" />
              <Label htmlFor="tracking">Enable click and open tracking</Label>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Campaign Summary</h3>
              <div className="space-y-1 text-sm">
                <p><strong>Type:</strong> {selectedCampaignType} Campaign</p>
                <p><strong>Recipients:</strong> 1,250 contacts</p>
                <p><strong>Estimated Cost:</strong> ₨250 (₨0.20 per message)</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowCampaignBuilder(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            toast.success("Campaign created successfully!")
            setShowCampaignBuilder(false)
          }}>
            Create Campaign
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketing Communication</h1>
          <p className="text-muted-foreground">
            Create and manage email, WhatsApp, and SMS campaigns
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => {
            toast.success("Template builder opened!")
            setShowTemplateBuilder(true)
          }}>
            <FileText className="h-4 w-4 mr-2" />
            New Template
          </Button>
          <Button onClick={() => setShowFullCampaignForm(true)}>
            <Send className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Send className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Campaigns Sent</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reach</p>
                <p className="text-2xl font-bold">12.5K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Rate</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
                <p className="text-2xl font-bold">23%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="audience">Audience Groups</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Marketing Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Campaign Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCampaigns.map((campaign) => (
                    <TableRow key={campaign.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.type === 'email' ? campaign.subject : campaign.content.substring(0, 50) + '...'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          <div className="flex items-center space-x-1">
                            {campaign.type === 'email' && <Mail className="h-3 w-3" />}
                            {campaign.type === 'whatsapp' && <MessageSquare className="h-3 w-3" />}
                            {campaign.type === 'sms' && <MessageSquare className="h-3 w-3" />}
                            <span>{campaign.type}</span>
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.target_audience}</TableCell>
                      <TableCell>{campaign.recipients_count.toLocaleString()}</TableCell>
                      <TableCell>
                        {campaign.status === 'sent' && (
                          <div className="text-sm">
                            <div>Open: {campaign.opened_count}/{campaign.sent_count}</div>
                            <div>Click: {campaign.clicked_count}/{campaign.sent_count}</div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          campaign.status === 'sent' ? 'bg-green-100 text-green-800' :
                          campaign.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          campaign.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.info("Viewing campaign: " + campaign.name)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.info("Editing campaign: " + campaign.name)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.success("Campaign deleted: " + campaign.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Message Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{template.category}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          <div className="flex items-center space-x-1">
                            {template.type === 'email' && <Mail className="h-3 w-3" />}
                            {template.type === 'whatsapp' && <MessageSquare className="h-3 w-3" />}
                            {template.type === 'sms' && <MessageSquare className="h-3 w-3" />}
                            <span>{template.type}</span>
                          </div>
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-3 line-clamp-3">
                        {template.subject && (
                          <div className="font-medium mb-1">Subject: {template.subject}</div>
                        )}
                        {template.content.substring(0, 100)}...
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Used {template.usage_count} times
                        </span>
                        <div className="flex space-x-1">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              toast.success("Template editor opened for: " + template.name)
                              setShowTemplateBuilder(true)
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.success("Template applied to new campaign")}
                          >
                            Use
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Groups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockContactGroups.map((group) => (
                  <Card key={group.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{group.name}</h3>
                          <p className="text-sm text-muted-foreground">{group.description}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Contacts:</span>
                          <Badge variant="secondary">{group.contact_count.toLocaleString()}</Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Criteria: {group.criteria}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created: {group.created_date}
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-3">
                        <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                        <Button variant="outline" size="sm" className="flex-1">Export</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Email Open Rate</span>
                    <span className="font-medium">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>WhatsApp Read Rate</span>
                    <span className="font-medium">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>SMS Delivery Rate</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockCampaigns.filter(c => c.status === 'sent').map((campaign) => (
                    <div key={campaign.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-medium text-sm">{campaign.name}</div>
                        <div className="text-xs text-muted-foreground">{campaign.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {campaign.opened_count && campaign.sent_count 
                            ? `${Math.round((campaign.opened_count / campaign.sent_count) * 100)}%`
                            : 'N/A'
                          }
                        </div>
                        <div className="text-xs text-muted-foreground">Open Rate</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <CampaignBuilder />
      
      {showFullCampaignForm && (
        <MarketingCampaignForm
          onCancel={() => setShowFullCampaignForm(false)}
          onComplete={(campaignData) => {
            console.log('Campaign created:', campaignData)
            setShowFullCampaignForm(false)
            toast.success("Marketing campaign created successfully!")
          }}
        />
      )}
    </div>
  )
}