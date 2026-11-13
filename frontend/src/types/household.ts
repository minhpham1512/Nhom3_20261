import type { Member } from './member'

export type HouseholdStatus = 'DANG_O' | 'DA_CHUYEN_DI'

export interface Household {
  id: number
  apartmentCode: string
  areaM2: number
  headOfHouseholdName?: string
  headMemberId?: number | null
  moveInDate: string
  status: HouseholdStatus
  createdAt?: string
}

export interface HeadMemberCreateRequest {
  fullName: string
  dateOfBirth: string
  gender: 'Nam' | 'Nữ' | 'Khác'
  identityNumber?: string | null
}

export interface HouseholdCreateRequest {
  apartmentCode: string
  areaM2: number
  headMember: HeadMemberCreateRequest
  moveInDate: string
}

export interface HouseholdUpdateRequest {
  areaM2?: number
  moveInDate?: string
}

export interface HouseholdDetail extends Household {
  members?: Member[]
}

export interface HouseholdListResponse {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  items: Household[]
}
