// Form route imports and mappings
import { BillingSetupForm } from '../forms/BillingSetupForm'
import { UserInvitationForm } from '../forms/UserInvitationForm'

export const FORM_COMPONENTS = {
  'billing-setup': BillingSetupForm,
  'user-invitation': UserInvitationForm,
} as const

export type FormRoute = keyof typeof FORM_COMPONENTS