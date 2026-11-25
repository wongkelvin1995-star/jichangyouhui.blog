import type { BrandData, CouponInfo } from '../../types/airport';
import { BRAND_ORDER, BRAND_ORDER_MAP } from '../brand-order';
import { GROUP1_BRANDS } from './group1';
import { GROUP2_BRANDS } from './group2';
import { GROUP3_BRANDS } from './group3';
import { GROUP4_BRANDS } from './group4';

const RAW_BRANDS: BrandData[] = [
  ...GROUP1_BRANDS,
  ...GROUP2_BRANDS,
  ...GROUP3_BRANDS,
  ...GROUP4_BRANDS,
];

export const ALL_BRANDS: BrandData[] = [...RAW_BRANDS].sort((a, b) => {
  const rankA = BRAND_ORDER_MAP.get(a.slug)?.featuredRank ?? 999;
  const rankB = BRAND_ORDER_MAP.get(b.slug)?.featuredRank ?? 999;
  return rankA - rankB;
});

export const BRAND_MAP = new Map<string, BrandData>(ALL_BRANDS.map((b) => [b.slug, b]));

export const HOME_FEATURED_BRANDS: BrandData[] = ALL_BRANDS.filter(
  (b) => BRAND_ORDER_MAP.get(b.slug)?.featuredOnHome ?? false
);

export function getBrandBySlug(slug: string): BrandData | undefined {
  return BRAND_MAP.get(slug);
}

export function getBrandRank(slug: string): number {
  return BRAND_ORDER_MAP.get(slug)?.featuredRank ?? 999;
}

export interface CouponWithBrandMeta extends CouponInfo {
  brandAffLink: string;
  brandRank: number;
  brandTagline: string;
}

export const ALL_COUPONS: CouponWithBrandMeta[] = ALL_BRANDS.flatMap((brand) =>
  brand.coupons.map((coupon) => ({
    ...coupon,
    brandAffLink: brand.affLink,
    brandRank: getBrandRank(brand.slug),
    brandTagline: brand.tagline,
  }))
);

export const ACTIVE_CALCULABLE_COUPONS = ALL_COUPONS.filter(
  (c) => c.status === 'active' && c.calculable
);

export const RECORDED_COUPONS = ALL_COUPONS.filter(
  (c) => c.status === 'active' || c.status === 'unconfirmed_rate'
);

export const HISTORICAL_COUPONS = ALL_COUPONS.filter((c) => c.status === 'historical');

export { BRAND_ORDER };
