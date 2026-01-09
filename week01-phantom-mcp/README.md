# Phantom MCP: Browser Automation

> 24時間入会特典 - ブラウザ自動操作MCPサーバー

---

## 🎯 概要

Webブラウザを自動操作するMCPサーバー。スクレイピング、フォーム入力、スクリーンショットなどを実行可能。

**注意**: 24時間入会特典のため、一般公開はしていません。

---

## 🚀 クイックスタート

### インストール

```bash
unzip phantom-mcp.zip
cd phantom-mcp
npm install
npx playwright install chromium
npm run build
```

### Claude Desktop 設定

```json
{
  "mcpServers": {
    "phantom": {
      "command": "node",
      "args": ["/path/to/phantom-mcp/dist/index.js"]
    }
  }
}
```

---

## 📦 提供ツール

### `phantom_navigate`

URLに移動

```typescript
{
  url: string  // 移動先URL
}
```

### `phantom_screenshot`

スクリーンショット取得

```typescript
{
  selector?: string,  // 要素セレクタ（オプション）
  fullPage?: boolean  // フルページ（デフォルト: false）
}
```

### `phantom_click`

要素をクリック

```typescript
{
  selector: string  // CSSセレクタ
}
```

### `phantom_type`

テキスト入力

```typescript
{
  selector: string,  // 入力先セレクタ
  text: string       // 入力テキスト
}
```

### `phantom_extract`

テキスト抽出

```typescript
{
  selector: string  // 抽出対象セレクタ
}
```

---

## 💡 使用例

### 例1: Webページ情報取得

```
Phantomで https://example.com のタイトルを取得して
```

### 例2: フォーム入力

```
Phantomで検索フォームに「AI agents」と入力して検索
```

### 例3: スクリーンショット

```
Phantomで現在のページのスクリーンショットを撮って
```

---

## ⚠️ 注意事項

- robots.txt を尊重する
- レート制限に注意
- 個人情報の取り扱いに注意
- 商用利用の際は利用規約を確認

---

## 🔧 設定

### ヘッドレスモード

```javascript
// config.js
export default {
  headless: true,  // ブラウザ表示なし
  timeout: 30000,  // タイムアウト（ms）
}
```

### プロキシ設定

```javascript
export default {
  proxy: {
    server: 'http://proxy:8080'
  }
}
```

---

*Phantom MCP - PPAL 24h Bonus*
*再配布禁止*
