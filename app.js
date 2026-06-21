const COLS = 4;
const ROWS = 10;
const ROOM_COUNT = 4;
const STORAGE_KEY = "rj-pq-platform-memory-v1";
const LANG_KEY = "rj-pq-lang";

const messages = {
  "zh-TW": {
    documentTitle: "羅密歐與茱麗葉 · 平台記憶",
    title: "羅密歐與茱麗葉",
    subtitle: "平台記憶工具 · 四房間 4×10",
    legendSuccess: "左鍵：我成功的平台",
    legendFail: "右鍵：他人成功 / 我失敗",
    legendClear: "再點一次：清除標記",
    roomNavLabel: "房間選擇",
    room: (n) => `房間 ${n}`,
    success: (n) => `成功 ${n}`,
    fail: (n) => `失敗 ${n}`,
    remaining: (n) => `未試 ${n}`,
    col: (n) => `列 ${n}`,
    cellLabel: (row, col) => `第 ${row} 排，第 ${col} 列`,
    gridLabel: "平台格子",
    clearRoom: "清除此房間",
    clearAll: "清除全部房間",
    footerAutosave: "資料自動儲存於瀏覽器本機 · 關閉後仍保留",
    footerOnline: "隊伍資料即時同步 · 所有隊友看到相同標記",
    exportJson: "匯出 JSON",
    importJson: "匯入 JSON",
    confirmClearRoom: (n) => `確定要清除房間 ${n} 的所有標記嗎？`,
    confirmClearAll: "確定要清除全部四個房間的記錄嗎？",
    confirmLeaveParty: "離開隊伍後改回單人模式，確定嗎？",
    importSuccess: "匯入成功！",
    importFail: "匯入失敗，請確認 JSON 格式正確。",
    langSwitch: "EN",
    langSwitchAria: "切換為英文",
    soloTab: "單人模式",
    createTab: "開立隊伍",
    joinTab: "加入隊伍",
    soloHint: "資料只存在本機，適合自己練習或單人使用。",
    soloHintNoFirebase: "雲端隊伍尚未設定 Firebase，目前只能使用單人模式。請參考 README 設定。",
    createPasswordLabel: "隊伍密碼",
    createSubmit: "建立隊伍",
    joinCodeLabel: "隊伍代碼",
    joinPasswordLabel: "隊伍密碼",
    joinSubmit: "加入隊伍",
    partyOnline: (code) => `隊伍 <span class="party-code">${code}</span> · 即時同步中`,
    partyOffline: "連線中斷，正在重連…",
    partyClosed: "隊伍已不存在",
    copyLink: "複製連結",
    leaveParty: "離開隊伍",
    copyLinkSuccess: "連結已複製！傳給隊友即可加入。",
    copyLinkFail: "無法複製，請手動分享網址與隊伍代碼。",
    createSuccess: (code) => `隊伍建立成功！代碼：${code}\n請把代碼與密碼告訴隊友。`,
    joinFailNotFound: "找不到這個隊伍代碼。",
    joinFailPassword: "密碼錯誤。",
    joinFailGeneric: "加入失敗，請稍後再試。",
    createFailGeneric: "建立失敗，請稍後再試。",
  },
  en: {
    documentTitle: "Romeo & Juliet · Platform Memory",
    title: "Romeo & Juliet",
    subtitle: "Platform tracker · 4 rooms, 4×10",
    legendSuccess: "Left click: my success",
    legendFail: "Right click: others' success / my fail",
    legendClear: "Click again: clear mark",
    roomNavLabel: "Room selection",
    room: (n) => `Room ${n}`,
    success: (n) => `Success ${n}`,
    fail: (n) => `Fail ${n}`,
    remaining: (n) => `Untried ${n}`,
    col: (n) => `Col ${n}`,
    cellLabel: (row, col) => `Row ${row}, Col ${col}`,
    gridLabel: "Platform grid",
    clearRoom: "Clear this room",
    clearAll: "Clear all rooms",
    footerAutosave: "Data auto-saved locally · persists after closing",
    footerOnline: "Party data syncs in real time · all members see the same marks",
    exportJson: "Export JSON",
    importJson: "Import JSON",
    confirmClearRoom: (n) => `Clear all marks in room ${n}?`,
    confirmClearAll: "Clear all records in all four rooms?",
    confirmLeaveParty: "Leave party and return to solo mode?",
    importSuccess: "Import successful!",
    importFail: "Import failed. Please check the JSON format.",
    langSwitch: "中文",
    langSwitchAria: "Switch to Chinese",
    soloTab: "Solo",
    createTab: "Create party",
    joinTab: "Join party",
    soloHint: "Data stays on this device only.",
    soloHintNoFirebase: "Cloud party is not configured yet. See README to set up Firebase.",
    createPasswordLabel: "Party password",
    createSubmit: "Create party",
    joinCodeLabel: "Party code",
    joinPasswordLabel: "Party password",
    joinSubmit: "Join party",
    partyOnline: (code) => `Party <span class="party-code">${code}</span> · live sync`,
    partyOffline: "Disconnected · reconnecting…",
    partyClosed: "Party no longer exists",
    copyLink: "Copy link",
    leaveParty: "Leave party",
    copyLinkSuccess: "Link copied! Share it with your party.",
    copyLinkFail: "Could not copy. Share the URL and party code manually.",
    createSuccess: (code) => `Party created! Code: ${code}\nShare the code and password with your party.`,
    joinFailNotFound: "Party code not found.",
    joinFailPassword: "Wrong password.",
    joinFailGeneric: "Could not join. Please try again.",
    createFailGeneric: "Could not create party. Please try again.",
  },
};

function loadLanguage() {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved === "zh-TW" || saved === "en") return saved;
  return navigator.language.startsWith("zh") ? "zh-TW" : "en";
}

const state = {
  currentRoom: 0,
  lang: loadLanguage(),
  rooms: loadState(),
  partyMode: "solo",
  partyId: null,
  partyConnected: false,
  partyPanelMode: "solo",
};

function t(key, ...args) {
  const value = messages[state.lang][key];
  return typeof value === "function" ? value(...args) : value;
}

const els = {
  roomTabs: document.getElementById("roomTabs"),
  roomTitle: document.getElementById("roomTitle"),
  colLabels: document.getElementById("colLabels"),
  rowLabels: document.getElementById("rowLabels"),
  platformGrid: document.getElementById("platformGrid"),
  successCount: document.getElementById("successCount"),
  failCount: document.getElementById("failCount"),
  remainingCount: document.getElementById("remainingCount"),
  clearRoomBtn: document.getElementById("clearRoomBtn"),
  clearAllBtn: document.getElementById("clearAllBtn"),
  exportBtn: document.getElementById("exportBtn"),
  importBtn: document.getElementById("importBtn"),
  importFile: document.getElementById("importFile"),
  pageTitle: document.getElementById("pageTitle"),
  pageSubtitle: document.getElementById("pageSubtitle"),
  legendSuccess: document.getElementById("legendSuccess"),
  legendFail: document.getElementById("legendFail"),
  legendClear: document.getElementById("legendClear"),
  footerText: document.getElementById("footerText"),
  langToggle: document.getElementById("langToggle"),
  partyPanel: document.getElementById("partyPanel"),
  soloTab: document.getElementById("soloTab"),
  createTab: document.getElementById("createTab"),
  joinTab: document.getElementById("joinTab"),
  soloHint: document.getElementById("soloHint"),
  createForm: document.getElementById("createForm"),
  joinForm: document.getElementById("joinForm"),
  createPassword: document.getElementById("createPassword"),
  joinCode: document.getElementById("joinCode"),
  joinPassword: document.getElementById("joinPassword"),
  createPasswordLabel: document.getElementById("createPasswordLabel"),
  createSubmitBtn: document.getElementById("createSubmitBtn"),
  joinCodeLabel: document.getElementById("joinCodeLabel"),
  joinPasswordLabel: document.getElementById("joinPasswordLabel"),
  joinSubmitBtn: document.getElementById("joinSubmitBtn"),
  partyOnlineBar: document.getElementById("partyOnlineBar"),
  partyOnlineText: document.getElementById("partyOnlineText"),
  partyStatusDot: document.getElementById("partyStatusDot"),
  copyLinkBtn: document.getElementById("copyLinkBtn"),
  leavePartyBtn: document.getElementById("leavePartyBtn"),
};

function createEmptyRoom() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function createEmptyRooms() {
  return Array.from({ length: ROOM_COUNT }, createEmptyRoom);
}

function normalizeRooms(rooms) {
  if (!Array.isArray(rooms) || rooms.length !== ROOM_COUNT) return createEmptyRooms();
  return rooms.map((room) => {
    if (!Array.isArray(room) || room.length !== ROWS) return createEmptyRoom();
    return room.map((row) => {
      if (!Array.isArray(row) || row.length !== COLS) return Array(COLS).fill(null);
      return row.map((cell) => (cell === "success" || cell === "fail" ? cell : null));
    });
  });
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createEmptyRooms();
    return normalizeRooms(JSON.parse(raw));
  } catch {
    return createEmptyRooms();
  }
}

function saveState() {
  if (state.partyMode === "solo") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.rooms));
  }
}

function saveLanguage() {
  localStorage.setItem(LANG_KEY, state.lang);
}

function persistRooms() {
  saveState();
  if (state.partyMode === "online" && state.partyId) {
    PartySync.pushRooms(state.partyId, state.rooms);
  }
}

function countRoomStats(room) {
  let success = 0;
  let fail = 0;

  for (const row of room) {
    for (const cell of row) {
      if (cell === "success") success += 1;
      if (cell === "fail") fail += 1;
    }
  }

  return {
    success,
    fail,
    remaining: COLS * ROWS - success - fail,
  };
}

function getShareUrl(partyId) {
  const url = new URL(window.location.href);
  url.searchParams.set("party", partyId);
  return url.toString();
}

function renderPartyPanel() {
  const firebaseReady = PartySync.isConfigured();

  els.soloTab.textContent = t("soloTab");
  els.createTab.textContent = t("createTab");
  els.joinTab.textContent = t("joinTab");
  els.createPasswordLabel.textContent = t("createPasswordLabel");
  els.createSubmitBtn.textContent = t("createSubmit");
  els.joinCodeLabel.textContent = t("joinCodeLabel");
  els.joinPasswordLabel.textContent = t("joinPasswordLabel");
  els.joinSubmitBtn.textContent = t("joinSubmit");
  els.copyLinkBtn.textContent = t("copyLink");
  els.leavePartyBtn.textContent = t("leaveParty");

  els.createTab.disabled = !firebaseReady;
  els.joinTab.disabled = !firebaseReady;

  document.querySelectorAll(".party-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.partyMode === state.partyPanelMode);
  });

  if (state.partyMode === "online") {
    els.partyOnlineBar.classList.remove("hidden");
    els.createForm.classList.add("hidden");
    els.joinForm.classList.add("hidden");
    els.soloHint.classList.add("hidden");
    els.soloTab.disabled = true;
    els.createTab.disabled = true;
    els.joinTab.disabled = true;

    if (state.partyConnected) {
      els.partyOnlineText.innerHTML = t("partyOnline", state.partyId);
      els.partyStatusDot.className = "party-online__dot connected";
    } else {
      els.partyOnlineText.textContent = t("partyOffline");
      els.partyStatusDot.className = "party-online__dot disconnected";
    }
    return;
  }

  els.partyOnlineBar.classList.add("hidden");
  els.soloTab.disabled = false;

  els.soloHint.textContent = firebaseReady ? t("soloHint") : t("soloHintNoFirebase");
  els.soloHint.classList.toggle("hidden", state.partyPanelMode !== "solo");
  els.createForm.classList.toggle("hidden", state.partyPanelMode !== "create");
  els.joinForm.classList.toggle("hidden", state.partyPanelMode !== "join");
}

function renderStaticText() {
  document.documentElement.lang = state.lang;
  document.title = t("documentTitle");
  els.pageTitle.textContent = t("title");
  els.pageSubtitle.textContent = t("subtitle");
  els.legendSuccess.textContent = t("legendSuccess");
  els.legendFail.textContent = t("legendFail");
  els.legendClear.textContent = t("legendClear");
  els.roomTabs.setAttribute("aria-label", t("roomNavLabel"));
  els.platformGrid.setAttribute("aria-label", t("gridLabel"));
  els.clearRoomBtn.textContent = t("clearRoom");
  els.clearAllBtn.textContent = t("clearAll");
  els.exportBtn.textContent = t("exportJson");
  els.importBtn.textContent = t("importJson");
  els.footerText.textContent = state.partyMode === "online" ? t("footerOnline") : t("footerAutosave");
  els.langToggle.textContent = t("langSwitch");
  els.langToggle.setAttribute("aria-label", t("langSwitchAria"));
  renderPartyPanel();
}

function renderTabs() {
  els.roomTabs.innerHTML = "";

  state.rooms.forEach((room, index) => {
    const stats = countRoomStats(room);
    const tab = document.createElement("button");
    tab.type = "button";
    tab.className = `room-tab${index === state.currentRoom ? " active" : ""}`;
    tab.innerHTML = `
      ${t("room", index + 1)}
      <span class="room-tab__badge">✓${stats.success} ✕${stats.fail}</span>
    `;
    tab.addEventListener("click", () => {
      state.currentRoom = index;
      render();
    });
    els.roomTabs.appendChild(tab);
  });
}

function renderLabels() {
  els.colLabels.innerHTML = `<span></span>${Array.from({ length: COLS }, (_, i) => `<span>${t("col", i + 1)}</span>`).join("")}`;
  els.rowLabels.innerHTML = Array.from({ length: ROWS }, (_, i) => `<span>${ROWS - i}</span>`).join("");
}

function renderGrid() {
  const room = state.rooms[state.currentRoom];
  els.platformGrid.innerHTML = "";

  for (let displayRow = 0; displayRow < ROWS; displayRow += 1) {
    const rowIndex = ROWS - 1 - displayRow;
    const row = room[rowIndex];

    row.forEach((cell, colIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "platform-cell";
      button.setAttribute("role", "gridcell");
      button.setAttribute("aria-label", t("cellLabel", rowIndex + 1, colIndex + 1));

      if (cell === "success") button.classList.add("platform-cell--success");
      if (cell === "fail") button.classList.add("platform-cell--fail");

      button.addEventListener("click", (event) => {
        event.preventDefault();
        handleCellClick(rowIndex, colIndex, "success");
      });

      button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        handleCellClick(rowIndex, colIndex, "fail");
      });

      els.platformGrid.appendChild(button);
    });
  }
}

function renderStats() {
  const stats = countRoomStats(state.rooms[state.currentRoom]);
  els.roomTitle.textContent = t("room", state.currentRoom + 1);
  els.successCount.textContent = t("success", stats.success);
  els.failCount.textContent = t("fail", stats.fail);
  els.remainingCount.textContent = t("remaining", stats.remaining);
}

function handleCellClick(row, col, target) {
  const room = state.rooms[state.currentRoom];
  const current = room[row][col];
  room[row][col] = current === target ? null : target;
  persistRooms();
  render();
}

function clearRoom(roomIndex) {
  state.rooms[roomIndex] = createEmptyRoom();
  persistRooms();
  render();
}

function clearAllRooms() {
  if (!confirm(t("confirmClearAll"))) return;
  state.rooms = createEmptyRooms();
  persistRooms();
  render();
}

function exportData() {
  const payload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    rooms: state.rooms,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `rj-pq-platforms-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(String(reader.result));
      state.rooms = normalizeRooms(parsed.rooms ?? parsed);
      persistRooms();
      render();
      alert(t("importSuccess"));
    } catch {
      alert(t("importFail"));
    }
  };
  reader.readAsText(file);
}

function toggleLanguage() {
  state.lang = state.lang === "zh-TW" ? "en" : "zh-TW";
  saveLanguage();
  render();
}

function startOnlineParty(partyId, rooms) {
  state.partyMode = "online";
  state.partyId = partyId;
  state.rooms = rooms ?? createEmptyRooms();
  state.partyPanelMode = "solo";

  PartySync.subscribe(
    partyId,
    (remoteRooms) => {
      state.rooms = remoteRooms;
      render();
    },
    (connected, reason) => {
      state.partyConnected = connected && reason !== "closed";
      if (reason === "closed") {
        alert(t("partyClosed"));
        leaveOnlineParty(false);
        return;
      }
      renderPartyPanel();
    }
  );

  render();
}

function leaveOnlineParty(confirmFirst = true) {
  if (confirmFirst && !confirm(t("confirmLeaveParty"))) return;

  PartySync.leaveParty();
  state.partyMode = "solo";
  state.partyId = null;
  state.partyConnected = false;
  state.partyPanelMode = "solo";
  state.rooms = loadState();

  const url = new URL(window.location.href);
  url.searchParams.delete("party");
  window.history.replaceState({}, "", url);

  render();
}

async function handleCreateParty(event) {
  event.preventDefault();
  const password = els.createPassword.value;
  if (!password) return;

  els.createSubmitBtn.disabled = true;

  try {
    const partyId = await PartySync.createParty(password, createEmptyRooms());
    alert(t("createSuccess", partyId));
    els.createPassword.value = "";
    startOnlineParty(partyId, createEmptyRooms());

    const url = new URL(window.location.href);
    url.searchParams.set("party", partyId);
    window.history.replaceState({}, "", url);
  } catch (error) {
    if (error.message === "not_configured") {
      alert(t("soloHintNoFirebase"));
    } else {
      alert(t("createFailGeneric"));
    }
  } finally {
    els.createSubmitBtn.disabled = false;
  }
}

async function handleJoinParty(event) {
  event.preventDefault();
  const partyId = els.joinCode.value.trim().toUpperCase();
  const password = els.joinPassword.value;
  if (!partyId || !password) return;

  els.joinSubmitBtn.disabled = true;

  try {
    const result = await PartySync.joinParty(partyId, password);
    els.joinCode.value = "";
    els.joinPassword.value = "";
    startOnlineParty(result.partyId, result.rooms ?? createEmptyRooms());

    const url = new URL(window.location.href);
    url.searchParams.set("party", result.partyId);
    window.history.replaceState({}, "", url);
  } catch (error) {
    if (error.message === "not_found") alert(t("joinFailNotFound"));
    else if (error.message === "wrong_password") alert(t("joinFailPassword"));
    else alert(t("joinFailGeneric"));
  } finally {
    els.joinSubmitBtn.disabled = false;
  }
}

async function copyPartyLink() {
  if (!state.partyId) return;

  try {
    await navigator.clipboard.writeText(getShareUrl(state.partyId));
    alert(t("copyLinkSuccess"));
  } catch {
    alert(t("copyLinkFail"));
  }
}

function setPartyPanelMode(mode) {
  if (state.partyMode === "online") return;
  state.partyPanelMode = mode;
  renderPartyPanel();
}

function render() {
  renderStaticText();
  renderTabs();
  renderLabels();
  renderGrid();
  renderStats();
}

document.querySelectorAll(".party-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    if (tab.disabled) return;
    setPartyPanelMode(tab.dataset.partyMode);
  });
});

els.clearRoomBtn.addEventListener("click", () => {
  if (!confirm(t("confirmClearRoom", state.currentRoom + 1))) return;
  clearRoom(state.currentRoom);
});

els.clearAllBtn.addEventListener("click", clearAllRooms);
els.exportBtn.addEventListener("click", exportData);
els.importBtn.addEventListener("click", () => els.importFile.click());
els.importFile.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) importData(file);
  event.target.value = "";
});
els.langToggle.addEventListener("click", toggleLanguage);
els.createForm.addEventListener("submit", handleCreateParty);
els.joinForm.addEventListener("submit", handleJoinParty);
els.copyLinkBtn.addEventListener("click", copyPartyLink);
els.leavePartyBtn.addEventListener("click", () => leaveOnlineParty(true));

const urlPartyCode = new URLSearchParams(window.location.search).get("party");
if (urlPartyCode) {
  els.joinCode.value = urlPartyCode.toUpperCase();
  state.partyPanelMode = "join";
}

render();
