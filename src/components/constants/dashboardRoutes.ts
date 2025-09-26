// Dashboard route imports and mappings
import { OverviewDashboard } from '../dashboards/OverviewDashboard'
import { ExpensesDashboard } from '../dashboards/ExpensesDashboard'
import { SalesDashboard } from '../dashboards/SalesDashboard'
import { ReportsDashboard } from '../dashboards/ReportsDashboard'
import { CommissionsDashboard } from '../dashboards/CommissionsDashboard'
import { UserManagementDashboard } from '../dashboards/UserManagementDashboard'
import { ProjectSetupDashboard } from '../dashboards/ProjectSetupDashboard'
import { BookingDashboard } from '../dashboards/BookingDashboard'
import { InstallmentsInvoicingDashboard } from '../dashboards/InstallmentsInvoicingDashboard'
import { AutoInvoiceSystemDashboard } from '../dashboards/AutoInvoiceSystemDashboard'
import { AccountStatementsDashboard } from '../dashboards/AccountStatementsDashboard'
import { EmployeeManagementDashboard } from '../dashboards/EmployeeManagementDashboard'
import { MarketingCommunicationDashboard } from '../dashboards/MarketingCommunicationDashboard'
import { VendorManagementDashboard } from '../dashboards/VendorManagementDashboard'
import { MaterialManagementDashboard } from '../dashboards/MaterialManagementDashboard'
import { ProcurementDashboard } from '../dashboards/ProcurementDashboard'
import { PurchaseOrderDashboard } from '../dashboards/PurchaseOrderDashboard'
import { ProjectMilestonesDashboard } from '../dashboards/ProjectMilestonesDashboard'
import { SettingsDashboard } from '../dashboards/SettingsDashboard'
import { MobileExpensesDashboard } from '../mobile/MobileExpensesDashboard'
import { ProfileSettings } from '../ProfileSettings'
import { SuperAdminArea } from '../SuperAdminArea'
import { UserRoleManagement } from '../UserRoleManagement'
import { AuditTrail } from '../AuditTrail'

export const DASHBOARD_COMPONENTS = {
  overview: OverviewDashboard,
  projects: ProjectSetupDashboard,
  milestones: ProjectMilestonesDashboard,
  expenses: ExpensesDashboard,
  'expenses-mobile': MobileExpensesDashboard,
  sales: BookingDashboard,
  bookings: BookingDashboard,
  installments: InstallmentsInvoicingDashboard,
  invoices: AutoInvoiceSystemDashboard,
  statements: AccountStatementsDashboard,
  vendors: VendorManagementDashboard,
  materials: MaterialManagementDashboard,
  procurement: ProcurementDashboard,
  'purchase-orders': PurchaseOrderDashboard,
  reports: ReportsDashboard,
  financial: ReportsDashboard,
  users: UserManagementDashboard,
  employees: EmployeeManagementDashboard,
  inventory: SalesDashboard,
  commissions: CommissionsDashboard,
  customers: BookingDashboard,
  marketing: MarketingCommunicationDashboard,
  settings: SettingsDashboard,
  'profile-settings': ProfileSettings,
  'super-admin': SuperAdminArea,
  'user-roles': UserRoleManagement,
  'audit-trail': AuditTrail,
} as const

export const DEFAULT_TAB = 'overview'

export type DashboardTab = keyof typeof DASHBOARD_COMPONENTS