import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog'
import { Switch } from '../ui/switch'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { UserPlus, Users, Calendar as CalendarIcon, DollarSign, Clock, FileText, Edit, Trash2, Download, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner@2.0.3'

interface Employee {
  id: string
  employee_id: string
  name: string
  email: string
  phone: string
  department: string
  designation: string
  joining_date: string
  salary: number
  status: 'active' | 'inactive' | 'on_leave'
  manager_id?: string
  bank_account: string
  pan_number: string
  address: string
}

interface Attendance {
  id: string
  employee_id: string
  date: string
  check_in: string
  check_out: string
  hours_worked: number
  status: 'present' | 'absent' | 'half_day' | 'late' | 'overtime'
  remarks?: string
}

interface LeaveRequest {
  id: string
  employee_id: string
  employee_name: string
  leave_type: 'casual' | 'sick' | 'earned' | 'maternity' | 'emergency'
  from_date: string
  to_date: string
  days: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  applied_date: string
  approved_by?: string
  approved_date?: string
}

interface PayrollRecord {
  id: string
  employee_id: string
  employee_name: string
  month: string
  year: number
  basic_salary: number
  allowances: number
  overtime: number
  deductions: number
  net_salary: number
  days_worked: number
  total_days: number
  status: 'draft' | 'processed' | 'paid'
  payment_date?: string
}

export function EmployeeManagementDashboard() {
  const [activeTab, setActiveTab] = useState('employees')
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showAttendanceEntry, setShowAttendanceEntry] = useState(false)

  // Mock data
  const mockEmployees: Employee[] = [
    {
      id: '1',
      employee_id: 'EMP001',
      name: 'Priya Sharma',
      email: 'priya@jvflow.com',
      phone: '+91 9876543210',
      department: 'Sales',
      designation: 'Sales Manager',
      joining_date: '2023-06-15',
      salary: 45000,
      status: 'active',
      bank_account: 'HDFC-1234567890',
      pan_number: 'ABCDE1234F',
      address: 'Mumbai, Maharashtra'
    },
    {
      id: '2',
      employee_id: 'EMP002',
      name: 'Rohit Patel',
      email: 'rohit@jvflow.com',
      phone: '+91 9876543211',
      department: 'Sales',
      designation: 'Sales Executive',
      joining_date: '2023-08-01',
      salary: 35000,
      status: 'active',
      bank_account: 'ICICI-0987654321',
      pan_number: 'FGHIJ5678K',
      address: 'Pune, Maharashtra'
    },
    {
      id: '3',
      employee_id: 'EMP003',
      name: 'Anita Verma',
      email: 'anita@jvflow.com',
      phone: '+91 9876543212',
      department: 'Accounts',
      designation: 'Accountant',
      joining_date: '2023-09-15',
      salary: 40000,
      status: 'on_leave',
      bank_account: 'SBI-1122334455',
      pan_number: 'KLMNO9012P',
      address: 'Mumbai, Maharashtra'
    }
  ]

  const mockAttendance: Attendance[] = [
    {
      id: '1',
      employee_id: 'EMP001',
      date: '2024-01-20',
      check_in: '09:15',
      check_out: '18:30',
      hours_worked: 9.25,
      status: 'present'
    },
    {
      id: '2',
      employee_id: 'EMP002',
      date: '2024-01-20',
      check_in: '09:45',
      check_out: '18:15',
      hours_worked: 8.5,
      status: 'late',
      remarks: '15 minutes late'
    },
    {
      id: '3',
      employee_id: 'EMP003',
      date: '2024-01-20',
      check_in: '',
      check_out: '',
      hours_worked: 0,
      status: 'absent',
      remarks: 'On leave'
    }
  ]

  const mockLeaveRequests: LeaveRequest[] = [
    {
      id: '1',
      employee_id: 'EMP001',
      employee_name: 'Priya Sharma',
      leave_type: 'casual',
      from_date: '2024-01-25',
      to_date: '2024-01-26',
      days: 2,
      reason: 'Personal work',
      status: 'pending',
      applied_date: '2024-01-20'
    },
    {
      id: '2',
      employee_id: 'EMP002',
      employee_name: 'Rohit Patel',
      leave_type: 'sick',
      from_date: '2024-01-18',
      to_date: '2024-01-19',
      days: 2,
      reason: 'Fever and cold',
      status: 'approved',
      applied_date: '2024-01-17',
      approved_by: 'HR Manager',
      approved_date: '2024-01-17'
    }
  ]

  const mockPayrollRecords: PayrollRecord[] = [
    {
      id: '1',
      employee_id: 'EMP001',
      employee_name: 'Priya Sharma',
      month: 'January',
      year: 2024,
      basic_salary: 45000,
      allowances: 5000,
      overtime: 2000,
      deductions: 2500,
      net_salary: 49500,
      days_worked: 22,
      total_days: 24,
      status: 'processed',
      payment_date: '2024-01-31'
    },
    {
      id: '2',
      employee_id: 'EMP002',
      employee_name: 'Rohit Patel',
      month: 'January',
      year: 2024,
      basic_salary: 35000,
      allowances: 3000,
      overtime: 1500,
      deductions: 1800,
      net_salary: 37700,
      days_worked: 20,
      total_days: 24,
      status: 'draft'
    }
  ]

  const AddEmployeeDialog = () => (
    <Dialog open={showAddEmployee} onOpenChange={setShowAddEmployee}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Fill in the employee details to add them to the system. Required fields are marked with *.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Employee ID</Label>
              <Input placeholder="EMP004" />
            </div>
            <div className="space-y-2">
              <Label>Full Name *</Label>
              <Input placeholder="Employee full name" />
            </div>
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input type="email" placeholder="employee@jvflow.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input placeholder="+91 9876543210" />
            </div>
            <div className="space-y-2">
              <Label>Department *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="accounts">Accounts</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="admin">Administration</SelectItem>
                  <SelectItem value="construction">Construction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Designation *</Label>
              <Input placeholder="e.g., Sales Manager" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Joining Date *</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Monthly Salary *</Label>
              <Input type="number" placeholder="45000" />
            </div>
            <div className="space-y-2">
              <Label>Bank Account Details</Label>
              <Input placeholder="Bank-AccountNumber" />
            </div>
            <div className="space-y-2">
              <Label>PAN Number</Label>
              <Input placeholder="ABCDE1234F" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input placeholder="Complete address" />
            </div>
            <div className="space-y-2">
              <Label>Reporting Manager</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMP001">Priya Sharma</SelectItem>
                  <SelectItem value="HR001">HR Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => setShowAddEmployee(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            toast.success("Employee added successfully!")
            setShowAddEmployee(false)
          }}>
            Add Employee
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )

  const AttendanceEntryDialog = () => (
    <Dialog open={showAttendanceEntry} onOpenChange={setShowAttendanceEntry}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
          <DialogDescription>
            Record attendance information for an employee including check-in/out times and status.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.employee_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" />
            </div>
            <div className="space-y-2">
              <Label>Check In Time</Label>
              <Input type="time" />
            </div>
            <div className="space-y-2">
              <Label>Check Out Time</Label>
              <Input type="time" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="half_day">Half Day</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="overtime">Overtime</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Input placeholder="Optional remarks" />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setShowAttendanceEntry(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            toast.success("Attendance marked successfully!")
            setShowAttendanceEntry(false)
          }}>
            Mark Attendance
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
          <h1 className="text-2xl font-bold tracking-tight">Employee Management</h1>
          <p className="text-muted-foreground">
            Complete HR management with payroll, attendance, and leave tracking
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowAttendanceEntry(true)}>
            <Clock className="h-4 w-4 mr-2" />
            Mark Attendance
          </Button>
          <Button onClick={() => setShowAddEmployee(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Present Today</p>
                <p className="text-2xl font-bold">21</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">On Leave</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="leaves">Leave Management</TabsTrigger>
          <TabsTrigger value="payroll">Payroll</TabsTrigger>
        </TabsList>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Employee Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.employee_id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{employee.name}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.designation}</TableCell>
                      <TableCell>₨{employee.salary.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={
                          employee.status === 'active' ? 'bg-green-100 text-green-800' :
                          employee.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }>
                          {employee.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4" />
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

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Daily Attendance - {new Date().toLocaleDateString()}</CardTitle>
                <Button onClick={() => setShowAttendanceEntry(true)}>
                  <Clock className="h-4 w-4 mr-2" />
                  Mark Attendance
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockAttendance.map((attendance) => {
                    const employee = mockEmployees.find(emp => emp.employee_id === attendance.employee_id)
                    return (
                      <TableRow key={attendance.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{employee?.name}</div>
                            <div className="text-sm text-muted-foreground">{attendance.employee_id}</div>
                          </div>
                        </TableCell>
                        <TableCell>{attendance.date}</TableCell>
                        <TableCell>{attendance.check_in || '-'}</TableCell>
                        <TableCell>{attendance.check_out || '-'}</TableCell>
                        <TableCell>{attendance.hours_worked || '0'} hrs</TableCell>
                        <TableCell>
                          <Badge className={
                            attendance.status === 'present' ? 'bg-green-100 text-green-800' :
                            attendance.status === 'late' ? 'bg-yellow-100 text-yellow-800' :
                            attendance.status === 'overtime' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {attendance.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {attendance.remarks || '-'}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaves" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>From Date</TableHead>
                    <TableHead>To Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLeaveRequests.map((leave) => (
                    <TableRow key={leave.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{leave.employee_name}</div>
                          <div className="text-sm text-muted-foreground">{leave.employee_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {leave.leave_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{leave.from_date}</TableCell>
                      <TableCell>{leave.to_date}</TableCell>
                      <TableCell>{leave.days}</TableCell>
                      <TableCell className="text-sm">{leave.reason}</TableCell>
                      <TableCell>
                        <Badge className={
                          leave.status === 'approved' ? 'bg-green-100 text-green-800' :
                          leave.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {leave.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {leave.status === 'pending' && (
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-green-600">
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="text-red-600">
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Payroll Records - January 2024</CardTitle>
                <Button onClick={() => {
                  toast.success("Payslips generated successfully! Check downloads folder.")
                }}>
                  <Download className="h-4 w-4 mr-2" />
                  Generate Payslips
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Basic Salary</TableHead>
                    <TableHead>Allowances</TableHead>
                    <TableHead>Overtime</TableHead>
                    <TableHead>Deductions</TableHead>
                    <TableHead>Net Salary</TableHead>
                    <TableHead>Days Worked</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockPayrollRecords.map((payroll) => (
                    <TableRow key={payroll.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{payroll.employee_name}</div>
                          <div className="text-sm text-muted-foreground">{payroll.employee_id}</div>
                        </div>
                      </TableCell>
                      <TableCell>₨{payroll.basic_salary.toLocaleString()}</TableCell>
                      <TableCell>₨{payroll.allowances.toLocaleString()}</TableCell>
                      <TableCell>₨{payroll.overtime.toLocaleString()}</TableCell>
                      <TableCell>₨{payroll.deductions.toLocaleString()}</TableCell>
                      <TableCell className="font-medium">₨{payroll.net_salary.toLocaleString()}</TableCell>
                      <TableCell>{payroll.days_worked}/{payroll.total_days}</TableCell>
                      <TableCell>
                        <Badge className={
                          payroll.status === 'paid' ? 'bg-green-100 text-green-800' :
                          payroll.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {payroll.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.info("Payslip details: " + payroll.employee_name + " - " + payroll.month + " " + payroll.year)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toast.success("Payslip downloaded for " + payroll.employee_name)}
                          >
                            <Download className="h-4 w-4" />
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
      </Tabs>

      <AddEmployeeDialog />
      <AttendanceEntryDialog />
    </div>
  )
}