import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { AlertCircle, Calendar, CreditCard, FileText, Plus, Receipt, Target, TrendingUp, User, Download } from 'lucide-react'
import { toast } from 'sonner@2.0.3'
import { useInternationalization } from '../providers/InternationalizationProvider'

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface UnitBooking {
  id: string
  unit_id: string
  unit_name: string
  unit_type: string
  customer: Customer
  total_amount: number
  booking_date: string
  installment_plan_id: string
  installment_plan_name: string
  sales_agent: string
  status: 'booked' | 'registered' | 'cancelled' | 'completed'
  discount_applied: number
  final_amount: number
}

interface InstallmentSchedule {
  id: string
  booking_id: string
  milestone: string
  amount: number
  due_date: string
  status: 'pending' | 'paid' | 'overdue'
  invoice_generated: boolean
  invoice_id?: string
}

interface Payment {
  id: string
  booking_id: string
  installment_id: string
  amount: number
  payment_date: string
  payment_method: 'cash' | 'cheque' | 'bank_transfer' | 'upi'
  reference_number: string
  received_by: string
  status: 'in_transit' | 'realized' | 'bounced'
  receipt_number: string
}

interface SalesTarget {
  agent_name: string
  monthly_target: number
  achieved_amount: number
  bookings_count: number
  commission_earned: number
}

export function BookingDashboard() {
  const { t, formatCurrency } = useInternationalization()
  const [activeTab, setActiveTab] = useState('bookings')
  const [showNewBooking, setShowNewBooking] = useState(false)
  const [showPaymentEntry, setShowPaymentEntry] = useState(false)
  const [showBookingDetails, setShowBookingDetails] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<UnitBooking | null>(null)

  // Mock data
  const mockBookings: UnitBooking[] = [
    {
      id: '1',
      unit_id: 'A101',
      unit_name: '2BHK Premium - A101',
      unit_type: 'flat',
      customer: {
        id: '1',
        name: 'Rajesh Kumar',
        email: 'rajesh@email.com',
        phone: '+91 9876543210',
        address: 'Mumbai, Maharashtra'
      },
      total_amount: 5500000,
      booking_date: '2024-01-15',
      installment_plan_id: '1',
      installment_plan_name: 'Standard Plan - 24 Months',
      sales_agent: 'Priya Sharma',
      status: 'booked',
      discount_applied: 2,
      final_amount: 5390000
    },
    {
      id: '2',
      unit_id: 'B205',
      unit_name: '3BHK Deluxe - B205',
      unit_type: 'flat',
      customer: {
        id: '2',
        name: 'Anita Verma',
        email: 'anita@email.com',
        phone: '+91 9876543211',
        address: 'Pune, Maharashtra'
      },
      total_amount: 7200000,
      booking_date: '2024-01-20',
      installment_plan_id: '2',
      installment_plan_name: 'Quick Payment - 12 Months',
      sales_agent: 'Rohit Patel',
      status: 'registered',
      discount_applied: 1.5,
      final_amount: 7092000
    }
  ]

  const mockInstallments: InstallmentSchedule[] = [
    {
      id: '1',
      booking_id: '1',
      milestone: 'Booking Amount',
      amount: 550000,
      due_date: '2024-01-15',
      status: 'paid',
      invoice_generated: true,
      invoice_id: 'INV-001'
    },
    {
      id: '2',
      booking_id: '1',
      milestone: 'Registration',
      amount: 269500,
      due_date: '2024-02-15',
      status: 'pending',
      invoice_generated: true,
      invoice_id: 'INV-002'
    },
    {
      id: '3',
      booking_id: '1',
      milestone: 'Foundation Complete',
      amount: 808500,
      due_date: '2024-07-15',
      status: 'pending',
      invoice_generated: false
    }
  ]

  const mockPayments: Payment[] = [
    {
      id: '1',
      booking_id: '1',
      installment_id: '1',
      amount: 550000,
      payment_date: '2024-01-15',
      payment_method: 'bank_transfer',
      reference_number: 'TXN123456789',
      received_by: 'Priya Sharma',
      status: 'realized',
      receipt_number: 'RCP-001'
    }
  ]

  const mockSalesTargets: SalesTarget[] = [
    {
      agent_name: 'Priya Sharma',
      monthly_target: 10000000,
      achieved_amount: 5390000,
      bookings_count: 1,
      commission_earned: 107800
    },
    {
      agent_name: 'Rohit Patel',
      monthly_target: 8000000,
      achieved_amount: 7092000,
      bookings_count: 1,
      commission_earned: 141840
    }
  ]

  const NewBookingDialog = () => (
    <Dialog open={showNewBooking} onOpenChange={setShowNewBooking}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('bookings.newUnitBooking')}</DialogTitle>
          <DialogDescription>
            {t('bookings.newBookingDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="customer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer">{t('bookings.customerDetails')}</TabsTrigger>
            <TabsTrigger value="unit">{t('bookings.unitSelection')}</TabsTrigger>
            <TabsTrigger value="payment">{t('bookings.paymentPlan')}</TabsTrigger>
            <TabsTrigger value="confirm">{t('bookings.confirmation')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t('bookings.customerName')} *</Label>
                <Input placeholder={t('bookings.fullName')} />
              </div>
              <div className="space-y-2">
                <Label>{t('bookings.email')} *</Label>
                <Input type="email" placeholder="customer@email.com" />
              </div>
              <div className="space-y-2">
                <Label>{t('bookings.phoneNumber')} *</Label>
                <Input placeholder="+92 300 1234567" />
              </div>
              <div className="space-y-2">
                <Label>{t('bookings.address')}</Label>
                <Input placeholder={t('bookings.completeAddress')} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="unit" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Unit Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2bhk">2BHK Premium</SelectItem>
                    <SelectItem value="3bhk">3BHK Deluxe</SelectItem>
                    <SelectItem value="4bhk">4BHK Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Available Units</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a101">A101 - 2nd Floor</SelectItem>
                    <SelectItem value="a102">A102 - 2nd Floor</SelectItem>
                    <SelectItem value="b201">B201 - 3rd Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Area (sq ft)</Label>
                <Input value="1200" disabled />
              </div>
              <div className="space-y-2">
                <Label>Rate per sq ft</Label>
                <Input value={formatCurrency(4500)} disabled />
              </div>
              <div className="space-y-2">
                <Label>Base Amount</Label>
                <Input value={formatCurrency(5400000)} disabled />
              </div>
              <div className="space-y-2">
                <Label>Discount %</Label>
                <Input type="number" placeholder="0" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="payment" className="space-y-4">
            <div className="space-y-4">
              <Label>Select Payment Plan</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-4">
                    <h3 className="font-medium">Standard Plan - 24 Months</h3>
                    <p className="text-sm text-muted-foreground">20% down payment, Monthly installments</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Booking:</span>
                        <span>10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registration:</span>
                        <span>5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Construction Linked:</span>
                        <span>85%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer border-2 hover:border-primary">
                  <CardContent className="p-4">
                    <h3 className="font-medium">Quick Payment - 12 Months</h3>
                    <p className="text-sm text-muted-foreground">30% down payment, Quarterly installments</p>
                    <div className="mt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Booking:</span>
                        <span>15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Registration:</span>
                        <span>10%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Balance:</span>
                        <span>75%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="confirm" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-medium mb-4">Booking Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Customer:</span>
                    <span>Rajesh Kumar</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Unit:</span>
                    <span>A101 - 2BHK Premium</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Base Amount:</span>
                    <span>{formatCurrency(5400000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>2% ({formatCurrency(108000)})</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Final Amount:</span>
                    <span>{formatCurrency(5292000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Plan:</span>
                    <span>Standard Plan - 24 Months</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Booking Amount Due:</span>
                    <span>{formatCurrency(529200)}</span>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowNewBooking(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      toast.success("Booking created successfully!")
                      setShowNewBooking(false)
                    }}
                  >
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )

  const PaymentEntryDialog = () => (
    <Dialog open={showPaymentEntry} onOpenChange={setShowPaymentEntry}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            Record a payment received for a specific booking installment with transaction details.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Booking Reference</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select booking" />
                </SelectTrigger>
                <SelectContent>
                  {mockBookings.map(booking => (
                    <SelectItem key={booking.id} value={booking.id}>
                      {booking.unit_name} - {booking.customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Installment</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select installment" />
                </SelectTrigger>
                <SelectContent>
                  {mockInstallments.map(installment => (
                    <SelectItem key={installment.id} value={installment.id}>
                      {installment.milestone} - ₨{installment.amount.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Payment Amount</Label>
              <Input type="number" placeholder="Amount received" />
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Reference Number</Label>
              <Input placeholder="Transaction/Cheque number" />
            </div>
            <div className="space-y-2">
              <Label>Payment Date</Label>
              <Input type="date" />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowPaymentEntry(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                toast.success("Payment recorded successfully!")
                setShowPaymentEntry(false)
              }}
            >
              Record Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  const BookingDetailsDialog = () => (
    <Dialog open={showBookingDetails} onOpenChange={setShowBookingDetails}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
          <DialogDescription>
            Complete booking information and payment schedule
          </DialogDescription>
        </DialogHeader>
        
        {selectedBooking && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name:</span>
                      <span className="font-medium">{selectedBooking.customer.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{selectedBooking.customer.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Phone:</span>
                      <span>{selectedBooking.customer.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Address:</span>
                      <span>{selectedBooking.customer.address}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Unit Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Unit:</span>
                      <span className="font-medium">{selectedBooking.unit_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="capitalize">{selectedBooking.unit_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booking Date:</span>
                      <span>{selectedBooking.booking_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sales Agent:</span>
                      <span>{selectedBooking.sales_agent}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Financial Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Amount:</span>
                      <span className="font-medium">₨{selectedBooking.total_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Discount:</span>
                      <span className="text-green-600">{selectedBooking.discount_applied}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Final Amount:</span>
                      <span className="font-medium text-lg">₨{selectedBooking.final_amount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Plan:</span>
                      <span>{selectedBooking.installment_plan_name}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  <Badge className={
                    selectedBooking.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                    selectedBooking.status === 'registered' ? 'bg-green-100 text-green-800' :
                    selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {selectedBooking.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Installment Schedule</h4>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Milestone</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockInstallments
                      .filter(inst => inst.booking_id === selectedBooking.id)
                      .map((installment) => (
                        <TableRow key={installment.id}>
                          <TableCell>{installment.milestone}</TableCell>
                          <TableCell className="font-medium">₨{installment.amount.toLocaleString()}</TableCell>
                          <TableCell>{installment.due_date}</TableCell>
                          <TableCell>
                            <Badge className={
                              installment.status === 'paid' ? 'bg-green-100 text-green-800' :
                              installment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }>
                              {installment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowBookingDetails(false)}>
                Close
              </Button>
              <Button onClick={() => {
                toast.success("Booking agreement downloaded!")
              }}>
                <Download className="h-4 w-4 mr-2" />
                Download Agreement
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings & Sales</h1>
          <p className="text-muted-foreground">
            Manage unit bookings, payments, and sales tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowPaymentEntry(true)}>
            <Receipt className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
          <Button onClick={() => setShowNewBooking(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="bookings">All Bookings</TabsTrigger>
          <TabsTrigger value="installments">Installments</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="targets">Sales Targets</TabsTrigger>
        </TabsList>

        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Unit Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Unit</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Booking Date</TableHead>
                    <TableHead>Sales Agent</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.unit_name}</div>
                          <div className="text-sm text-muted-foreground">{booking.unit_type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{booking.customer.name}</div>
                          <div className="text-sm text-muted-foreground">{booking.customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">₨{booking.final_amount.toLocaleString()}</div>
                          {booking.discount_applied > 0 && (
                            <div className="text-sm text-green-600">
                              {booking.discount_applied}% discount
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{booking.booking_date}</TableCell>
                      <TableCell>{booking.sales_agent}</TableCell>
                      <TableCell>
                        <Badge className={
                          booking.status === 'booked' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'registered' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {booking.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowBookingDetails(true)
                          }}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="installments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Installment Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking</TableHead>
                    <TableHead>Milestone</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInstallments.map((installment) => {
                    const booking = mockBookings.find(b => b.id === installment.booking_id)
                    return (
                      <TableRow key={installment.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking?.unit_name}</div>
                            <div className="text-sm text-muted-foreground">{booking?.customer.name}</div>
                          </div>
                        </TableCell>
                        <TableCell>{installment.milestone}</TableCell>
                        <TableCell className="font-medium">₨{installment.amount.toLocaleString()}</TableCell>
                        <TableCell>{installment.due_date}</TableCell>
                        <TableCell>
                          <Badge className={
                            installment.status === 'paid' ? 'bg-green-100 text-green-800' :
                            installment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }>
                            {installment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {installment.invoice_generated ? (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.info("Opening invoice: " + installment.invoice_id)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              {installment.invoice_id}
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => toast.success("Invoice generated successfully!")}
                            >
                              Generate Invoice
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowPaymentEntry(true)}
                          >
                            Record Payment
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Realized Payments</p>
                    <p className="text-2xl font-bold">₨55.0L</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-8 w-8 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">In Transit</p>
                    <p className="text-2xl font-bold">₨12.5L</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">₨28.3L</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payment Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Receipt No.</TableHead>
                    <TableHead>Booking</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Date</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Received By</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayments.map((payment) => {
                    const booking = mockBookings.find(b => b.id === payment.booking_id)
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.receipt_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking?.unit_name}</div>
                            <div className="text-sm text-muted-foreground">{booking?.customer.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">₨{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>{payment.payment_date}</TableCell>
                        <TableCell>{payment.payment_method.replace('_', ' ')}</TableCell>
                        <TableCell>{payment.received_by}</TableCell>
                        <TableCell>
                          <Badge className={
                            payment.status === 'realized' ? 'bg-green-100 text-green-800' :
                            payment.status === 'in_transit' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {payment.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="targets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Targets - January 2024</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sales Agent</TableHead>
                    <TableHead>Monthly Target</TableHead>
                    <TableHead>Achieved</TableHead>
                    <TableHead>Achievement %</TableHead>
                    <TableHead>Bookings</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockSalesTargets.map((target) => {
                    const achievementPercent = ((target.achieved_amount / target.monthly_target) * 100).toFixed(1)
                    return (
                      <TableRow key={target.agent_name}>
                        <TableCell className="font-medium">{target.agent_name}</TableCell>
                        <TableCell>₨{target.monthly_target.toLocaleString()}</TableCell>
                        <TableCell>₨{target.achieved_amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{achievementPercent}%</span>
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${Math.min(100, parseFloat(achievementPercent))}%` }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{target.bookings_count}</TableCell>
                        <TableCell>₨{target.commission_earned.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={
                            parseFloat(achievementPercent) >= 100 ? 'bg-green-100 text-green-800' :
                            parseFloat(achievementPercent) >= 70 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {parseFloat(achievementPercent) >= 100 ? 'Achieved' : 
                             parseFloat(achievementPercent) >= 70 ? 'On Track' : 'Behind'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <NewBookingDialog />
      <PaymentEntryDialog />
      <BookingDetailsDialog />
    </div>
  )
}