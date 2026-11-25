export const SYNONYM_GROUPS: string[][] = [
  ['科学上网', '魔法上网', '翻墙', '梯子', '代理网络', '机场服务', '机场'],
  ['机场优惠', '优惠码', '折扣码', '新人码', '代金券', '减免', '打折'],
  ['机场推荐', '品牌大全', '精选机场', '品牌排行', '精选品牌'],
  ['便宜机场', '低价套餐', '平价机场', '10元以下', '10元预算', '入门套餐', '学生版'],
  ['年付', '年付优惠', '年付小包', '年度保活', '长周期', '预付'],
  ['不限时', '不限时流量', '永久流量', '一次性流量', '按量计费', '流量包'],
  ['100gb', '100g', '百g流量', '轻量套餐'],
  ['200gb', '200g', '中度流量'],
  ['500gb', '500g', '大流量', '重度流量'],
  ['ai', 'chatgpt', 'openai', 'claude', 'gemini', 'midjourney', 'copilot'],
  ['netflix', 'disney+', 'youtube', '流媒体', '奈飞', '迪士尼', '4k视频'],
  ['clash', 'mihomo', 'clash verge', 'shadowrocket', '小火箭', 'v2rayn', 'sing-box', 'nextin', '客户端', '订阅链接'],
  ['灵动云', 'lingdongyun', 'ld888', '拂风', '驭浪', '破晓', '凌霄', '穿云'],
  ['大佬云', 'dalaoyun', 'dalaocloud', 'dly88', '财云', '初云', '福云'],
  ['飞v', 'flyv', 'fly20'],
  ['暮光加速', 'muguang', 'twilight', 'mm88'],
  ['微风网络', 'breezenet', '微风', 'weifeng90'],
  ['飞猫云', 'feimaoyun', 'flycat', 'flycat888'],
  ['跨界', '跨界云', 'kuajie'],
  ['闪跃', 'flashleap', 'shanyue'],
  ['唯兔云', 'v2yun', 'v2云', 'rabbit'],
  ['光速云', 'lightspeed', 'amm'],
  ['无忧', '无忧链接', 'wuyou', '79元mini'],
];

export function expandQueryTokens(rawQuery: string): string[] {
  const cleaned = rawQuery.trim().toLowerCase();
  if (!cleaned) return [];

  const rawParts = cleaned.split(/[\s,，、/+|]+/).filter(Boolean);
  const tokenSet = new Set<string>([cleaned, ...rawParts]);

  for (const part of rawParts) {
    for (const group of SYNONYM_GROUPS) {
      if (group.some((term) => term === part || (part.length >= 2 && term.includes(part)))) {
        for (const syn of group) {
          tokenSet.add(syn);
        }
      }
    }
    // Extract Chinese bigrams for partial Chinese phrase matching
    const cjk = part.match(/[\u4e00-\u9fa5]{2,}/g);
    if (cjk) {
      for (const seq of cjk) {
        for (let i = 0; i < seq.length - 1; i++) {
          tokenSet.add(seq.slice(i, i + 2));
        }
      }
    }
  }

  return Array.from(tokenSet);
}
