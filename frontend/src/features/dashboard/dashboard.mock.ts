import type { StatisticsResponse, Receipt, UserRole } from '@shared'

/**
 * Danh sách vai trò được xem thống kê theo x-roles của /api/stats trong doc/swagger.yaml:
 * - ADMIN
 * - KE_TOAN
 * - TRUONG_BQT
 */
export const STATS_ROLES: UserRole[] = ['ADMIN', 'KE_TOAN', 'TRUONG_BQT']

/**
 * Dữ liệu mẫu thống kê theo cấu trúc StatisticsResponse trong OpenAPI (/api/stats).
 */
export const mockStatistics: StatisticsResponse = {
  periodType: 'MONTH',
  from: '2026-11-01',
  to: '2026-11-30',
  totals: {
    amountDue: 506000000,
    amountCollected: 428500000,
    amountRemaining: 77500000,
    collectionRate: 84.6,
    householdsPaid: 296,
    householdsTotal: 342,
  },
  byFee: [
    {
      feeId: 1,
      feeName: 'Phí dịch vụ chung cư',
      amountDue: 210000000,
      amountCollected: 198500000,
      amountRemaining: 11500000,
      collectionRate: 94.5,
      householdsPaid: 320,
    },
    {
      feeId: 2,
      feeName: 'Phí quản lý BlueMoon',
      amountDue: 296000000,
      amountCollected: 230000000,
      amountRemaining: 66000000,
      collectionRate: 77.7,
      householdsPaid: 296,
    },
  ],
  byCampaign: [
    {
      campaignId: 1,
      campaignName: 'Quỹ khuyến học BlueMoon 2026',
      totalAmount: 45000000,
      householdsContributed: 210,
    },
    {
      campaignId: 2,
      campaignName: 'Ủng hộ đồng bào khắc phục bão lũ',
      totalAmount: 100000000,
      householdsContributed: 285,
    },
  ],
  byPeriod: [
    {
      period: '2026-11',
      amountDue: 506000000,
      amountCollected: 428500000,
    },
  ],
}

/**
 * Dữ liệu mẫu danh sách phiếu thu gần nhất theo schema Receipt trong OpenAPI.
 * Trạng thái chỉ dùng HOP_LE và DA_HUY theo ReceiptStatus trong CSDL.
 */
export const mockRecentReceipts: Receipt[] = [
  {
    id: 1,
    receiptNumber: 'PT-202611-001',
    householdId: 1,
    apartmentCode: '12A05',
    payerName: 'Đỗ Anh Tuấn',
    paidAt: '2026-11-14T10:24:00+07:00',
    collectedBy: 1,
    collectedByName: 'Kế toán BQT',
    totalAmount: 840000,
    status: 'HOP_LE',
    items: [
      {
        dueId: 1,
        feeName: 'Phí dịch vụ chung cư',
        month: '2026-11',
        amount: 350000,
      },
      {
        dueId: 2,
        feeName: 'Phí quản lý BlueMoon',
        month: '2026-11',
        amount: 490000,
      },
    ],
  },
  {
    id: 2,
    receiptNumber: 'PT-202611-002',
    householdId: 2,
    apartmentCode: '08B12',
    payerName: 'Nguyễn Văn Minh',
    paidAt: '2026-11-14T09:45:00+07:00',
    collectedBy: 1,
    collectedByName: 'Kế toán BQT',
    totalAmount: 650000,
    status: 'HOP_LE',
    items: [
      {
        dueId: 3,
        feeName: 'Phí dịch vụ chung cư',
        month: '2026-11',
        amount: 650000,
      },
    ],
  },
  {
    id: 3,
    receiptNumber: 'PT-202611-003',
    householdId: 3,
    apartmentCode: '15A01',
    payerName: 'Lê Thị Thu Thảo',
    paidAt: '2026-11-14T08:30:00+07:00',
    collectedBy: 1,
    collectedByName: 'Kế toán BQT',
    totalAmount: 1000000,
    status: 'HOP_LE',
    items: [
      {
        dueId: 4,
        feeName: 'Phí quản lý BlueMoon',
        month: '2026-11',
        amount: 1000000,
      },
    ],
  },
  {
    id: 4,
    receiptNumber: 'PT-202611-004',
    householdId: 4,
    apartmentCode: '04A09',
    payerName: 'Trần Đình Trọng',
    paidAt: '2026-11-13T16:15:00+07:00',
    collectedBy: 1,
    collectedByName: 'Kế toán BQT',
    totalAmount: 1250000,
    status: 'DA_HUY',
    cancelledAt: '2026-11-13T17:00:00+07:00',
    cancellationReason: 'Sai thông tin căn hộ nộp tiền',
    items: [
      {
        dueId: 5,
        feeName: 'Phí dịch vụ chung cư',
        month: '2026-11',
        amount: 1250000,
      },
    ],
  },
  {
    id: 5,
    receiptNumber: 'PT-202611-005',
    householdId: 5,
    apartmentCode: '20B03',
    payerName: 'Phạm Hồng Nhung',
    paidAt: '2026-11-13T14:02:00+07:00',
    collectedBy: 1,
    collectedByName: 'Kế toán BQT',
    totalAmount: 720000,
    status: 'HOP_LE',
    items: [
      {
        dueId: 6,
        feeName: 'Phí dịch vụ chung cư',
        month: '2026-11',
        amount: 720000,
      },
    ],
  },
]

/**
 * Dữ liệu mẫu quy mô căn hộ và cư dân.
 */
export const mockResidentOverview = {
  totalApartments: 350,
  occupiedApartments: 342,
  vacantApartments: 8,
  occupancyRate: 97.7,
  totalResidents: 1185,
  permanentResidents: 1045,
  temporaryResidents: 140,
  newResidentsThisWeek: 5,
}

/**
 * Dữ liệu mẫu việc cần làm theo SDD SC003 (US17: lập danh sách tháng, US21: theo dõi nợ).
 */
export const mockTodoTasks = {
  monthlyBillingReminder: {
    month: '2026-11',
    isGenerated: false,
    dueDate: '15/11/2026',
  },
  debtReminder: {
    unpaidHouseholdsCount: 18,
    overdueHouseholdsCount: 4,
    totalRemainingDebt: 77500000,
  },
}
