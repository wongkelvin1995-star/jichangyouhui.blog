import type { BrandData, PlanRecord } from '../../types/airport';
import {
  calculatePlanMetrics,
  getBudgetTier,
  getPrimaryCalculableCoupon,
  type BudgetTierKey,
  type CalculatedPlanMetrics,
} from '../../utils/pricing';
import { ALL_BRANDS, getBrandRank } from '../brands';

export interface EnrichedPlan {
  plan: PlanRecord;
  brand: BrandData;
  brandRank: number;
  metrics: CalculatedPlanMetrics;
  budgetTier: BudgetTierKey | null;
  requiresPrepayment: boolean;
}

export const ALL_PLANS: EnrichedPlan[] = ALL_BRANDS.flatMap((brand) => {
  const primaryCoupon = getPrimaryCalculableCoupon(brand.coupons);
  const rank = getBrandRank(brand.slug);

  return brand.plans.map((plan) => {
    const metrics = calculatePlanMetrics(plan, primaryCoupon);
    const budgetTier = getBudgetTier(metrics.effectiveMonthlyAvg);
    const requiresPrepayment =
      plan.cycle !== 'monthly' && plan.cycle !== 'one_time';

    return {
      plan,
      brand,
      brandRank: rank,
      metrics,
      budgetTier,
      requiresPrepayment,
    };
  });
});

export function getPlansByBrand(slug: string): EnrichedPlan[] {
  return ALL_PLANS.filter((p) => p.brand.slug === slug);
}

export function getPlansByBudgetTier(tier: BudgetTierKey): EnrichedPlan[] {
  return ALL_PLANS.filter((p) => p.budgetTier === tier).sort((a, b) => {
    const diff = (a.metrics.effectiveMonthlyAvg ?? 9999) - (b.metrics.effectiveMonthlyAvg ?? 9999);
    if (diff !== 0) return diff;
    return a.brandRank - b.brandRank;
  });
}

export function getAnnualDeals(): EnrichedPlan[] {
  return ALL_PLANS.filter((p) => p.plan.cycle === 'annual').sort(
    (a, b) => a.metrics.effectivePayable - b.metrics.effectivePayable
  );
}

export function getOneTimePlans(): EnrichedPlan[] {
  return ALL_PLANS.filter((p) => p.plan.cycle === 'one_time').sort(
    (a, b) => (a.metrics.effectiveCostPerGB ?? 999) - (b.metrics.effectiveCostPerGB ?? 999)
  );
}

export function getBrandMinMonthlyStats(brand: BrandData) {
  const plans = getPlansByBrand(brand.slug);
  const monthlyPlans = plans.filter((p) => p.plan.cycle === 'monthly' && p.plan.category === 'regular');
  const lowestMonthly = [...monthlyPlans].sort(
    (a, b) => a.metrics.effectivePayable - b.metrics.effectivePayable
  )[0];
  const lowestMonthlyOrig = [...monthlyPlans].sort(
    (a, b) => a.plan.originalPrice - b.plan.originalPrice
  )[0];
  const periodicPlans = plans.filter((p) => p.metrics.effectiveMonthlyAvg !== null);
  const lowestEffectiveMonthlyAvg = [...periodicPlans].sort(
    (a, b) => (a.metrics.effectiveMonthlyAvg ?? 9999) - (b.metrics.effectiveMonthlyAvg ?? 9999)
  )[0];
  const lowestAnnual = plans
    .filter((p) => p.plan.cycle === 'annual')
    .sort((a, b) => a.metrics.effectivePayable - b.metrics.effectivePayable)[0];
  const lowestCostPerGB = plans
    .filter((p) => p.plan.cycle !== 'one_time' && p.metrics.effectiveCostPerGB !== null)
    .sort((a, b) => (a.metrics.effectiveCostPerGB ?? 999) - (b.metrics.effectiveCostPerGB ?? 999))[0];

  return {
    totalPlanCount: plans.length,
    lowestMonthly,
    lowestMonthlyOrig,
    lowestEffectiveMonthlyAvg,
    lowestAnnual,
    lowestCostPerGB,
  };
}
