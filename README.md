[![Built by 合同会社みやび](https://img.shields.io/badge/Built%20by-合同会社みやび-blue?style=flat-square&logo=github)](https://miyabi-ai.jp)

# PPAL MCP Collection

> Pro Prompt Agent Lab メンバー限定 MCPサーバー集

## Week 1 MCPs

| MCP | Description | Status |
|-----|-------------|--------|
| [week01-rss-research](./week01-rss-research/) | RSS調査自動化 | ✅ Available |
| [week01-phantom-mcp](./week01-phantom-mcp/) | Web自動化（Playwright） | ✅ Available |

## インストール方法

各MCPフォルダのREADME.mdを参照してください。

### 基本手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/ShunsukeHayashi/ppal-mcp-collection.git

# 2. 使いたいMCPのディレクトリに移動
cd ppal-mcp-collection/week01-rss-research

# 3. 依存関係インストール
npm install

# 4. ビルド
npm run build

# 5. Claude Desktop設定に追加
# claude_desktop_config.json に追記
```

## 週次アップデート

毎週新しいMCPが追加されます。

```bash
# 最新版を取得
git pull origin main
```

## サポート

質問があればDiscordコミュニティでお気軽にどうぞ！

---

**Private - PPAL Members Only**
再配布禁止
