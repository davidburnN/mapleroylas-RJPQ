# 羅密歐與茱麗葉 · 平台記憶工具

楓之谷羅密歐與茱麗葉組隊任務的平台關卡記憶網頁（純本機版）。

---

## 功能

- 四個房間，每房間 4x10 平台
- 左鍵標記成功、右鍵標記失敗
- 支援中英切換
- 資料存於瀏覽器 localStorage
- 支援匯出/匯入 JSON

---

## 使用方式

1. 開啟網頁
2. 切換房間並標記平台
3. 需要時匯出 JSON 備份

---

## 操作說明

| 操作 | 功能 |
|------|------|
| 左鍵 | 標記你成功的平台（綠色 ✓） |
| 右鍵 | 標記他人成功或你失敗的平台（紅色 ✕） |
| 再點一次 | 清除該格 |
| 右上角 EN/中文 | 切換語言 |

左側排數由上到下為 **10 → 1**。

---

## 本地開發

預覽：

```bash
npx serve .
```

測試：

```bash
npm install
npm test
```

---

## CI

- Workflow：`.github/workflows/ci.yml`
- 觸發：`push` 到 `main` 或 `pull_request`
- 內容：`npm ci` + `npm test`

---

## 檔案說明

| 檔案 | 說明 |
|------|------|
| `index.html` | 主頁面 |
| `app.js` | 格子邏輯與語言切換 |
| `styles.css` | UI 樣式 |
| `.github/workflows/ci.yml` | 自動測試（CI） |
| `tests/app.test.js` | 前端互動測試 |
