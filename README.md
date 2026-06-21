# 羅密歐與茱麗葉 · 平台記憶工具

楓之谷羅密歐與茱麗葉組隊任務的平台關卡記憶網頁。支援單人本機記錄，以及**開立隊伍、密碼加入、隊友即時共同編輯**。

---

## 一、部署成 GitHub 公開網站

GitHub Pages 可以免費托管靜態網頁。本專案已包含自動部署設定。

### 步驟 1：建立 GitHub 倉庫

1. 到 [GitHub](https://github.com/new) 建立新 repository（例如 `mapleroylas-RJPQ`）
2. 在本機專案資料夾執行：

```bash
git init
git add .
git commit -m "Initial commit: RJ PQ platform tracker"
git branch -M main
git remote add origin https://github.com/你的帳號/mapleroylas-RJPQ.git
git push -u origin main
```

### 步驟 2：開啟 GitHub Pages

1. 進入 repository → **Settings** → **Pages**
2. **Build and deployment** → Source 選 **GitHub Actions**
3. 推送 `main` 分支後，`.github/workflows/pages.yml` 會自動部署
4. 幾分鐘後網址會是：

```
https://你的帳號.github.io/mapleroylas-RJPQ/
```

（Settings → Pages 頁面可看到實際網址）

---

## 二、設定隊伍即時同步（Firebase）

GitHub Pages 只能放靜態檔案，**無法自己跑後端**。隊伍共同編輯使用 [Firebase Realtime Database](https://firebase.google.com/)（免費額度對小隊使用足夠）。

### 步驟 1：建立 Firebase 專案

1. 到 [Firebase Console](https://console.firebase.google.com/) → **新增專案**
2. 建立完後 → **Build** → **Realtime Database** → **Create Database**
3. 地區建議選 **asia-southeast1**（新加坡，台灣延遲較低）
4. 安全規則先選 **測試模式**（稍後會改成正式規則）

### 步驟 2：取得設定值

1. 專案概覽 → 齒輪 **Project settings**
2. 往下 **Your apps** → 點 **Web** 圖示 `</>` 新增 app
3. 複製 `firebaseConfig` 裡的各項數值

### 步驟 3：填入本專案

編輯 `firebase-config.js`，把 placeholder 換成你的設定：

```javascript
window.FIREBASE_CONFIG = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  databaseURL: "https://your-project-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "...",
};
```

> `databaseURL` 一定要填，且需與 Realtime Database 頁面顯示的 URL 一致。

### 步驟 4：設定資料庫安全規則

Firebase Console → Realtime Database → **Rules**，貼上專案內的 `database.rules.json` 內容：

```json
{
  "rules": {
    "parties": {
      "$partyId": {
        ".read": true,
        ".write": "!data.exists() || data.child('passwordHash').val() === newData.child('passwordHash').val()"
      }
    }
  }
}
```

這代表：
- 知道隊伍代碼的人可以讀取資料
- 只有知道正確密碼（雜湊後寫入）的人才能修改
- 密碼以 SHA-256 雜湊儲存，不存明文

### 步驟 5：推送更新

```bash
git add firebase-config.js
git commit -m "Configure Firebase for party sync"
git push
```

等 GitHub Actions 部署完成後，公開網站就有隊伍功能。

---

## 三、隊伍功能使用方式

### 開立隊伍（隊長）

1. 開啟網站 → 點 **開立隊伍**
2. 設定隊伍密碼 → **建立隊伍**
3. 記下 6 位 **隊伍代碼**（例如 `AB3K9M`）
4. 把 **代碼 + 密碼** 告訴隊友，或按 **複製連結** 分享（連結會帶代碼）

### 加入隊伍（隊友）

1. 點 **加入隊伍**
2. 輸入隊伍代碼與密碼 → **加入隊伍**
3. 加入後所有標記會**即時同步**，任何人左鍵/右鍵改格子，其他人馬上看到

### 單人模式

不開隊伍時，資料存在瀏覽器 localStorage，適合自己練習。

---

## 四、操作說明

| 操作 | 功能 |
|------|------|
| 左鍵 | 標記你成功的平台（綠色 ✓） |
| 右鍵 | 標記他人成功或你失敗的平台（紅色 ✕） |
| 再點一次 | 清除該格 |
| 右上角 EN/中文 | 切換語言 |

左側排數由上到下為 **10 → 1**。

---

## 五、本地預覽

```bash
npx serve .
```

瀏覽器開啟 `http://localhost:3000`。  
若未設定 Firebase，仍可使用單人模式。

---

## 六、注意事項

- 隊伍密碼是**共享密碼**，請只給隊友，不要用在其他重要帳號
- Firebase 免費方案有流量上限，一般打副本足夠
- 隊伍資料存在 Firebase，長期不用的隊伍可手動到 Firebase Console 刪除 `parties` 節點
- `firebase-config.js` 的 `apiKey` 會出現在前端，這是 Firebase Web 的正常做法；安全主要靠 Database Rules 限制

---

## 檔案說明

| 檔案 | 說明 |
|------|------|
| `index.html` | 主頁面 |
| `app.js` | 格子邏輯、語言、隊伍 UI |
| `sync.js` | Firebase 隊伍同步 |
| `firebase-config.js` | Firebase 設定（部署前必改） |
| `firebase-config.example.js` | 設定範例 |
| `database.rules.json` | Firebase 安全規則範本 |
| `.github/workflows/pages.yml` | GitHub Pages 自動部署 |
