# 网站部署与 IndexNow 自动提交说明

本站通过 `astro build` 输出纯静态文件至 `dist/` 目录，可部署于 Cloudflare Pages、Vercel、Netlify 或任意支持静态托管的 Nginx 服务器。

## 一、标准静态托管配置要点

- **构建命令**：`npm run build && npm run verify`
- **输出目录**：`dist`
- **URL 规范**：
  - 全站统一使用 `https://jichangyouhui.blog` 与尾部斜杠（`trailingSlash: 'always'`）。
  - 托管层应配置：HTTP 301 重定向至 HTTPS；`www.jichangyouhui.blog` 301 重定向至 `jichangyouhui.blog`。
  - **禁止**把所有 404 不存在路径重写/重定向到首页；应将未匹配路径正确返回 HTTP 404 状态码并展示 `dist/404.html`。

## 二、IndexNow 增量提交配置步骤

本项目已在 `scripts/indexnow.mjs` 与 `.github/workflows/indexnow.yml` 中实现按构建产物哈希比对的**增量 IndexNow 提交**（仅在 URL 新增、内容变更或删除时提交变动列表，不会每次构建无差别提交全站）。

启用步骤：
1. 生成一个 32 位十六进制随机密钥（例如 `openssl rand -hex 16`）。
2. 在 `public/` 目录下创建以该密钥命名的文本文件：`public/<YOUR_KEY>.txt`，文件内容仅包含 `<YOUR_KEY>` 本身。
3. 在部署平台或 GitHub Repository Secrets 中添加环境变量 `INDEXNOW_KEY=<YOUR_KEY>`。
4. 首次部署上线后，确认 `https://jichangyouhui.blog/<YOUR_KEY>.txt` 可正常访问并输出该密钥文本。
5. 此后执行 `npm run build && npm run indexnow`（或触发 GitHub Action），脚本会自动比对 `.indexnow-manifest.json` 并将本次发生变化的正式 URL 提交至 `https://api.indexnow.org/indexnow`。
