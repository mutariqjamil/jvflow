// Form route imports and mappings
import { BillingSetupForm } from '../forms/BillingSetupForm'
import { UserInvitationForm } from '../forms/UserInvitationForm'
import { ProfileSettings } from '../ProfileSettings'
import { SuperAdminArea } from '../SuperAdminArea'
import { UserRoleManagement } from '../UserRoleManagement'
import { AuditTrail } from '../AuditTrail'
import SupabaseTestPage from '../SupabaseTestPage'
import ComprehensiveUITest from '../ComprehensiveUITest'

export const FORM_COMPONENTS = {
  'billing-setup': BillingSetupForm,
  'user-invitation': UserInvitationForm,
  'profile-settings': ProfileSettings,
  'super-admin': SuperAdminArea,
  'user-roles': UserRoleManagement,
  'audit-trail': AuditTrail,
  'supabase-test': SupabaseTestPage,
  'ui-test-suite': ComprehensiveUITest,
} as const

export type FormRoute = keyof typeof FORM_COMPONENTS