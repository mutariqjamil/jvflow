import { useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Switch } from '../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { AlertCircle, Mail, MessageSquare, Calendar, FileText, Send, Settings, Zap, Phone, Download } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface AutomationRule {
  id: string
  name: string
  trigger: 'days_before_due' | 'on_due_date' | 'days_after_due' | 'milestone_reached'
  trigger_value: number
  channels: ('email' | 'whatsapp' | 'sms')[]
  template_id: string
  active: boolean
  last_run: string
  next_run: string
}

interface CommunicationTemplate {
  id: string
  name: string
  type: 'invoice' | 'reminder' | 'welcome' | 'milestone' | 'payment_received'
  channel: 'email' | 'whatsapp' | 'sms'
  subject?: string
  content: string
  variables: string[]
  created_date: string
}

interface CommunicationLog {
  id: string
  customer_name: string
  customer_contact: string
  channel: 'email' | 'whatsapp' | 'sms'
  template_name: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  sent_date: string
  invoice_number?: string
  message_content: string
}

export function AutoInvoiceSystemDashboard() {
  const [activeTab, setActiveTab] = useState('automation')
  const [showTemplateEditor, setShowTemplateEditor] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<CommunicationTemplate | null>(null)

  // Mock data
  const mockAutomationRules: AutomationRule[] = [
    {
      id: '1',
      name: 'Invoice Generation & Send',
      trigger: 'days_before_due',
      trigger_value: 7,
      channels: ['email', 'whatsapp'],
      template_id: 'invoice_template',
      active: true,
      last_run: '2024-01-20 09:00',
      next_run: '2024-01-21 09:00'
    },
    {
      id: '2',
      name: 'Payment Reminder',
      trigger: 'on_due_date',
      trigger_value: 0,
      channels: ['email', 'whatsapp', 'sms'],
      template_id: 'reminder_template',
      active: true,
      last_run: '2024-01-20 10:00',
      next_run: '2024-01-21 10:00'
    },
    {
      id: '3',
      name: 'Overdue Notice',
      trigger: 'days_after_due',
      trigger_value: 3,
      channels: ['email', 'sms'],
      template_id: 'overdue_template',
      active: true,
      last_run: '2024-01-19 11:00',
      next_run: '2024-01-22 11:00'
    }
  ]

  const mockTemplates: CommunicationTemplate[] = [
    {
      id: 'invoice_template',
      name: 'Invoice Generation Template',
      type: 'invoice',
      channel: 'email',
      subject: 'Invoice #{invoice_number} - {unit_name}',
      content: `Dear {customer_name},

Please find attached your invoice #{invoice_number} for {unit_name}.

Amount Due: ₹{amount}
Due Date: {due_date}

Payment can be made through:
- Bank Transfer: Account Details Attached
- Online Payment: {payment_link}
- Visit our office

For any queries, please contact us at +91 9876543210.

Best regards,
JV-Flow Team`,
      variables: ['customer_name', 'invoice_number', 'unit_name', 'amount', 'due_date', 'payment_link'],
      created_date: '2024-01-15'
    },
    {
      id: 'reminder_template',
      name: 'Payment Reminder Template',
      type: 'reminder',
      channel: 'whatsapp',
      content: `🏠 *JV-Flow Real Estate*

Hi {customer_name},

This is a gentle reminder that your payment for {unit_name} is due today.

💰 Amount: ₹{amount}
📅 Due Date: {due_date}
📄 Invoice: {invoice_number}

Pay now: {payment_link}

For assistance: +91 9876543210`,
      variables: ['customer_name', 'unit_name', 'amount', 'due_date', 'invoice_number', 'payment_link'],
      created_date: '2024-01-15'
    }
  ]

  const mockCommunicationLogs: CommunicationLog[] = [
    {
      id: '1',
      customer_name: 'Rajesh Kumar',
      customer_contact: 'rajesh@email.com',
      channel: 'email',
      template_name: 'Invoice Generation Template',
      status: 'delivered',
      sent_date: '2024-01-20 09:15',
      invoice_number: 'INV-2024-001',
      message_content: 'Invoice #INV-2024-001 - 2BHK Premium - A101'
    },
    {
      id: '2',
      customer_name: 'Anita Verma',
      customer_contact: '+91 9876543211',
      channel: 'whatsapp',
      template_name: 'Payment Reminder Template',
      status: 'sent',
      sent_date: '2024-01-20 10:30',
      invoice_number: 'INV-2024-002',
      message_content: 'Payment reminder for 3BHK Deluxe - B205'
    }
  ]

  const TemplateEditor = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Template Name</Label>
          <Input placeholder="Enter template name" />
        </div>
        <div className="space-y-2">
          <Label>Template Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="invoice">Invoice</SelectItem>
              <SelectItem value="reminder">Payment Reminder</SelectItem>
              <SelectItem value="welcome">Welcome Message</SelectItem>
              <SelectItem value="milestone">Milestone Update</SelectItem>
              <SelectItem value="payment_received">Payment Confirmation</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Channel</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Subject (Email only)</Label>
          <Input placeholder="Email subject" />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Message Content</Label>
        <Textarea 
          className="min-h-[200px]" 
          placeholder="Enter your message content. Use variables like {customer_name}, {amount}, {due_date}"
        />
      </div>

      <div className="space-y-2">
        <Label>Available Variables</Label>
        <div className="flex flex-wrap gap-2">
          {['customer_name', 'unit_name', 'amount', 'due_date', 'invoice_number', 'payment_link', 'project_name'].map((variable) => (
            <Badge key={variable} variant="secondary" className="cursor-pointer">
              {`{${variable}}`}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setShowTemplateEditor(false)}>
          Cancel
        </Button>
        <Button onClick={() => {
          toast.success("Template saved successfully!")
          setShowTemplateEditor(false)
        }}>
          Save Template
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Auto Invoice & Communication</h1>
          <p className="text-muted-foreground">
            Automated invoice generation and multi-channel customer communication
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowTemplateEditor(true)}>
            <FileText className="h-4 w-4 mr-2" />
            New Template
          </Button>
          <Button onClick={() => {
            toast.success("Manual communication sent successfully!")
          }}>
            <Zap className="h-4 w-4 mr-2" />
            Send Manual
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Auto Invoices Sent</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Mail className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Emails Delivered</p>
                <p className="text-2xl font-bold">142</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">WhatsApp Sent</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Phone className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">SMS Sent</p>
                <p className="text-2xl font-bold">34</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="automation">Automation Rules</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="logs">Communication Logs</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Channels</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Run</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAutomationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{rule.trigger.replace('_', ' ')}</div>
                          <div className="text-muted-foreground">
                            {rule.trigger_value > 0 ? `${rule.trigger_value} days` : 'Same day'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          {rule.channels.map((channel) => (
                            <Badge key={channel} variant="secondary" className="text-xs">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch checked={rule.active} />
                          <span className={rule.active ? 'text-green-600' : 'text-gray-500'}>
                            {rule.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {rule.last_run}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {rule.next_run}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.info("Editing automation rule: " + rule.name)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.success("Automation rule executed manually: " + rule.name)}
                          >
                            <Zap className="h-4 w-4" />
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
          {showTemplateEditor ? (
            <Card>
              <CardHeader>
                <CardTitle>Template Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <TemplateEditor />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Communication Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockTemplates.map((template) => (
                    <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{template.name}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{template.type}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {template.channel}
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
                            Created: {template.created_date}
                          </span>
                          <div className="flex space-x-1">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedTemplate(template)
                                setShowTemplateEditor(true)
                              }}
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.success("Template copied successfully!")}
                            >
                              Copy
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Channel</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sent Date</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockCommunicationLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.customer_name}</TableCell>
                      <TableCell>{log.customer_contact}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {log.channel}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.template_name}</TableCell>
                      <TableCell>
                        <Badge className={
                          log.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          log.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                          log.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {log.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{log.sent_date}</TableCell>
                      <TableCell className="text-sm">{log.invoice_number || '-'}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.info("Viewing communication details for: " + log.customer_name)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.success("Message resent to: " + log.customer_name)}
                          >
                            <Send className="h-4 w-4" />
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

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>SMTP Server</Label>
                  <Input placeholder="smtp.gmail.com" />
                </div>
                <div className="space-y-2">
                  <Label>SMTP Port</Label>
                  <Input placeholder="587" />
                </div>
                <div className="space-y-2">
                  <Label>Email Username</Label>
                  <Input placeholder="your-email@domain.com" />
                </div>
                <div className="space-y-2">
                  <Label>Email Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button onClick={() => toast.success("Email connection test successful!")}>
                  Test Email Connection
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>WhatsApp Business API Token</Label>
                  <Input placeholder="Enter API token" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number ID</Label>
                  <Input placeholder="Phone number ID" />
                </div>
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input placeholder="https://your-domain.com/webhook" />
                </div>
                <Button onClick={() => toast.success("WhatsApp connection test successful!")}>
                  Test WhatsApp Connection
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SMS Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>SMS Provider</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="textlocal">TextLocal</SelectItem>
                      <SelectItem value="msg91">MSG91</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input placeholder="Enter API key" />
                </div>
                <div className="space-y-2">
                  <Label>Sender ID</Label>
                  <Input placeholder="JVFLOW" />
                </div>
                <Button onClick={() => toast.success("SMS connection test successful!")}>
                  Test SMS Connection
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Invoice Generation</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically generate invoices before due date
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto Send Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Send automatic payment reminders
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Invoice Generation Days Before Due</Label>
                  <Input type="number" placeholder="7" />
                </div>
                <div className="space-y-2">
                  <Label>Default Payment Link</Label>
                  <Input placeholder="https://payments.jvflow.com" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}