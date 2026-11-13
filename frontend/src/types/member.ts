export type Gender = 'Nam' | 'Nữ' | 'Khác'

export type MemberStatus =
  | 'THUONG_TRU'
  | 'TAM_VANG'
  | 'TAM_TRU'
  | 'DA_CHUYEN_DI'
  | 'DA_QUA_DOI'

export interface Member {
  id: number
  householdId: number
  fullName: string
  dateOfBirth: string
  gender: Gender
  identityNumber?: string | null
  relationshipToHead: string
  isHouseholdHead: boolean
  status: MemberStatus
  createdAt?: string
}

export type MemberEventType =
  | 'SINH_MOI'
  | 'CHUYEN_DEN'
  | 'CHUYEN_DI'
  | 'QUA_DOI'
  | 'DOI_CHU_HO'

export interface MemberEvent {
  id: number
  memberId: number
  eventType: MemberEventType
  eventDate: string
  note?: string | null
  performedById?: number
  createdAt?: string
}

export type ResidenceRecordType = 'TAM_TRU' | 'TAM_VANG'

export interface ResidenceRecord {
  id: number
  memberId: number
  recordType: ResidenceRecordType
  startDate: string
  endDate: string
  reason?: string | null
  relevantAddress?: string | null
}

export interface MemberCreateRequest {
  householdId: number
  fullName: string
  dateOfBirth: string
  gender: Gender
  identityNumber?: string | null
  relationshipToHead: string
  registrationEvent: {
    eventType: 'SINH_MOI' | 'CHUYEN_DEN'
    eventDate: string
  }
}
