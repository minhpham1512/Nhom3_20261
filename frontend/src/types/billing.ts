export type DueStatus = 'CHUA_NOP' | 'NOP_THIEU' | 'DA_NOP'

export interface Due {
  id: number
  householdId: number
  apartmentCode?: string
  feeId: number
  feeName?: string
  month: string // Định dạng YYYY-MM
  areaM2?: number
  unitPrice?: number
  amountDue: number
  amountPaid: number
  amountRemaining: number
  dueDate?: string | null
  status: DueStatus
}

export type ReceiptStatus = 'HOP_LE' | 'DA_HUY'

export interface ReceiptItem {
  dueId?: number
  feeName?: string
  month?: string
  amount: number
}

export interface Receipt {
  id: number
  receiptNumber: string
  householdId: number
  apartmentCode?: string
  payerName: string
  paidAt: string
  collectedBy: number
  collectedByName?: string
  totalAmount: number
  amountInWords?: string
  note?: string
  status: ReceiptStatus
  cancelledAt?: string | null
  cancellationReason?: string | null
  items: ReceiptItem[]
}

export type ContributionStatus = 'HOP_LE' | 'DA_HUY'

export interface Contribution {
  id: number
  campaignId: number
  campaignName?: string
  householdId?: number
  apartmentCode?: string
  donorName: string
  amount: number
  paidAt: string
  collectedBy: number
  status: ContributionStatus
  cancellationReason?: string | null
}

export interface DebtItem {
  dueId: number
  feeName: string
  month: string
  amountDue: number
  amountPaid: number
  amountRemaining: number
}

export interface HouseholdDebt {
  householdId: number
  apartmentCode: string
  headOfHouseholdName?: string
  totalDebt: number
  monthsOverdue: number
  oldestDueMonth: string
  dueCount: number
  debts: DebtItem[]
}
