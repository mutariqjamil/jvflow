import { useState } from 'react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { Alert, AlertDescription } from '../ui/alert'
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Calendar,
  User,
  FileText,
  Building,
  AlertTriangle,
  ArrowLeft,
  Download,
  Eye
} from 'lucide-react'
import { useAuth } from '../AuthProvider'
import { useNotifications } from '../NotificationProvider'

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

interface ExpenseApprovalFormProps {
  expense: Expense
  onApprove: (expenseId: string, note?: string) => void
  onReject: (expenseId: string, reason: string) => void
  onBack: () => void
}

export function ExpenseApprovalForm({
  expense,
  onApprove,
  onReject,
  onBack
}: ExpenseApprovalFormProps) {
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [approvalNote, setApprovalNote] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectionForm, setShowRejectionForm] = useState(false)

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
      
      addNotification({
        title: 'Expense Approved',
        message: `${expense.description} for ${formatCurrency(expense.amount)} has been approved`,
        type: 'milestone'
      })
      
      setApprovalNote('')
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
      
      addNotification({
        title: 'Expense Rejected',
        message: `${expense.description} for ${formatCurrency(expense.amount)} has been rejected`,
        type: 'expense_approval'
      })
      
      setRejectionReason('')
      setShowRejectionForm(false)
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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Expenses
          </Button>
          <div className="h-8 w-px bg-border"></div>
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold tracking-tight">Expense Approval</h1>
          </div>
        </div>
        <Badge className={`${getStatusColor()} flex items-center gap-2 px-4 py-2`}>
          {getStatusIcon()}
          {expense.status.toUpperCase()}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Expense Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                <span>Expense Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount and Category */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Amount</Label>
                  <div className="text-3xl font-bold text-green-600">
                    {formatCurrency(expense.amount)}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                  <Badge variant="outline" className="w-fit px-3 py-1">
                    <Building className="h-3 w-3 mr-1" />
                    {expense.category}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Vendor and Submitter */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Vendor</Label>
                  <p className="font-medium text-lg">{expense.vendor}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Submitted By</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{expense.created_by}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                <div className="p-4 bg-muted rounded-lg">
                  <p>{expense.description}</p>
                </div>
              </div>

              {/* Additional Details */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
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
                {expense.receipt_url && (
                  <Button variant="ghost" size="sm" className="h-auto p-0">
                    <Eye className="h-4 w-4 mr-1" />
                    View Receipt
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Approval History */}
          <Card>
            <CardHeader>
              <CardTitle>Approval Timeline</CardTitle>
              <CardDescription>Track the approval process for this expense</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Submission */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Expense Submitted</h4>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(expense.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submitted by {expense.created_by} for approval
                    </p>
                  </div>
                </div>
                
                {/* Current Status */}
                {expense.status === 'approved' && expense.approved_by && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-green-800">Approved</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(expense.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Approved by {expense.approved_by}
                      </p>
                    </div>
                  </div>
                )}

                {expense.status === 'rejected' && expense.rejection_reason && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-red-800">Rejected</h4>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(expense.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Rejected by {expense.approved_by}
                      </p>
                      <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-sm text-red-800">{expense.rejection_reason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {expense.status === 'pending' && (
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-orange-600 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-orange-800">Awaiting Approval</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Waiting for review from authorized approver
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Approval Actions */}
        <div className="space-y-6">
          {expense.status === 'pending' && canApprove && (
            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-900">
                  <AlertTriangle className="h-5 w-5" />
                  Approval Required
                </CardTitle>
                <CardDescription className="text-orange-800">
                  This expense requires your approval to proceed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showRejectionForm ? (
                  <>
                    <div className="space-y-2">
                      <Label>Approval Notes (Optional)</Label>
                      <Textarea
                        placeholder="Add any notes about this approval..."
                        value={approvalNote}
                        onChange={(e) => setApprovalNote(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowRejectionForm(true)}
                        className="text-red-600 hover:text-red-700 hover:border-red-300"
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
                        Approve
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Rejection Reason *</Label>
                      <Textarea
                        placeholder="Please provide a detailed reason for rejecting this expense..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={4}
                        required
                      />
                    </div>
                    
                    <Alert variant="destructive" className="text-sm">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        The submitter will be notified of the rejection and reason provided.
                      </AlertDescription>
                    </Alert>
                    
                    <div className="grid grid-cols-2 gap-2">
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
                        Reject
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <User className="w-4 h-4 mr-2" />
                Contact Submitter
              </Button>
            </CardContent>
          </Card>

          {/* Expense Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expense ID:</span>
                <span className="font-mono text-sm">{expense.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Category:</span>
                <span>{expense.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vendor:</span>
                <span>{expense.vendor}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(expense.amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}