/**
 * 编辑精选展示顺序配置（非独立性能测速排名）。
 * 依据品牌资料完整度与站内编辑展示顺序排列；
 * 仅收录已提交可核实资料的品牌。
 */
export interface BrandOrderEntry {
  slug: string;
  name: string;
  featuredRank: number;
  featuredOnHome: boolean;
  selectionReason: string;
}

export const BRAND_ORDER: BrandOrderEntry[] = [
  {
    slug: 'lingdongyun',
    name: '灵动云',
    featuredRank: 1,
    featuredOnHome: true,
    selectionReason: '29 档全周期套餐资料已逐档核对，提供 ld888 八折码与年付小包、一次性流量包及定制档位',
  },
  {
    slug: 'muguang-jiasu',
    name: '暮光加速',
    featuredRank: 2,
    featuredOnHome: true,
    selectionReason: '覆盖年付轻量版、月/季/半年/年常规套餐及三档不限时流量包，共 21 条价格记录',
  },
  {
    slug: 'breezenet',
    name: '微风网络',
    featuredRank: 3,
    featuredOnHome: true,
    selectionReason: '200GB/月高起步流量档位搭配清风年付小包及不限时流量包，标注全节点 1× 倍率',
  },
  {
    slug: 'feimaoyun',
    name: '飞猫云',
    featuredRank: 4,
    featuredOnHome: true,
    selectionReason: '涵盖 ¥84/年学生版、星耀至宇宙多周期档位、1TB 不限时包及定制专线共 19 条记录',
  },
  {
    slug: 'flyv',
    name: 'FLYV',
    featuredRank: 5,
    featuredOnHome: true,
    selectionReason: '21 档套餐已于 2026-10-31 逐档核对，支持 fly20 新用户首单 8 折码（常规周期）',
  },
  {
    slug: 'wavenet',
    name: '浪网',
    featuredRank: 6,
    featuredOnHome: true,
    selectionReason: '主打月付高流量纯专线档位（150GB–2000GB/月）与定制线路包，支持 lw888 首单优惠码',
  },
  {
    slug: 'dalaoyun',
    name: '大佬云',
    featuredRank: 7,
    featuredOnHome: true,
    selectionReason: '提供年付活动包、常规周期套餐及不限时流量包，保留 2026-11-07 后台验券 dly88 七折记录',
  },
  {
    slug: 'yinxingren',
    name: '隐形人',
    featuredRank: 8,
    featuredOnHome: true,
    selectionReason: '星耀风暴年付小包与白银/黄金/铂金/钻石常规周期覆盖 80GB–1600GB/月梯度',
  },
  {
    slug: 'wuyou',
    name: '无忧',
    featuredRank: 9,
    featuredOnHome: true,
    selectionReason: 'MINI 链接 ¥79/年与舒心/省心/随心/忘忧四档周期及不限时包，月付 ¥19 起',
  },
  {
    slug: 'firefly',
    name: 'Firefly',
    featuredRank: 10,
    featuredOnHome: true,
    selectionReason: '提供 ¥96/年小包、Lite 至 Nova 月/季/年周期档位及 ¥100 不限时 100GB 包',
  },
  {
    slug: 'quanqiuyun',
    name: '全球云',
    featuredRank: 11,
    featuredOnHome: true,
    selectionReason: '含轻量版年付、四档周期订阅、三档不限时流量包及独享专线共 21 条价格记录',
  },
  {
    slug: 'v2yun',
    name: '唯兔云',
    featuredRank: 12,
    featuredOnHome: true,
    selectionReason: '共 25 档套餐记录，覆盖 ¥79.9 年付限量款、¥14.9 起月付及三档永久不限时流量包',
  },
  {
    slug: 'lingmao',
    name: '灵猫',
    featuredRank: 13,
    featuredOnHome: true,
    selectionReason: '提供 ¥85/年小包及 Small/Big 周期套餐，记录 lingmao 优惠码（9 折/8 折多版本记录）',
  },
  {
    slug: 'flashleap',
    name: '闪跃',
    featuredRank: 14,
    featuredOnHome: true,
    selectionReason: '覆盖 ¥96/年轻量版与闪动/飞跃/瞬移/跃迁月季年档位，记录 shanyue 八折码',
  },
  {
    slug: 'laddercloud',
    name: '梯子云',
    featuredRank: 15,
    featuredOnHome: false,
    selectionReason: '包含 ¥89/年保活方案与初阶至顶阶 125GB–1600GB/月周期方案，共 14 条记录',
  },
  {
    slug: 'lightspeed',
    name: '光速云',
    featuredRank: 16,
    featuredOnHome: false,
    selectionReason: '覆盖 10+ 节点地区及原生家宽定制方案，支持优惠码 AMM（具体折扣以结算页为准）',
  },
  {
    slug: 'u1s1',
    name: 'U1S1',
    featuredRank: 17,
    featuredOnHome: false,
    selectionReason: '提供就是好用包 ¥96/年及 120GB–1500GB/月四档全周期套餐，共 17 条记录',
  },
  {
    slug: 'sogoyun',
    name: 'Sogo云',
    featuredRank: 18,
    featuredOnHome: false,
    selectionReason: '含小包年付版、常规月/季/年周期及四档不限时流量包共 17 条价格记录',
  },
  {
    slug: 'kuajie',
    name: '跨界',
    featuredRank: 19,
    featuredOnHome: false,
    selectionReason: '公开说明新人码 kuajie 全场 8 折且可叠加年付/两年/三年周期折扣',
  },
];

export const BRAND_ORDER_MAP = new Map(BRAND_ORDER.map((b) => [b.slug, b]));
