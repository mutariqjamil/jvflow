import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog'
import { FileText, Download, Send, Eye, Calendar, AlertCircle } from 'lucide-react'
import { formatCurrency } from '../config/currency'
import { toast } from 'sonner@2.0.3'

interface Invoice {
  id: string
  booking_id: string
  installment_id: string
  invoice_number: string
  customer_name: string
  unit_name: string
  milestone: string
  amount: number
  due_date: string
  generated_date: string
  status: 'generated' | 'sent' | 'paid' | 'overdue'
  payment_received?: boolean
  auto_generated: boolean
}

export function InvoiceManager() {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [showInvoicePreview, setShowInvoicePreview] = useState(false)

  // Mock invoice data
  const mockInvoices: Invoice[] = [
    {
      id: '1',
      booking_id: '1',
      installment_id: '1',
      invoice_number: 'INV-2024-001',
      customer_name: 'Rajesh Kumar',
      unit_name: '2BHK Premium - A101',
      milestone: 'Booking Amount',
      amount: 550000,
      due_date: '2024-01-15',
      generated_date: '2024-01-10',
      status: 'paid',
      payment_received: true,
      auto_generated: true
    },
    {
      id: '2',
      booking_id: '1',
      installment_id: '2',
      invoice_number: 'INV-2024-002',
      customer_name: 'Rajesh Kumar',
      unit_name: '2BHK Premium - A101',
      milestone: 'Registration',
      amount: 269500,
      due_date: '2024-02-15',
      generated_date: '2024-02-10',
      status: 'sent',
      payment_received: false,
      auto_generated: true
    },
    {
      id: '3',
      booking_id: '2',
      installment_id: '3',
      invoice_number: 'INV-2024-003',
      customer_name: 'Anita Verma',
      unit_name: '3BHK Deluxe - B205',
      milestone: 'Foundation Complete',
      amount: 1080000,
      due_date: '2024-03-01',
      generated_date: '2024-02-25',
      status: 'generated',
      payment_received: false,
      auto_generated: true
    }
  ]

  const generateInvoice = (installmentId: string) => {
    toast.success("Invoice generated successfully!", {
      description: "Invoice has been generated and is ready to send."
    })
  }

  const sendInvoice = (invoiceId: string) => {
    toast.success("Invoice sent successfully!", {
      description: "Invoice has been sent to customer via email."
    })
  }

  const downloadInvoice = (invoiceId: string) => {
    toast.success("Invoice downloaded!", {
      description: "Invoice PDF has been downloaded."
    })
  }

  const InvoicePreviewDialog = () => (
    <Dialog open={showInvoicePreview} onOpenChange={setShowInvoicePreview}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Invoice Preview - {selectedInvoice?.invoice_number}</DialogTitle>
          <DialogDescription>
            Preview invoice details and send to customer or download as PDF.
          </DialogDescription>
        </DialogHeader>
        
        {selectedInvoice && (
          <div className="space-y-6">
            {/* Invoice Header */}
            <div className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">JV-Flow Real Estate</h2>
                  <p className="text-muted-foreground">Project: Sunset Gardens</p>
                  <p className="text-muted-foreground">Mumbai, Maharashtra</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xl font-bold">{selectedInvoice.invoice_number}</h3>
                  <p className="text-muted-foreground">Generated: {selectedInvoice.generated_date}</p>
                  <p className="text-muted-foreground">Due Date: {selectedInvoice.due_date}</p>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Bill To:</h4>
                <p className="font-medium">{selectedInvoice.customer_name}</p>
                <p className="text-muted-foreground">Customer Address</p>
                <p className="text-muted-foreground">Mumbai, Maharashtra</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Property Details:</h4>
                <p className="font-medium">{selectedInvoice.unit_name}</p>
                <p className="text-muted-foreground">Milestone: {selectedInvoice.milestone}</p>
              </div>
            </div>

            {/* Invoice Items */}
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{selectedInvoice.milestone} - {selectedInvoice.unit_name}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(selectedInvoice.amount)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Total Amount</TableCell>
                    <TableCell className="font-medium text-lg">{formatCurrency(selectedInvoice.amount)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Payment Instructions */}
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Payment Instructions:</h4>
              <p className="text-sm text-muted-foreground">
                Please make payment through bank transfer or visit our office. 
                Kindly mention the invoice number as reference.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => downloadInvoice(selectedInvoice.id)}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button onClick={() => sendInvoice(selectedInvoice.id)}>
                <Send className="h-4 w-4 mr-2" />
                Send to Customer
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Invoices</p>
                <p className="text-2xl font-bold">124</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Auto Generated</p>
                <p className="text-2xl font-bold">98</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Send className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Payment</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice Number</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Milestone</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <span>{invoice.invoice_number}</span>
                      {invoice.auto_generated && (
                        <Badge variant="secondary" className="text-xs">Auto</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{invoice.customer_name}</TableCell>
                  <TableCell>{invoice.unit_name}</TableCell>
                  <TableCell>{invoice.milestone}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>{invoice.due_date}</TableCell>
                  <TableCell>
                    <Badge className={
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedInvoice(invoice)
                          setShowInvoicePreview(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.status !== 'paid' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => sendInvoice(invoice.id)}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <InvoicePreviewDialog />
    </div>
  )
}