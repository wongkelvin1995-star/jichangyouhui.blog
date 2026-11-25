# Bing SEO 与 Webmaster Tools 管理指南

本文档用于指导站长在部署 `https://jichangyouhui.blog` 后对接 **Bing Webmaster Tools**、提交 Sitemap、配置 IndexNow 以及持续追踪核心关键词排名。

## 一、接入 Bing Webmaster Tools 与站点所有权验证

1. 登录 [Bing Webmaster Tools](https://www.bing.com/webmasters/)，选择「手动添加站点」并输入 `https://jichangyouhui.blog/`。
2. 选择 **XML 文件验证（BingSiteAuth.xml）**：
   - 下载 Bing 提供的 `BingSiteAuth.xml`（或参考项目中的 `public/BingSiteAuth.xml.example` 替换其中的验证字符串）。
   - 将文件保存至 `public/BingSiteAuth.xml` 后重新构建部署，确保 `https://jichangyouhui.blog/BingSiteAuth.xml` 返回 HTTP 200。
   - 在 Bing 后台点击「验证」完成所有权确认。

## 二、提交 Sitemap

网站构建后自动输出以下规范 XML 地址：
- 主站点地图：`https://jichangyouhui.blog/sitemap.xml`
- 分库索引：`https://jichangyouhui.blog/sitemap-index.xml`（包含 `sitemap-categories.xml`、`sitemap-brands.xml`、`sitemap-articles.xml`）

在 Bing Webmaster Tools 左侧菜单进入 **Sitemaps（站点地图）** -> **Submit sitemap**，提交：
```
https://jichangyouhui.blog/sitemap.xml
```
站内 `/search/` 与 `/404/` 均已配置 `noindex, follow` 且不写入任何 Sitemap，避免生成低价值索引 URL。

## 三、使用 URL Inspection（URL 检查）与诊断

每次发布重点品牌页或调整核心栏目后，可在 Bing 后台 **URL Inspection** 输入目标网址（例如 `https://jichangyouhui.blog/brands/lingdongyun/` 或 `https://jichangyouhui.blog/coupons/`）：
1. 点击 **Test Live URL** 检查抓取状态是否返回 HTTP 200、Canonical 是否一致以及正文 HTML 是否完整输出（本站全部正文均静态生成，不依赖客户端 JS）。
2. 如页面已更新且尚未被抓取，可点击 **Request Indexing**，或通过 IndexNow 自动推送变更。

## 四、定期追踪指标清单（勿将目标当成已实现成绩）

每周建议在 Bing Webmaster Tools -> **Search Performance** 与 **Index Explorer** 中复盘以下维度：
1. **收录覆盖**：已收录页面数量 vs 未收录页面清单。
2. **品牌词与非品牌词表现**：`灵动云`、`大佬云`、`飞V` 等品牌词与 `机场优惠码`、`便宜机场`、`年付机场` 等通用词的曝光量、点击量、点击率（CTR）与平均排名位置。
3. **Mobile Usability（移动端体验）**：核查是否有布局溢出或可点击目标过小警告。
4. **Site Scan（站内扫描）**：定期扫描重复 Title、失效外链与过期优惠活动，依据真实搜索词数据优先迭代已有高价值页面。
