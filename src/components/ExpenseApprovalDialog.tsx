import { useState } from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Separator } from './ui/separator'
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  FileText,
  Building,
  AlertTriangle
} from 'lucide-react'
import { useAuth } from './AuthProvider'
import { useNotifications } from './NotificationProvider'

interface Expense {
  id: string
  category: string
  amount: number
  description: string
  vendor: string
  status: 'pending' | 'approved' | 'rejected'
  created_by: string
  approved_by?: string
  created_at: string
  invoice_number?: string
  receipt_url?: string
  rejection_reason?: string
}

interface ExpenseApprovalDialogProps {
  expense: Expense | null
  isOpen: boolean
  onClose: () => void
  onApprove: (expenseId: string, note?: string) => void
  onReject: (expenseId: string, reason: string) => void
}

export function ExpenseApprovalDialog({
  expense,
  isOpen,
  onClose,
  onApprove,
  onReject
}: ExpenseApprovalDialogProps) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [approvalNote, setApprovalNote] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectionForm, setShowRejectionForm] = useState(false)

  if (!expense) return null

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleApprove = async () => {
    setIsApproving(true)
    try {
      await onApprove(expense.id, approvalNote)
      
      // Add audit trail notification
      addNotification({
        title: 'Expense Approved',
        message: `${expense.description} for ${formatCurrency(expense.amount)} has been approved`,
        type: 'milestone'
      })
      
      setApprovalNote('')
      onClose()
    } catch (error) {
      console.error('Error approving expense:', error)
    } finally {
      setIsApproving(false)
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      return
    }
    
    setIsRejecting(true)
    try {
      await onReject(expense.id, rejectionReason)
      
      // Add audit trail notification
      addNotification({
        title: 'Expense Rejected',
        message: `${expense.description} for ${formatCurrency(expense.amount)} has been rejected`,
        type: 'expense_approval'
      })
      
      setRejectionReason('')
      setShowRejectionForm(false)
      onClose()
    } catch (error) {
      console.error('Error rejecting expense:', error)
    } finally {
      setIsRejecting(false)
    }
  }

  const getStatusIcon = () => {
    switch (expense.status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-orange-500" />
    }
  }

  const getStatusColor = () => {
    switch (expense.status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-orange-100 text-orange-800 border-orange-200'
    }
  }

  const canApprove = user?.role === 'admin' || user?.role === 'investor'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Expense Approval Request
            </DialogTitle>
            <Badge className={`${getStatusColor()} flex items-center gap-1`}>
              {getStatusIcon()}
              {expense.status.toUpperCase()}
            </Badge>
          </div>
          <DialogDescription>
            Review and approve or reject this expense submission
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Expense Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Expense Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(expense.amount)}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <Badge variant="outline" className="w-fit">
                    <Building className="h-3 w-3 mr-1" />
                    {expense.category}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Vendor</Label>
                  <p className="font-medium">{expense.vendor}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Submitted By</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{expense.created_by}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <p className="p-3 bg-muted rounded-md text-sm">{expense.description}</p>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Submitted: {formatDate(expense.created_at)}
                </div>
                {expense.invoice_number && (
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    Invoice: {expense.invoice_number}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Approval History */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Approval History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Expense submitted</span>
                  <span className="text-muted-foreground">by {expense.created_by}</span>
                  <span className="text-muted-foreground ml-auto">
                    {formatDate(expense.created_at)}
                  </span>
                </div>
                
                {expense.status === 'approved' && expense.approved_by && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Approved</span>
                    <span className="text-muted-foreground">by {expense.approved_by}</span>
                    <span className="text-muted-foreground ml-auto">
                      {formatDate(expense.created_at)}
                    </span>
                  </div>
                )}

                {expense.status === 'rejected' && expense.rejection_reason && (
                  <div className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Rejected</span>
                        <span className="text-muted-foreground">by {expense.approved_by}</span>
                      </div>
                      <p className="text-muted-foreground mt-1">{expense.rejection_reason}</p>
                    </div>
                    <span className="text-muted-foreground">
                      {formatDate(expense.created_at)}
                    </span>
                  </div>
                )}

                {expense.status === 'pending' && (
                  <div className="flex items-center gap-3 text-sm text-orange-600">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Waiting for approval</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {expense.status === 'pending' && canApprove && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  Approval Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showRejectionForm ? (
                  <>
                    <div className="space-y-2">
                      <Label>Approval Notes (Optional)</Label>
                      <Textarea
                        placeholder="Add any notes for the approval..."
                        value={approvalNote}
                        onChange={(e) => setApprovalNote(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowRejectionForm(true)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        onClick={handleApprove}
                        disabled={isApproving}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isApproving ? (
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        Approve Expense
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Rejection Reason *</Label>
                      <Textarea
                        placeholder="Please provide a reason for rejecting this expense..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowRejectionForm(false)
                          setRejectionReason('')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleReject}
                        disabled={isRejecting || !rejectionReason.trim()}
                      >
                        {isRejecting ? (
                          <Clock className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-2" />
                        )}
                        Reject Expense
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}