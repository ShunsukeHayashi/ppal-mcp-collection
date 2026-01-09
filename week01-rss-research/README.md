# RSS Research MCP Server

> RSSフィードを解析して、キーワードトレンドや最新記事を調査するMCPサーバー

---

## 🚀 クイックスタート

### 1. インストール

```bash
# 解凍
unzip ppal-mcp-week1.zip
cd ppal-mcp-week1

# 依存関係インストール
npm install

# ビルド
npm run build
```

### 2. Claude Desktop に追加

`~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "rss-research": {
      "command": "node",
      "args": ["/path/to/ppal-mcp-week1/dist/index.js"]
    }
  }
}
```

### 3. 再起動

Claude Desktop を再起動

### 4. 動作確認

```
RSSで「AI agents」のトレンドを調べて
```

---

## 📦 提供ツール

### `rss_search`

キーワードでRSSフィードを検索

```typescript
// Input
{
  keyword: string,     // 検索キーワード
  sources?: string[],  // RSSソース（オプション）
  limit?: number       // 取得件数（デフォルト: 10）
}

// Output
{
  articles: [
    {
      title: string,
      link: string,
      published: string,
      summary: string,
      source: string
    }
  ],
  total: number,
  keyword: string
}
```

### `rss_subscribe`

RSSフィードを購読リストに追加

```typescript
// Input
{
  url: string,      // RSSフィードURL
  name: string      // 識別名
}
```

### `rss_list_sources`

登録済みRSSソース一覧を表示

### `rss_trending`

直近24時間のトレンドキーワードを抽出

---

## 🔧 設定

### デフォルトRSSソース

```json
{
  "sources": [
    { "name": "Hacker News", "url": "https://hnrss.org/frontpage" },
    { "name": "TechCrunch", "url": "https://techcrunch.com/feed/" },
    { "name": "The Verge", "url": "https://www.theverge.com/rss/index.xml" },
    { "name": "Ars Technica", "url": "https://feeds.arstechnica.com/arstechnica/index" }
  ]
}
```

### カスタムソース追加

```bash
# config.json を編集
vim ~/.config/ppal-rss-research/config.json
```

---

## 💡 使用例

### 例1: キーワード調査

```
「Claude MCP」に関する最新記事を10件調べて
```

### 例2: 競合調査

```
RSSで「Cursor AI」「GitHub Copilot」の記事を比較して
```

### 例3: トレンド把握

```
今日のテック系トレンドキーワードを教えて
```

### 例4: 日本語ソース追加

```
以下のRSSを追加して:
- はてなブックマーク テクノロジー: https://b.hatena.ne.jp/hotentry/it.rss
```

---

## 🐛 トラブルシューティング

| 症状 | 解決策 |
|------|--------|
| MCP が認識されない | Claude Desktop 再起動 |
| `node not found` | Node.js 18+ インストール |
| RSS取得エラー | ネットワーク接続確認 |
| 文字化け | UTF-8エンコーディング確認 |

---

## 📁 ファイル構成

```
ppal-mcp-week1/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts         # エントリーポイント
│   ├── tools/
│   │   ├── rss-search.ts
│   │   ├── rss-subscribe.ts
│   │   ├── rss-list.ts
│   │   └── rss-trending.ts
│   └── utils/
│       ├── parser.ts    # RSSパーサー
│       └── config.ts    # 設定管理
├── dist/                # ビルド出力
└── examples/
    ├── keyword-research.md
    └── site-monitoring.md
```

---

## 📝 ライセンス

PPAL Members Only - 再配布禁止

---

*PPAL Week 1 - RSS Research MCP v1.0*
