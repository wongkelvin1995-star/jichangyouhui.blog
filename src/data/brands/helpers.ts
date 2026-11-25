import type { BillingCycle, PlanCategory, PlanRecord } from '../../types/airport';
import { CYCLE_LABELS, CYCLE_MONTHS } from '../../utils/pricing';

export interface CompactPlanInput {
  planName: string;
  category: PlanCategory;
  cycle: BillingCycle;
  price: number;
  monthlyTrafficGB: number | null;
  totalPeriodGB: number | null;
  resetRule?: string;
  multiplierNote?: string;
  speedLimit?: string;
  deviceLimit?: string;
  lineTags?: string[];
  notes?: string;
  recordDate: string;
  verificationLevel: 'verified' | 'historical_ref';
  couponEligible: boolean;
}

export function makePlans(brandSlug: string, items: CompactPlanInput[]): PlanRecord[] {
  return items.map((item, idx) => ({
    id: `${brandSlug}-${idx + 1}`,
    brandSlug,
    planName: item.planName,
    category: item.category,
    cycle: item.cycle,
    cycleLabel: CYCLE_LABELS[item.cycle],
    cycleMonths: CYCLE_MONTHS[item.cycle],
    originalPrice: item.price,
    monthlyTrafficGB: item.monthlyTrafficGB,
    totalPeriodGB: item.totalPeriodGB,
    resetRule:
      item.resetRule ??
      (item.cycle === 'one_time' ? '总量扣减，用完为止' : '按计费周期或每30天重置'),
    multiplierNote: item.multiplierNote ?? '全节点 1× 倍率（以面板实时标注为准）',
    speedLimit: item.speedLimit ?? '不限速（受本地网络与节点负载影响）',
    deviceLimit: item.deviceLimit ?? '不限同时在线设备（以订单页条款为准）',
    lineTags: item.lineTags ?? [],
    notes: item.notes ?? '',
    recordDate: item.recordDate,
    verificationLevel: item.verificationLevel,
    couponEligible: item.couponEligible,
  }));
}

export function buildMatrixPlans(
  tiers: {
    planName: string;
    monthlyTrafficGB: number;
    prices: Partial<Record<Exclude<BillingCycle, 'one_time'>, number>>;
    category?: PlanCategory;
    lineTags?: string[];
    notes?: string;
    speedLimit?: string;
    deviceLimit?: string;
    multiplierNote?: string;
    resetRule?: string;
    couponEligible?: boolean;
  }[],
  defaults: {
    recordDate: string;
    verificationLevel: 'verified' | 'historical_ref';
    lineTags: string[];
    couponEligible?: boolean;
  }
): CompactPlanInput[] {
  const result: CompactPlanInput[] = [];
  const cycleOrder: Exclude<BillingCycle, 'one_time'>[] = [
    'monthly',
    'quarterly',
    'semiannual',
    'annual',
    'biennial',
    'triennial',
  ];
  for (const tier of tiers) {
    for (const cycle of cycleOrder) {
      const price = tier.prices[cycle];
      if (price === undefined) continue;
      const months = CYCLE_MONTHS[cycle]!;
      result.push({
        planName: tier.planName,
        category: tier.category ?? (cycle === 'annual' && !tier.prices.monthly ? 'annual_lite' : 'regular'),
        cycle,
        price,
        monthlyTrafficGB: tier.monthlyTrafficGB,
        totalPeriodGB: tier.monthlyTrafficGB * months,
        resetRule: tier.resetRule,
        multiplierNote: tier.multiplierNote,
        speedLimit: tier.speedLimit,
        deviceLimit: tier.deviceLimit,
        lineTags: tier.lineTags ?? defaults.lineTags,
        notes: tier.notes ?? '',
        recordDate: defaults.recordDate,
        verificationLevel: defaults.verificationLevel,
        couponEligible: tier.couponEligible ?? defaults.couponEligible ?? true,
      });
    }
  }
  return result;
}
