import { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Alert, AlertDescription } from '../ui/alert'
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  User, 
  Building2, 
  DollarSign, 
  Calendar,
  FileText
} from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface BookingApprovalData {
  id: string
  customer_name: string
  unit_name: string
  unit_type: string
  total_amount: number
  final_amount: number
  discount_applied: number
  booking_date: string
  payment_plan: string
  sales_agent: string
  status: 'pending_approval' | 'approved' | 'rejected'
  submitted_by: string
  submitted_date: string
  approval_notes?: string
  rejection_reason?: string
}

interface BookingApprovalFormProps {
  booking: BookingApprovalData | null
  isOpen: boolean
  onClose: () => void
  onApprove: (bookingId: string, notes?: string) => void
  onReject: (bookingId: string, reason: string) => void
}

export function BookingApprovalForm({ 
  booking, 
  isOpen, 
  onClose, 
  onApprove, 
  onReject 
}: BookingApprovalFormProps) {
  const [notes, setNotes] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handleApprove = async () => {
    if (!booking) return
    
    setProcessing(true)
    try {
      await onApprove(booking.id, notes)
      toast.success(`Booking approved for ${booking.customer_name}`)
      onClose()
      setNotes('')
    } catch (error) {
      toast.error('Failed to approve booking')
    } finally {
      setProcessing(false)
    }
  }

  const handleReject = async () => {
    if (!booking || !rejectionReason.trim()) return
    
    setProcessing(true)
    try {
      await onReject(booking.id, rejectionReason)
      toast.success(`Booking rejected for ${booking.customer_name}`)
      onClose()
      setShowRejectDialog(false)
      setRejectionReason('')
      setNotes('')
    } catch (error) {
      toast.error('Failed to reject booking')
    } finally {
      setProcessing(false)
    }
  }

  if (!booking) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <span>Booking Approval Required</span>
            </DialogTitle>
            <DialogDescription>
              Review and approve or reject this booking request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Booking Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{booking.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking Date:</span>
                    <span>{booking.booking_date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sales Agent:</span>
                    <span>{booking.sales_agent}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center">
                    <Building2 className="h-4 w-4 mr-2" />
                    Unit Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Unit:</span>
                    <span className="font-medium">{booking.unit_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize">{booking.unit_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Plan:</span>
                    <span>{booking.payment_plan}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Financial Details */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Base Amount:</span>
                    <span className="font-medium">₹{booking.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount:</span>
                    <span className="text-green-600">{booking.discount_applied}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Final Amount:</span>
                    <span className="font-bold text-lg">₹{booking.final_amount.toLocaleString()}</span>
                  </div>
                </div>
                
                {booking.discount_applied > 0 && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      A discount of {booking.discount_applied}% has been applied, requiring management approval.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Submission Info */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Submitted by: {booking.submitted_by}</p>
                  <p className="text-xs text-muted-foreground">Date: {booking.submitted_date}</p>
                </div>
                <Badge 
                  className="bg-orange-100 text-orange-800 border-orange-200"
                  variant="outline"
                >
                  Pending Approval
                </Badge>
              </div>
            </div>

            {/* Approval Notes */}
            <div className="space-y-3">
              <Label htmlFor="notes">Approval Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes for this booking approval..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={processing}>
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
                disabled={processing}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={processing}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {processing ? 'Approving...' : 'Approve Booking'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>Reject Booking</span>
            </DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this booking request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rejection-reason">Rejection Reason *</Label>
              <Textarea
                id="rejection-reason"
                placeholder="Please explain why this booking is being rejected..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false)
                  setRejectionReason('')
                }}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={processing || !rejectionReason.trim()}
                variant="destructive"
              >
                {processing ? 'Rejecting...' : 'Confirm Rejection'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}