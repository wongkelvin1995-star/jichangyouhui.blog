import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { ALL_BRANDS, ALL_COUPONS } from '../data/brands';
import { ALL_PLANS } from '../data/plans';
import { formatYuan } from '../utils/pricing';
import type { SearchDocument } from '../utils/search-client';

export const GET: APIRoute = async () => {
  const docs: SearchDocument[] = [];

  for (const brand of ALL_BRANDS) {
    docs.push({
      id: `brand-${brand.slug}`,
      type: 'brand',
      typeLabel: '机场品牌',
      title: `${brand.name}（${brand.englishName}）优惠码与套餐解析`,
      url: `/brands/${brand.slug}/`,
      summary: brand.summary,
      category: brand.positioning,
      brandName: brand.name,
      aliases: [brand.englishName, ...brand.aliases],
      couponCodes: brand.coupons.filter((c) => c.status !== 'historical').map((c) => c.code),
      scenarios: brand.usageScenarios,
      keywords: [
        brand.name,
        brand.englishName,
        ...brand.aliases,
        ...brand.lineTypes,
        ...brand.protocols,
        ...brand.nodeRegions,
        ...brand.aiSupport.map((a) => a.platform),
        ...brand.streamingSupport.map((s) => s.platform),
      ],
      body: [
        brand.tagline,
        brand.positioning,
        brand.thirdPartySubscriptionPolicy,
        brand.refundAndUpgradePolicy,
        ...brand.pros,
        ...brand.limitations,
      ].join(' '),
    });
  }

  for (const coupon of ALL_COUPONS) {
    docs.push({
      id: `coupon-${coupon.id}`,
      type: 'coupon',
      typeLabel: coupon.status === 'historical' ? '历史优惠' : '优惠码',
      title: `${coupon.brandName} 优惠码 ${coupon.code}｜${coupon.activityName}`,
      url: `/coupons/${coupon.brandSlug}/`,
      summary: `${coupon.discountLabel}；适用：${coupon.applicablePlansText}`,
      category: '优惠码中心',
      brandName: coupon.brandName,
      couponCodes: [coupon.code],
      keywords: [coupon.brandName, coupon.code, '优惠码', '折扣', coupon.discountLabel],
      body: `${coupon.evidenceNote} ${coupon.userEligibility} ${coupon.stackableNote}`,
    });
  }

  // Group plans by brand+planName so search returns clear plan cards without flooding 300+ duplicate rows
  const seenPlanKeys = new Set<string>();
  for (const item of ALL_PLANS) {
    const key = `${item.brand.slug}:${item.plan.planName}`;
    if (seenPlanKeys.has(key)) continue;
    seenPlanKeys.add(key);

    const brandPlansSameName = ALL_PLANS.filter(
      (x) => x.brand.slug === item.brand.slug && x.plan.planName === item.plan.planName
    );
    const cycleDesc = brandPlansSameName
      .map(
        (x) =>
          `${x.plan.cycleLabel} ${formatYuan(x.metrics.effectivePayable)}${
            x.metrics.hasConfirmedDiscount ? `(折后)` : ''
          }`
      )
      .join(' / ');

    docs.push({
      id: `plan-${item.brand.slug}-${item.plan.id}`,
      type: 'plan',
      typeLabel: '套餐方案',
      title: `${item.brand.name} · ${item.plan.planName}`,
      url: `/plans/${item.brand.slug}/`,
      summary: `${
        item.plan.cycle === 'one_time'
          ? `一次性 ${item.plan.totalPeriodGB}GB 总量`
          : `${item.plan.monthlyTrafficGB}GB/月`
      } · ${cycleDesc}`,
      category: item.plan.category,
      brandName: item.brand.name,
      priceRange: cycleDesc,
      keywords: [
        item.brand.name,
        item.plan.planName,
        ...item.plan.lineTags,
        item.plan.cycleLabel,
        item.plan.monthlyTrafficGB ? `${item.plan.monthlyTrafficGB}GB` : '不限时流量',
      ],
      body: `${item.plan.notes} ${item.plan.resetRule} ${item.plan.multiplierNote}`,
    });
  }

  const articles = await getCollection('articles', (entry) => !entry.data.draft);
  for (const entry of articles) {
    const slug = entry.data.slug ?? entry.id;
    docs.push({
      id: `article-${slug}`,
      type: 'article',
      typeLabel: '深度文章',
      title: entry.data.title,
      url: `/articles/${slug}/`,
      summary: entry.data.description,
      category: entry.data.category,
      brandName: entry.data.brand,
      keywords: [entry.data.category, ...(entry.data.tags ?? []), ...(entry.data.relatedBrands ?? [])],
      body: entry.body?.replace(/[#*`>\-\[\]()]/g, ' ').slice(0, 2000) ?? '',
    });
  }

  const guides = await getCollection('guides', (entry) => !entry.data.draft);
  for (const entry of guides) {
    const slug = entry.data.slug ?? entry.id;
    docs.push({
      id: `guide-${slug}`,
      type: 'guide',
      typeLabel: '购买攻略',
      title: entry.data.title,
      url: `/guides/${slug}/`,
      summary: entry.data.description,
      category: entry.data.category,
      brandName: entry.data.brand,
      keywords: [entry.data.category, ...(entry.data.tags ?? []), ...(entry.data.relatedBrands ?? [])],
      body: entry.body?.replace(/[#*`>\-\[\]()]/g, ' ').slice(0, 2000) ?? '',
    });
  }

  return new Response(JSON.stringify(docs), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
