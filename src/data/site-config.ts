export const SITE_CONFIG = {
  name: '机场优惠',
  englishName: 'Airport Deals',
  domain: 'https://jichangyouhui.blog',
  language: 'zh-CN',
  currentYear: 2026,
  email: 'contact@jichangyouhui.blog',
  author: '机场优惠编辑部',
  homeSeo: {
    title: '2026机场优惠大全｜最新机场优惠码、机场折扣与套餐价格对比',
    h1: '2026 机场优惠大全',
    subtitle:
      '汇集机场优惠码、最新折扣活动、机场套餐价格及性价比购买指南，帮助用户根据预算、流量需求和使用场景选择适合自己的机场服务。',
    description:
      '机场优惠汇集2026年机场优惠码、机场折扣活动、便宜机场推荐、年付优惠及套餐价格对比，提供详细的机场品牌介绍、购买攻略和流量套餐分析。',
  },
  navItems: [
    { label: '首页', href: '/' },
    { label: '机场优惠', href: '/best-value/' },
    { label: '优惠码', href: '/coupons/' },
    { label: '机场推荐', href: '/brands/' },
    { label: '套餐对比', href: '/comparison/' },
    { label: '购买攻略', href: '/guides/' },
    { label: '深度文章', href: '/articles/' },
    { label: '搜索', href: '/search/' },
  ],
  quickCategories: [
    {
      title: '最新优惠',
      description: '查看各品牌已核实折扣活动与减免规则',
      href: '/coupons/#active-coupons',
      badge: '优惠专区',
    },
    {
      title: '优惠码',
      description: '一键复制全站收录的 19 家品牌优惠码',
      href: '/coupons/',
      badge: '实时工具',
    },
    {
      title: '便宜机场',
      description: '筛选月均 ¥10–¥20 区间高性价比入门套餐',
      href: '/cheap-airports/',
      badge: '预算优先',
    },
    {
      title: '年付优惠',
      description: '对比年付小包与长周期预付折算月成本',
      href: '/annual-deals/',
      badge: '长周期',
    },
    {
      title: '套餐对比',
      description: '按月付、季付、半年付、年付及流量横向筛选',
      href: '/comparison/',
      badge: '全库对比',
    },
    {
      title: '购买攻略',
      description: '优惠码用法、流量计算与售后条款阅读指南',
      href: '/guides/how-to-use-coupon/',
      badge: '新手必读',
    },
  ],
  disclosureShort:
    '本站为独立机场优惠资讯与套餐价格分析博客，非任何机场品牌官方网站。部分注册/购买链接包含推广追踪参数（AFF），通过此类链接下单可能为本站带来佣金，但不影响您的原始结账规则，且不构成速度或稳定性的客观排名。',
} as const;
