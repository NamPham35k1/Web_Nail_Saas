export interface PlanConfig {
  name: string;
  code: 'TRIAL' | 'BASIC' | 'PRO';
  priceVnd: number;
  maxStaff: number;
  maxServices: number;
  customBranding: boolean;
  advancedReports: boolean;
  durationDays?: number;
  description: string;
}

export const SUBSCRIPTION_PLANS: Record<string, PlanConfig> = {
  TRIAL: {
    name: 'Gói Dùng Thử 14 Ngày',
    code: 'TRIAL',
    priceVnd: 0,
    maxStaff: 2,
    maxServices: 10,
    customBranding: true,
    advancedReports: false,
    durationDays: 14,
    description: 'Trải nghiệm miễn phí đầy đủ tính năng tạo website và nhận lịch hẹn.'
  },
  BASIC: {
    name: 'Gói Cơ Bản (Basic)',
    code: 'BASIC',
    priceVnd: 199000,
    maxStaff: 5,
    maxServices: 30,
    customBranding: true,
    advancedReports: false,
    description: 'Dành cho tiệm nail nhỏ và vừa (1-5 nhân viên) với tên miền riêng và quản lý đặt lịch.'
  },
  PRO: {
    name: 'Gói Chuyên Nghiệp (Pro)',
    code: 'PRO',
    priceVnd: 499000,
    maxStaff: 9999,
    maxServices: 9999,
    customBranding: true,
    advancedReports: true,
    description: 'Không giới hạn nhân viên, đầy đủ báo cáo doanh thu, chiến dịch khuyến mãi và hỗ trợ ưu tiên.'
  }
};

export function checkPlanLimit(planCode: string, resource: 'staff' | 'services', currentCount: number): { allowed: boolean; max: number; message?: string } {
  const plan = SUBSCRIPTION_PLANS[planCode] || SUBSCRIPTION_PLANS.TRIAL;
  const max = resource === 'staff' ? plan.maxStaff : plan.maxServices;

  if (currentCount >= max) {
    return {
      allowed: false,
      max,
      message: `Gói ${plan.name} giới hạn tối đa ${max} ${resource === 'staff' ? 'nhân viên' : 'dịch vụ'}. Vui lòng nâng cấp gói để thêm tiếp.`
    };
  }

  return { allowed: true, max };
}
