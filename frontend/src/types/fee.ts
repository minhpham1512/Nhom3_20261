export type FeeStatus = 'HOAT_DONG' | 'NGUNG_AP_DUNG'

export type FeeCategory = 'SERVICE_FEE' | 'OTHER'

export interface Fee {
  id: number
  name: string
  type: 'BAT_BUOC'
  category: FeeCategory
  unitPrice: number
  unit: 'VND/m2/thang'
  billingCycle: 'MONTHLY'
  effectiveFrom: string
  status: FeeStatus
}

export type CampaignStatus = 'NOT_STARTED' | 'OPEN' | 'CLOSED'

export interface ContributionCampaign {
  id: number
  name: string
  startDate: string
  endDate: string
  status: CampaignStatus
  totalAmount?: number
  contributorCount?: number
  description?: string
}

export interface FeeCreateRequest {
  name: string
  category: FeeCategory
  unitPrice: number
  effectiveFrom: string
  confirmPriceWarning?: boolean
}
