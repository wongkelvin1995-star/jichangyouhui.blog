export type BillingCycle =
  | 'monthly'
  | 'quarterly'
  | 'semiannual'
  | 'annual'
  | 'biennial'
  | 'triennial'
  | 'one_time';

export type PlanCategory = 'regular' | 'annual_lite' | 'one_time' | 'dedicated';

export type CouponEvidenceLevel =
  | 'brand_public'
  | 'third_party_verified'
  | 'third_party_recorded'
  | 'user_submitted_partial'
  | 'historical_archived';

export interface CouponInfo {
  id: string;
  brandSlug: string;
  brandName: string;
  code: string;
  activityName: string;
  /** 实付比例，例如 0.8 表示 8 折（减免 20%）；若公开资料未确认具体比例则为 null */
  discountMultiplier: number | null;
  discountLabel: string;
  /** 仅当存在明确可计算的折扣比例时为 true */
  calculable: boolean;
  /** 适用于哪些套餐 ID 或说明 */
  applicablePlansText: string;
  excludedPlanCategories?: PlanCategory[];
  excludedPlanNames?: string[];
  userEligibility: string;
  renewalRule: string;
  stackableNote: string;
  validPeriodText: string;
  status: 'active' | 'unconfirmed_rate' | 'historical';
  evidenceLevel: CouponEvidenceLevel;
  evidenceNote: string;
  howToUse: string[];
  lastCheckedDate: string;
  /** 若存在不同来源折扣冲突，记录区间说明 */
  conflictNote?: string;
}

export interface PlanRecord {
  id: string;
  brandSlug: string;
  planName: string;
  category: PlanCategory;
  cycle: BillingCycle;
  cycleLabel: string;
  cycleMonths: number | null; // null for one_time
  originalPrice: number;
  monthlyTrafficGB: number | null; // null for one_time
  totalPeriodGB: number | null;
  resetRule: string;
  multiplierNote: string;
  speedLimit: string;
  deviceLimit: string;
  lineTags: string[];
  notes: string;
  recordDate: string;
  verificationLevel: 'verified' | 'historical_ref';
  /** 是否允许叠加该品牌的主优惠码进行折后价计算 */
  couponEligible: boolean;
}

export interface ClientCompatibility {
  platform: string;
  supportStatus: string;
  condition: string;
}

export interface BrandFaq {
  question: string;
  answer: string;
}

export interface BrandSourceRef {
  label: string;
  url?: string;
  date: string;
  note: string;
}

export interface BrandData {
  slug: string;
  name: string;
  englishName: string;
  aliases: string[];
  tagline: string;
  summary: string;
  positioning: string;
  officialSiteUrl?: string;
  officialSiteNote?: string;
  /** 用户指定的唯一专属 AFF 推广链接，必须完整保留所有参数 */
  affLink: string;
  affCode: string;
  establishedNote: string;
  paymentMethods: string[];
  protocols: string[];
  lineTypes: string[];
  nodeRegions: string[];
  nodeCountNote?: string;
  deviceLimitSummary: string;
  trafficResetSummary: string;
  multiplierSummary: string;
  thirdPartySubscriptionPolicy: string;
  clients: ClientCompatibility[];
  aiSupport: { platform: string; note: string }[];
  streamingSupport: { platform: string; note: string }[];
  usageScenarios: ('daily' | 'ai' | 'streaming' | 'remote_work' | 'gaming' | 'multi_device')[];
  refundAndUpgradePolicy: string;
  customerServiceNote: string;
  pros: string[];
  limitations: string[];
  suitableFor: string[];
  notSuitableFor: string[];
  priceSourceNote: string;
  priceConflictNote?: string;
  priceRecordDate: string;
  lastUpdatedDate: string;
  plans: PlanRecord[];
  coupons: CouponInfo[];
  faqs: BrandFaq[];
  sources: BrandSourceRef[];
}
